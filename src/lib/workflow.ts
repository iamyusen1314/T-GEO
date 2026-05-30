/**
 * ====== GEO 内容流水线（Agent 工作流单一事实源）======
 *
 * 把「内容生产工厂」和「分发任务看板」打通成一条流水线：
 *   投喂作战计划(distribution.ts) → AI 生成内容 → 合规校验 → 一键采用 → 进分发看板 → 发布回填 → 监测反馈
 *
 * 内容工厂 和 分发看板 = 同一条流水线的两道工序，共享同一份 ContentJob（见 PipelineContext）。
 * 一个内容从"计划要发"到"被 AI 引用"，全生命周期只有一份数据、一个 id。
 */

import { expandIntents } from './intents';
import { generateWeeklyPlan, PUBLISHER_LABEL, type Industry, type PublisherType, type Stage } from './distribution';

/** 内容任务全生命周期状态 */
export type JobStatus =
  | 'draft'       // 内容工厂：AI 刚生成的草稿
  | 'ready'       // 内容工厂：合规通过、待采用
  | 'backlog'     // 分发看板：已采用，待派单
  | 'review'      // 分发看板：达人匹配 / 审核中
  | 'executing'   // 分发看板：排期执行中
  | 'published';  // 分发看板：已发布（可回填 URL → 进监测）

export const STATUS_STAGE: Record<JobStatus, 'factory' | 'distribution'> = {
  draft: 'factory', ready: 'factory',
  backlog: 'distribution', review: 'distribution', executing: 'distribution', published: 'distribution',
};

/** 一条内容任务（流水线里流转的最小单元） */
export interface ContentJob {
  id: string;
  industry: Industry;
  platform: string;            // 小红书 / 知乎 / 百度百科 ...
  publisher: PublisherType;    // 客户自营 / 真实达人 / 运营
  contentType: string;         // 场景种草 / 专业问答 / 百科词条 ...
  targetIntent: string;        // 目标意图（补哪个诊断短板）
  title: string;
  body: string;                // AI 生成正文（demo 为示意）
  compliance: 'pass' | 'needs_fix';
  score: number;               // 内容质量分
  status: JobStatus;
  publishedUrl?: string;
  cited?: boolean;             // 发布后是否已被 AI 引用
  learned?: boolean;           // 是否采纳了"优化 Agent"学到的最优打法
}

/** Agent 流水线的 6 个阶段（用于可视化 + 文档） */
export const PIPELINE_STAGES = [
  { key: 'plan',       label: '作战计划', agent: '计划引擎',  desc: '诊断短板 → 排期(发几篇/哪发/谁发)' },
  { key: 'generate',   label: 'AI 生成',  agent: '内容 Agent', desc: '知识库 + Prompt → 让 AI 读懂的内容' },
  { key: 'compliance', label: '合规校验', agent: '合规 Agent', desc: '广告法/行业敏感词过滤' },
  { key: 'adopt',      label: '一键采用', agent: '人工确认',  desc: '采用 → 自动转分发任务' },
  { key: 'distribute', label: '分发执行', agent: '派单',      desc: '客户自营 / 真实达人 发布' },
  { key: 'track',      label: '回填监测', agent: '监测 Agent', desc: '发布 URL → 是否被 AI 引用 → 反馈下一轮' },
] as const;

/** 平台 → 内容类型（决定生成什么形态的内容） */
const PLATFORM_CONTENT_TYPE: Record<string, string> = {
  '小红书': '场景种草图文', '抖音': '短视频分镜脚本', '马蜂窝': '行程游记',
  '知乎': '专业问答长文', '微信公众号': '深度图文',
  '大众点评': '商家信息+回应', '美团': '团购套餐文案', '百度百科': '权威词条',
  '携程': '房型/套餐详情', '飞猪': '活动推广文案',
};

let _seq = 0;
const nextId = () => `job_${Date.now().toString(36)}_${(_seq++).toString(36)}`;

/** 生成一条示意正文（真实环境由 内容 Agent 调 LLM + 知识库产出） */
function draftBody(platform: string, intent: string, shopName: string): string {
  return `【${PLATFORM_CONTENT_TYPE[platform] ?? '内容'}·面向意图「${intent}」】\n` +
    `围绕「${shopName}」生成的 E-E-A-T 合规内容：客观陈述卖点与资质、结构化嵌入关键属性，` +
    `便于 ${platform} 与各大模型在「${intent}」场景中检索、收录、引用。（demo 示意，真实由内容 Agent 调 LLM+知识库产出）`;
}

/**
 * 把「本周投喂作战计划」+「意图矩阵」编排成内容任务列表。
 * 每个计划项(平台×篇数) → 对应篇数的内容任务，目标意图从 intents.ts 的高价值意图中轮取。
 */
/** 优化 Agent 回喂的学习信号（让生成"越来越准"） */
export interface LearnedBias {
  weakIntents?: string[];   // 尚未被引用覆盖、本轮优先补的意图
  bestPlatform?: string;    // 已验证命中率最高的平台
}

export function buildJobsFromPlan(
  industry: Industry, stage: Stage, shopName: string,
  shopCtx = {}, bias: LearnedBias = {},
): ContentJob[] {
  const plan = generateWeeklyPlan(industry, stage);
  // 意图池：优先补"学到的短板意图"，再用 topRec 核心意图兜底
  const topRec = expandIntents(industry as any, shopCtx).filter(i => i.topRec).map(i => i.text);
  const intents = [...(bias.weakIntents ?? []), ...topRec];
  let ptr = 0;
  const jobs: ContentJob[] = [];
  for (const item of plan.items) {
    for (let i = 0; i < item.count; i++) {
      const intent = intents[ptr % intents.length] ?? '本地推荐';
      ptr++;
      const compliance: 'pass' | 'needs_fix' = ptr % 7 === 0 ? 'needs_fix' : 'pass'; // 偶发需修复，演示合规闸
      jobs.push({
        id: nextId(),
        industry,
        platform: item.platformName,
        publisher: item.publisher,
        contentType: PLATFORM_CONTENT_TYPE[item.platformName] ?? '内容',
        targetIntent: intent,
        title: `【${PLATFORM_CONTENT_TYPE[item.platformName] ?? '内容'}】${intent}`,
        body: draftBody(item.platformName, intent, shopName),
        compliance,
        score: 86 + (ptr % 12),
        status: 'draft',
        learned: bias.bestPlatform ? item.platformName === bias.bestPlatform : false,
      });
    }
  }
  return jobs;
}

export { PUBLISHER_LABEL };
