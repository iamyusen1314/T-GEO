/**
 * ====== AI 平台全渠道清单（单一事实源 Single Source of Truth）======
 *
 * 全渠道覆盖原则：本地生活商家在「任何一个」主流 AI 助手 / AI 搜索入口里被检索到，
 * 都应被监测与优化。新增/调整平台只改这一个文件，UI 与诊断引擎都从这里取。
 *
 * 分三类：① 国内大模型助手  ② 海外大模型  ③ 入口型 AI 搜索
 */

export interface AIPlatform {
  /** 唯一标识，诊断引擎按它建任务 */
  id: string;
  /** 展示名 */
  name: string;
  /** 厂商 */
  vendor: string;
  /** 是否有稳定开放 API（false = 需 Playwright 爬 C 端） */
  hasApi: boolean;
  /** HUD 发光色（背景动效/看板用） */
  glow: string;
  category: 'domestic' | 'overseas' | 'search_portal';
}

export const AI_PLATFORMS: AIPlatform[] = [
  // ① 国内大模型助手
  { id: 'deepseek', name: 'DeepSeek',   vendor: '深度求索',   hasApi: true,  glow: '#3B82F6', category: 'domestic' },
  { id: 'doubao',   name: '豆包',        vendor: '字节跳动',   hasApi: true,  glow: '#EF4444', category: 'domestic' },
  { id: 'kimi',     name: 'Kimi',       vendor: '月之暗面',   hasApi: true,  glow: '#10B981', category: 'domestic' },
  { id: 'yuanbao',  name: '腾讯元宝',    vendor: '腾讯',       hasApi: false, glow: '#22D3EE', category: 'domestic' },
  { id: 'qwen',     name: '通义千问',    vendor: '阿里巴巴',   hasApi: true,  glow: '#A855F7', category: 'domestic' },
  { id: 'ernie',    name: '文心一言',    vendor: '百度',       hasApi: true,  glow: '#2563EB', category: 'domestic' },
  { id: 'zhipu',    name: '智谱清言',    vendor: '智谱 AI',    hasApi: true,  glow: '#14B8A6', category: 'domestic' },
  { id: 'spark',    name: '讯飞星火',    vendor: '科大讯飞',   hasApi: true,  glow: '#F59E0B', category: 'domestic' },
  { id: 'hunyuan',  name: '腾讯混元',    vendor: '腾讯',       hasApi: true,  glow: '#0EA5E9', category: 'domestic' },

  // ② 海外大模型
  { id: 'chatgpt',    name: 'ChatGPT',    vendor: 'OpenAI',     hasApi: true,  glow: '#10A37F', category: 'overseas' },
  { id: 'gemini',     name: 'Gemini',     vendor: 'Google',     hasApi: true,  glow: '#C5A059', category: 'overseas' },
  { id: 'claude',     name: 'Claude',     vendor: 'Anthropic',  hasApi: true,  glow: '#8B5CF6', category: 'overseas' },
  { id: 'perplexity', name: 'Perplexity', vendor: 'Perplexity', hasApi: true,  glow: '#06B6D4', category: 'overseas' },

  // ③ 入口型 AI 搜索（无开放 API，多需爬 C 端 / 平台自有索引）
  { id: 'baidu_ai',   name: '百度 AI 搜', vendor: '百度',   hasApi: false, glow: '#3B82F6', category: 'search_portal' },
  { id: 'quark',      name: '夸克 AI',    vendor: '阿里',   hasApi: false, glow: '#6366F1', category: 'search_portal' },
  { id: 'douyin_ai',  name: '抖音 AI 搜', vendor: '字节',   hasApi: false, glow: '#EC4899', category: 'search_portal' },
  { id: 'xhs_ai',     name: '小红书 AI 搜', vendor: '小红书', hasApi: false, glow: '#F43F5E', category: 'search_portal' },
  { id: 'weixin_ai',  name: '微信 AI 搜', vendor: '腾讯',   hasApi: false, glow: '#22C55E', category: 'search_portal' },
];

/** 简短的一句话渠道罗列（用于文案展示），含主力 + 等 */
export const PLATFORM_HEADLINE =
  'DeepSeek、豆包、Kimi、元宝、通义千问、文心一言、智谱清言、ChatGPT、Gemini 等全渠道';

export const domesticPlatforms = AI_PLATFORMS.filter(p => p.category === 'domestic');
export const overseasPlatforms = AI_PLATFORMS.filter(p => p.category === 'overseas');
export const searchPortalPlatforms = AI_PLATFORMS.filter(p => p.category === 'search_portal');
