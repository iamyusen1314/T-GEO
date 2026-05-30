/**
 * ====== 多 Agent 编排 + 学习闭环（工作台中枢的事实源）======
 *
 * 工作台 = 一套自我进化的多 Agent 工作流：
 *   诊断Agent(找短板) → 计划Agent(排期) → 内容Agent(按短板+最优打法生成)
 *   → 合规Agent → 分发Agent(派单) → 监测Agent(被各AI引用?) → 优化Agent(学习) ↺ 回喂 计划/内容
 *
 * 「越用越聪明」靠的就是优化 Agent：把"哪条内容、哪个平台、哪种形态真被 AI 引用"
 * 沉淀为权重，回喂下一轮的计划与内容生成。本文件提供 computeLearning() 计算这套学习信号。
 */

import type { ContentJob } from './workflow';

export interface AgentDef {
  id: string;
  name: string;
  role: string;       // 一句话职责
  icon: string;       // lucide 图标名（前端按名取用）
  feedsBack?: boolean; // 是否产生回喂（优化 Agent）
}

/** 7 个 Agent（闭环顺序） */
export const AGENTS: AgentDef[] = [
  { id: 'diagnose', name: '诊断 Agent', role: '全渠道跑测，找出未被推荐的短板意图', icon: 'Search' },
  { id: 'plan',     name: '计划 Agent', role: '按短板+平台权重排出本周投喂计划', icon: 'CalendarRange' },
  { id: 'content',  name: '内容 Agent', role: '按短板+已验证最优打法生成 AI 可读内容', icon: 'Wand2' },
  { id: 'compliance', name: '合规 Agent', role: '广告法/行业敏感词过滤', icon: 'ShieldCheck' },
  { id: 'distribute', name: '分发 Agent', role: '派单给客户自营/真实达人发布', icon: 'Send' },
  { id: 'monitor',  name: '监测 Agent', role: '追踪发布内容是否被各 AI 引用', icon: 'Radar' },
  { id: 'optimize', name: '优化 Agent', role: '学习哪种打法真见效，回喂计划与内容', icon: 'Brain', feedsBack: true },
];

/** 闭环边（含优化 Agent 的回喂） */
export const AGENT_LOOP: { from: string; to: string; label?: string; feedback?: boolean }[] = [
  { from: 'diagnose', to: 'plan' },
  { from: 'plan', to: 'content' },
  { from: 'content', to: 'compliance' },
  { from: 'compliance', to: 'distribute' },
  { from: 'distribute', to: 'monitor' },
  { from: 'monitor', to: 'optimize' },
  { from: 'optimize', to: 'plan', label: '回喂最优打法', feedback: true },
  { from: 'optimize', to: 'content', label: '回喂内容角度', feedback: true },
];

export interface PlayStat { key: string; platform: string; contentType: string; cited: number; total: number; rate: number; }

export interface Learning {
  publishedCount: number;
  citedCount: number;
  citeRate: number;             // 0–1：已发布中被 AI 引用的比例
  intelligenceGain: number;     // 0–100：系统"智能增益"，随被引用样本增长
  bestPlay?: PlayStat;          // 当前最优打法（平台×内容形态）
  plays: PlayStat[];            // 各打法命中率排行
  weakIntents: string[];        // 尚未被引用覆盖的核心意图（下一轮该补）
}

/**
 * 从流水线 jobs 计算学习信号：被引用越多，智能增益越高，最优打法越清晰。
 * 这就是"越用越聪明"的量化来源。
 */
export function computeLearning(jobs: ContentJob[]): Learning {
  const published = jobs.filter(j => j.status === 'published');
  const cited = published.filter(j => j.cited);
  const citeRate = published.length ? cited.length / published.length : 0;

  // 按 平台×内容形态 聚合命中率
  const map = new Map<string, PlayStat>();
  for (const j of published) {
    const key = `${j.platform}·${j.contentType}`;
    const s = map.get(key) ?? { key, platform: j.platform, contentType: j.contentType, cited: 0, total: 0, rate: 0 };
    s.total += 1; if (j.cited) s.cited += 1;
    map.set(key, s);
  }
  const plays = [...map.values()].map(s => ({ ...s, rate: s.total ? s.cited / s.total : 0 }))
    .sort((a, b) => b.rate - a.rate || b.cited - a.cited);
  const bestPlay = plays.find(p => p.cited > 0);

  // 未被引用覆盖的核心意图（下一轮优先补）
  const citedIntents = new Set(cited.map(j => j.targetIntent));
  const weakIntents = [...new Set(jobs.map(j => j.targetIntent))]
    .filter(it => !citedIntents.has(it)).slice(0, 5);

  // 智能增益：基线 38，随被引用样本与命中率上升（封顶 99）
  const intelligenceGain = Math.min(99, Math.round(38 + cited.length * 5 + citeRate * 28));

  return {
    publishedCount: published.length, citedCount: cited.length, citeRate,
    intelligenceGain, bestPlay, plays, weakIntents,
  };
}
