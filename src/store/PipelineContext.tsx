import React, { createContext, useContext, useState, useCallback } from 'react';
import { buildJobsFromPlan, type ContentJob, type JobStatus } from '../lib/workflow';
import { computeLearning, type Learning } from '../lib/agents';
import type { Industry, Stage } from '../lib/distribution';

/**
 * 全局内容流水线状态：内容工厂 与 分发看板 共享同一份 jobs。
 * 在内容工厂"采用"一条内容 → 它立刻出现在分发看板，反之拖动看板也改同一条数据。
 * 按行业分桶（jobsByIndustry），切换演示店铺时各自独立。
 */

const DEFAULT_SHOP_NAME: Record<Industry, string> = {
  restaurant: '长禧家珑厨', spa: '泰隐颂钵SPA', hotel: '安岚度假酒店',
};

// 初始种子：几条草稿(内容工厂) + 若干分发任务(看板各列)，让两页一打开就有数据
function seed(industry: Industry): ContentJob[] {
  const base = buildJobsFromPlan(industry, 'cold', DEFAULT_SHOP_NAME[industry]);
  const drafts = base.slice(0, 4); // 内容工厂草稿
  const distStatuses: JobStatus[] = ['backlog', 'backlog', 'review', 'review', 'executing', 'published', 'published'];
  const dist = base.slice(4, 4 + distStatuses.length).map((j, i) => ({
    ...j, status: distStatuses[i],
    publishedUrl: distStatuses[i] === 'published' ? 'https://...' : undefined,
    cited: distStatuses[i] === 'published' && i % 2 === 0,
  }));
  return [...drafts, ...dist];
}

interface PipelineApi {
  jobsFor: (industry: Industry) => ContentJob[];
  learningFor: (industry: Industry) => Learning;
  generateFromPlan: (industry: Industry, stage: Stage, shopName: string) => number;
  adopt: (industry: Industry, id: string) => void;
  fix: (industry: Industry, id: string) => void;
  moveTask: (industry: Industry, id: string, status: JobStatus) => void;
  backfill: (industry: Industry, id: string) => void;
  addManualTask: (industry: Industry, platform: string, publisher: ContentJob['publisher']) => void;
}

const Ctx = createContext<PipelineApi | null>(null);
export const usePipeline = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('usePipeline must be used within <PipelineProvider>');
  return c;
};

export function PipelineProvider({ children }: { children: React.ReactNode }) {
  const [byIndustry, setByIndustry] = useState<Record<Industry, ContentJob[]>>({
    restaurant: seed('restaurant'), spa: seed('spa'), hotel: seed('hotel'),
  });

  const update = useCallback((industry: Industry, fn: (jobs: ContentJob[]) => ContentJob[]) => {
    setByIndustry(prev => ({ ...prev, [industry]: fn(prev[industry]) }));
  }, []);

  const api: PipelineApi = {
    jobsFor: (industry) => byIndustry[industry],
    learningFor: (industry) => computeLearning(byIndustry[industry]),
    generateFromPlan: (industry, stage, shopName) => {
      // 采纳优化 Agent 学到的最优打法：优先补短板意图 + 偏向高命中平台
      const learning = computeLearning(byIndustry[industry]);
      const fresh = buildJobsFromPlan(industry, stage, shopName, {}, {
        weakIntents: learning.weakIntents,
        bestPlatform: learning.bestPlay?.platform,
      });
      update(industry, jobs => [...fresh, ...jobs]);
      return fresh.length;
    },
    adopt: (industry, id) => update(industry, jobs =>
      jobs.map(j => j.id === id ? { ...j, status: 'backlog' as JobStatus } : j)),
    fix: (industry, id) => update(industry, jobs =>
      jobs.map(j => j.id === id ? { ...j, compliance: 'pass', status: 'ready' as JobStatus, score: Math.max(j.score, 90) } : j)),
    moveTask: (industry, id, status) => update(industry, jobs =>
      jobs.map(j => j.id === id ? { ...j, status } : j)),
    backfill: (industry, id) => update(industry, jobs =>
      jobs.map(j => j.id === id ? { ...j, publishedUrl: 'https://...', cited: true } : j)),
    addManualTask: (industry, platform, publisher) => update(industry, jobs => [{
      id: 'job_manual_' + Date.now(),
      industry, platform, publisher,
      contentType: '自定义批次', targetIntent: '自定义', title: '定制渠道推广文案批次',
      body: '手动创建的分发任务', compliance: 'pass', score: 88, status: 'backlog' as JobStatus,
    }, ...jobs]),
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
