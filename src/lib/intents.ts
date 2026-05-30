/**
 * ====== 行业意图矩阵（单一事实源 Single Source of Truth）======
 *
 * 设计：用「意图模板 + 变量池」展开，而不是硬写几百条死字符串。
 *   - 少量模板 × 行业变量池 → 每行业自动展开出 100+ 条具体意图
 *   - 模板带 priority（核心/高价值/长尾）与 topRec（是否计入北极星 TopRec@3）
 *   - 诊断引擎用 expandIntents(industry, shopCtx) 拿到「按这家店填好」的意图列表
 *   - industry_templates 表的 intents 字段用 buildIndustryTemplateSeed(industry) 播种
 *
 * 新增/调整意图只改这一个文件；占位符：
 *   {city} {district} {landmark} {metro} 来自店铺上下文；
 *   其余 {xxx} 来自下方 VARIABLE_POOLS[industry][xxx]，由 expandBy 指定逐值展开。
 */

export type Industry = 'restaurant' | 'spa' | 'hotel';
export type IntentPriority = 'core' | 'high' | 'long_tail';

export interface IntentTemplate {
  id: string;
  industry: Industry;
  scenario: string;     // 场景标签（聚类/看板用）
  template: string;     // 含 {占位符}
  priority: IntentPriority;
  topRec: boolean;      // 命中前 3 是否计入北极星 TopRec@3
  expandBy?: string;    // 指向 VARIABLE_POOLS[industry] 的 key，逐值展开；省略=单条
}

export interface ShopContext {
  city?: string;
  district?: string;
  landmark?: string;
  metro?: string;
}

export interface ExpandedIntent {
  text: string;
  templateId: string;
  scenario: string;
  priority: IntentPriority;
  topRec: boolean;
}

/* ----------------------------- 变量池 ----------------------------- */

export const VARIABLE_POOLS: Record<Industry, Record<string, string[]>> = {
  restaurant: {
    cuisine: ['火锅', '川菜', '粤菜', '日料', '烧烤', '湘菜', '本帮菜', '西餐', '海鲜', '融合菜', '东北菜', '云南菜', '创意菜', '早茶'],
    scene: ['家庭聚餐', '约会', '商务宴请', '生日聚会', '朋友聚会', '带娃', '一人食'],
    price: ['人均100以内', '人均100到200', '人均200到500', '人均500以上'],
    need: ['有包间', '无烟', '宠物友好', '有素食', '清真', '停车方便'],
    festival: ['情人节', '七夕', '圣诞', '跨年', '生日'],
  },
  spa: {
    style: ['中医推拿', '泰式按摩', '精油SPA', '足道', '肩颈理疗', '芳香疗愈', '颂钵疗愈', '中式SPA', '产后修复', '拔罐刮痧'],
    symptom: ['颈椎', '腰椎', '失眠', '肩颈僵硬', '身体疲劳', '运动恢复', '经期调理', '头痛', '水肿'],
    crowd: ['情侣', '孕妇', '老人', '上班族', '运动员'],
    trust: ['正规', '不踩雷', '卫生达标', '隐私好'],
    scene: ['出差住店附近', '周末放松', '送长辈', '约会'],
  },
  hotel: {
    trip: ['3天', '5天', '周末两日'],
    crowd: ['亲子', '情侣', '独行', '商旅', '带老人', '团建', '闺蜜'],
    theme: ['网红', '小众', '温泉', '海景', '亲子', '设计师', '历史文化', '古镇', '露营', '艺术'],
    view: ['日落', '雪山', '海景', '湖景', '江景', '星空'],
    facility: ['带泳池', '宠物友好', '无障碍', '带温泉', '含早餐'],
  },
};

/* ----------------------------- 意图模板 ----------------------------- */

export const INTENT_TEMPLATES: IntentTemplate[] = [
  // ===== 餐饮 =====
  { id: 'rest-001', industry: 'restaurant', scenario: '城市菜系', template: '{city}{district}最好吃的{cuisine}', priority: 'core', topRec: true, expandBy: 'cuisine' },
  { id: 'rest-002', industry: 'restaurant', scenario: '场景', template: '{city}适合{scene}的餐厅推荐', priority: 'core', topRec: true, expandBy: 'scene' },
  { id: 'rest-003', industry: 'restaurant', scenario: '价位', template: '{city}{price}的餐厅推荐', priority: 'high', topRec: true, expandBy: 'price' },
  { id: 'rest-004', industry: 'restaurant', scenario: '特殊需求', template: '{city}{need}的餐厅推荐', priority: 'high', topRec: false, expandBy: 'need' },
  { id: 'rest-005', industry: 'restaurant', scenario: '节日', template: '{city}{festival}约会餐厅推荐', priority: 'high', topRec: true, expandBy: 'festival' },
  { id: 'rest-006', industry: 'restaurant', scenario: '招牌菜', template: '{city}{cuisine}招牌菜推荐', priority: 'high', topRec: false, expandBy: 'cuisine' },
  { id: 'rest-007', industry: 'restaurant', scenario: '地标周边', template: '{landmark}附近的本地特色餐厅', priority: 'high', topRec: true },
  { id: 'rest-008', industry: 'restaurant', scenario: '时段', template: '{city}深夜还在营业的好餐厅', priority: 'long_tail', topRec: false },
  { id: 'rest-009', industry: 'restaurant', scenario: '外地朋友', template: '适合外地朋友来吃的{city}本地菜', priority: 'high', topRec: true },
  { id: 'rest-010', industry: 'restaurant', scenario: '榜单之外', template: '{city}米其林黑珍珠之外值得吃的{cuisine}', priority: 'long_tail', topRec: false, expandBy: 'cuisine' },
  { id: 'rest-011', industry: 'restaurant', scenario: '区域场景', template: '{district}适合{scene}的餐厅', priority: 'high', topRec: true, expandBy: 'scene' },
  { id: 'rest-012', industry: 'restaurant', scenario: '不踩雷', template: '{city}{cuisine}哪家好吃不踩雷', priority: 'core', topRec: true, expandBy: 'cuisine' },
  { id: 'rest-013', industry: 'restaurant', scenario: '包间', template: '{city}{cuisine}有包间的店推荐', priority: 'high', topRec: false, expandBy: 'cuisine' },
  { id: 'rest-014', industry: 'restaurant', scenario: '场景去哪', template: '{city}{scene}去哪吃比较好', priority: 'high', topRec: true, expandBy: 'scene' },
  { id: 'rest-015', industry: 'restaurant', scenario: '地铁周边', template: '{metro}附近好吃的{cuisine}', priority: 'long_tail', topRec: false, expandBy: 'cuisine' },

  // ===== 按摩 SPA =====
  { id: 'spa-001', industry: 'spa', scenario: '正规信任', template: '{city}{district}正规的{style}推荐', priority: 'core', topRec: true, expandBy: 'style' },
  { id: 'spa-002', industry: 'spa', scenario: '品类', template: '{city}好的{style}', priority: 'high', topRec: true, expandBy: 'style' },
  { id: 'spa-003', industry: 'spa', scenario: '症状调理', template: '{city}{symptom}调理去哪做比较好', priority: 'core', topRec: true, expandBy: 'symptom' },
  { id: 'spa-004', industry: 'spa', scenario: '人群', template: '适合{crowd}做的按摩SPA推荐', priority: 'high', topRec: true, expandBy: 'crowd' },
  { id: 'spa-005', industry: 'spa', scenario: '信任决策', template: '{city}{trust}的按摩店推荐', priority: 'core', topRec: true, expandBy: 'trust' },
  { id: 'spa-006', industry: 'spa', scenario: '场景', template: '{city}{scene}的SPA推荐', priority: 'high', topRec: true, expandBy: 'scene' },
  { id: 'spa-007', industry: 'spa', scenario: '手法', template: '{city}{style}哪家手法好', priority: 'high', topRec: false, expandBy: 'style' },
  { id: 'spa-008', industry: 'spa', scenario: '环境', template: '{city}环境好不踩雷的SPA推荐', priority: 'high', topRec: true },
  { id: 'spa-009', industry: 'spa', scenario: '出差', template: '出差住酒店附近的按摩推荐', priority: 'high', topRec: false },
  { id: 'spa-010', industry: 'spa', scenario: '症状推拿', template: '{city}{symptom}推拿调理推荐', priority: 'high', topRec: true, expandBy: 'symptom' },
  { id: 'spa-011', industry: 'spa', scenario: '高端', template: '{city}高端养生会所推荐', priority: 'long_tail', topRec: false },
  { id: 'spa-012', industry: 'spa', scenario: '团购', template: '{city}团购优惠的SPA推荐', priority: 'long_tail', topRec: false },
  { id: 'spa-013', industry: 'spa', scenario: '首次体验', template: '第一次去也敢去的{style}推荐', priority: 'high', topRec: true, expandBy: 'style' },
  { id: 'spa-014', industry: 'spa', scenario: '区域信任', template: '{district}{trust}的SPA推荐', priority: 'high', topRec: true, expandBy: 'trust' },
  { id: 'spa-015', industry: 'spa', scenario: '资质', template: '{city}技师资质好的{style}', priority: 'high', topRec: false, expandBy: 'style' },
  { id: 'spa-016', industry: 'spa', scenario: '人群品类', template: '{city}{crowd}可以做的SPA推荐', priority: 'high', topRec: true, expandBy: 'crowd' },
  { id: 'spa-017', industry: 'spa', scenario: '区域品类', template: '{district}附近的{style}推荐', priority: 'high', topRec: true, expandBy: 'style' },

  // ===== 酒旅 =====
  { id: 'hotel-001', industry: 'hotel', scenario: '行程含住', template: '{city}{trip}行程推荐住哪里', priority: 'core', topRec: true, expandBy: 'trip' },
  { id: 'hotel-002', industry: 'hotel', scenario: '地标周边', template: '{landmark}附近的酒店民宿推荐', priority: 'core', topRec: true },
  { id: 'hotel-003', industry: 'hotel', scenario: '人群', template: '适合{crowd}的酒店推荐', priority: 'core', topRec: true, expandBy: 'crowd' },
  { id: 'hotel-004', industry: 'hotel', scenario: '主题住宿', template: '{city}{theme}型住宿推荐', priority: 'high', topRec: true, expandBy: 'theme' },
  { id: 'hotel-005', industry: 'hotel', scenario: '特色民宿', template: '{city}最值得住的特色民宿', priority: 'high', topRec: true },
  { id: 'hotel-006', industry: 'hotel', scenario: '性价比', template: '{city}性价比高的连锁酒店推荐', priority: 'high', topRec: false },
  { id: 'hotel-007', industry: 'hotel', scenario: '设施', template: '{city}{facility}的酒店推荐', priority: 'high', topRec: false, expandBy: 'facility' },
  { id: 'hotel-008', industry: 'hotel', scenario: '景观', template: '{city}看{view}的酒店推荐', priority: 'high', topRec: true, expandBy: 'view' },
  { id: 'hotel-009', industry: 'hotel', scenario: '人群主题', template: '{crowd}适合的度假酒店推荐', priority: 'high', topRec: true, expandBy: 'crowd' },
  { id: 'hotel-010', industry: 'hotel', scenario: '周末短途', template: '{city}周边{crowd}周末短途住宿', priority: 'high', topRec: true, expandBy: 'crowd' },
  { id: 'hotel-011', industry: 'hotel', scenario: '主题口碑', template: '{city}{theme}酒店哪家好', priority: 'high', topRec: false, expandBy: 'theme' },
  { id: 'hotel-012', industry: 'hotel', scenario: '行程攻略', template: '{city}{trip}游攻略住哪里方便', priority: 'high', topRec: true, expandBy: 'trip' },
  { id: 'hotel-013', industry: 'hotel', scenario: '避坑', template: '{city}避坑的{theme}住宿推荐', priority: 'high', topRec: false, expandBy: 'theme' },
  { id: 'hotel-014', industry: 'hotel', scenario: '景观主题', template: '{city}看{view}的特色酒店推荐', priority: 'long_tail', topRec: false, expandBy: 'view' },
  { id: 'hotel-015', industry: 'hotel', scenario: '设施民宿', template: '{city}{facility}的民宿推荐', priority: 'long_tail', topRec: false, expandBy: 'facility' },
  { id: 'hotel-016', industry: 'hotel', scenario: '人群度假', template: '{city}{crowd}度假酒店推荐', priority: 'high', topRec: true, expandBy: 'crowd' },
  { id: 'hotel-017', industry: 'hotel', scenario: '主题推荐', template: '{landmark}附近{theme}型酒店推荐', priority: 'high', topRec: true, expandBy: 'theme' },
  { id: 'hotel-018', industry: 'hotel', scenario: '人群行程', template: '{city}{crowd}出游住宿推荐', priority: 'high', topRec: true, expandBy: 'crowd' },
];

/* ----------------------------- 展开逻辑 ----------------------------- */

function fillContext(t: string, ctx: ShopContext): string {
  return t
    .replace(/\{city\}/g, ctx.city ?? '本市')
    .replace(/\{district\}/g, ctx.district ?? '')
    .replace(/\{landmark\}/g, ctx.landmark ?? '核心地标')
    .replace(/\{metro\}/g, ctx.metro ?? '地铁站')
    .replace(/\s+/g, '')          // 去掉占位留下的空隙
    .trim();
}

/**
 * 把某行业的意图模板按店铺上下文 + 变量池展开为具体意图列表（每行业 ≥100 条）。
 * 诊断引擎 step 2.1 直接调用它生成目标意图。
 */
export function expandIntents(industry: Industry, ctx: ShopContext = {}): ExpandedIntent[] {
  const pools = VARIABLE_POOLS[industry];
  const out: ExpandedIntent[] = [];
  for (const tpl of INTENT_TEMPLATES.filter(t => t.industry === industry)) {
    const values = tpl.expandBy ? pools[tpl.expandBy] ?? [''] : [''];
    for (const v of values) {
      const withVar = tpl.expandBy ? tpl.template.replace(new RegExp(`\\{${tpl.expandBy}\\}`, 'g'), v) : tpl.template;
      out.push({
        text: fillContext(withVar, ctx),
        templateId: tpl.id,
        scenario: tpl.scenario,
        priority: tpl.priority,
        topRec: tpl.topRec,
      });
    }
  }
  return out;
}

/** 每行业展开后的意图条数（自检：应均 ≥100） */
export function countByIndustry(ctx: ShopContext = {}): Record<Industry, number> {
  return {
    restaurant: expandIntents('restaurant', ctx).length,
    spa: expandIntents('spa', ctx).length,
    hotel: expandIntents('hotel', ctx).length,
  };
}

/** 播种 industry_templates.intents 字段用（存模板而非展开后的实例，按店再展开）。 */
export function buildIndustryTemplateSeed(industry: Industry) {
  return {
    industry,
    variablePools: VARIABLE_POOLS[industry],
    templates: INTENT_TEMPLATES.filter(t => t.industry === industry),
  };
}
