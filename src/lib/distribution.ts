/**
 * ====== 投喂计划引擎（运营层单一事实源）======
 *
 * 解决"一天发多少篇 / 在哪发 / 谁发 / 需要多少账号 / 怎么发"。
 * 把"生产内容"和"看监控"中间补上一层可执行的作战排期。
 *
 * 规则可配置、会演进：调节奏/权重/账号只改这一个文件。
 * 配合 platforms.ts（AI渠道）、intents.ts（意图矩阵）一起构成三大事实源 → 运营事实源。
 */

export type Industry = 'restaurant' | 'spa' | 'hotel';

/** 运营阶段：冷启动密集打底 → 爬坡补短板 → 维护保新鲜 */
export type Stage = 'cold' | 'ramp' | 'maintain';

/** 发布主体类型（人机协作，绝不养号/刷量） */
export type PublisherType = 'merchant_self' | 'influencer' | 'operator';

export const PUBLISHER_LABEL: Record<PublisherType, string> = {
  merchant_self: '客户自营',
  influencer: '真实达人',
  operator: '运营代发',
};

export const STAGE_LABEL: Record<Stage, string> = {
  cold: '冷启动期（0–4周）',
  ramp: '爬坡期（5–12周）',
  maintain: '维护期',
};

/** 各阶段每周总投喂篇数（示例，可配置） */
export const STAGE_WEEKLY_TOTAL: Record<Stage, number> = {
  cold: 8,
  ramp: 5,
  maintain: 3,
};

export interface FeedPlatform {
  id: string;
  name: string;
  weight: number;             // AI 引用权重 1–5（越高越优先投）
  perAccountWeekly: number;   // 单账号每周安全发布上限（防限流/判营销）
  publisher: PublisherType;   // 主发布主体
  industries?: Industry[];    // 限定行业；省略=三行业通用
}

/** 投喂平台规则表（权重参考 PRD §8.5.2，频率为安全示例值，可配置） */
export const FEED_PLATFORMS: FeedPlatform[] = [
  { id: 'dianping', name: '大众点评',   weight: 5, perAccountWeekly: 2, publisher: 'merchant_self' },
  { id: 'xhs',      name: '小红书',     weight: 5, perAccountWeekly: 3, publisher: 'influencer' },
  { id: 'zhihu',    name: '知乎',       weight: 5, perAccountWeekly: 5, publisher: 'operator' },
  { id: 'baike',    name: '百度百科',   weight: 5, perAccountWeekly: 1, publisher: 'merchant_self' },
  { id: 'douyin',   name: '抖音',       weight: 4, perAccountWeekly: 3, publisher: 'influencer' },
  { id: 'meituan',  name: '美团',       weight: 4, perAccountWeekly: 2, publisher: 'merchant_self' },
  { id: 'mp',       name: '微信公众号', weight: 4, perAccountWeekly: 3, publisher: 'merchant_self' },
  { id: 'ctrip',    name: '携程',       weight: 5, perAccountWeekly: 2, publisher: 'merchant_self', industries: ['hotel'] },
  { id: 'mafengwo', name: '马蜂窝',     weight: 4, perAccountWeekly: 3, publisher: 'influencer',    industries: ['hotel'] },
  { id: 'fliggy',   name: '飞猪',       weight: 4, perAccountWeekly: 2, publisher: 'merchant_self', industries: ['hotel'] },
];

export interface PlanItem {
  platformId: string;
  platformName: string;
  count: number;            // 本周该平台发布篇数
  publisher: PublisherType;
  weight: number;
}

export interface AccountNeed {
  publisher: PublisherType;
  label: string;
  accounts: number;         // 该主体类型需要的发布账号数
  platforms: string[];      // 涉及平台
}

export interface WeeklyPlan {
  stage: Stage;
  total: number;
  items: PlanItem[];
  accounts: AccountNeed[];  // 账号矩阵：按周发布量倒推
}

/** 按行业 + 阶段生成本周投喂作战计划（按权重做最大余数分配） */
export function generateWeeklyPlan(industry: Industry, stage: Stage = 'cold'): WeeklyPlan {
  const total = STAGE_WEEKLY_TOTAL[stage];
  const applicable = FEED_PLATFORMS.filter(p => !p.industries || p.industries.includes(industry));
  const totalWeight = applicable.reduce((s, p) => s + p.weight, 0);

  // 先按权重比例取整数部分，再用最大余数法把剩余篇数补给"零头最大"的平台
  const raw = applicable.map(p => ({ p, exact: (p.weight / totalWeight) * total }));
  const items: PlanItem[] = raw.map(({ p, exact }) => ({
    platformId: p.id, platformName: p.name, count: Math.floor(exact),
    publisher: p.publisher, weight: p.weight,
  }));
  let assigned = items.reduce((s, i) => s + i.count, 0);
  const remainders = raw
    .map(({ p, exact }, idx) => ({ idx, frac: exact - Math.floor(exact), w: p.weight }))
    .sort((a, b) => b.frac - a.frac || b.w - a.w);
  let r = 0;
  while (assigned < total && r < remainders.length) {
    items[remainders[r].idx].count += 1;
    assigned++; r++;
  }

  // 账号矩阵：每平台账号数 = ceil(篇数 / 单账号安全频率)，按发布主体汇总
  const byPublisher = new Map<PublisherType, { accounts: number; platforms: Set<string> }>();
  for (const item of items) {
    if (item.count === 0) continue;
    const fp = applicable.find(p => p.id === item.platformId)!;
    const need = Math.ceil(item.count / fp.perAccountWeekly);
    const entry = byPublisher.get(fp.publisher) ?? { accounts: 0, platforms: new Set<string>() };
    entry.accounts += need;
    entry.platforms.add(item.platformName);
    byPublisher.set(fp.publisher, entry);
  }
  const accounts: AccountNeed[] = [...byPublisher.entries()].map(([publisher, v]) => ({
    publisher, label: PUBLISHER_LABEL[publisher], accounts: v.accounts, platforms: [...v.platforms],
  }));

  return { stage, total, items: items.filter(i => i.count > 0).sort((a, b) => b.count - a.count), accounts };
}
