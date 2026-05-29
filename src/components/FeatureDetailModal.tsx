import React, { useState } from 'react';
import { X, Globe, ShieldCheck, Cpu, ArrowUpRight, CheckCircle2, Terminal } from 'lucide-react';

interface FeatureDetailModalProps {
  initialTab: 'platform' | 'eeat' | 'rag';
  onClose: () => void;
}

export function FeatureDetailModal({ initialTab, onClose }: FeatureDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'platform' | 'eeat' | 'rag'>(initialTab);

  const tabsConfig = [
    {
      id: 'platform' as const,
      label: '联动控制引擎',
      sublabel: 'Multi-Platform Engine',
      icon: <Globe className="w-4 h-4" />,
    },
    {
      id: 'eeat' as const,
      label: '权威度审计套件',
      sublabel: 'EEAT Audit Suite',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      id: 'rag' as const,
      label: '提示词实验室',
      sublabel: 'RAG Prompts Lab',
      icon: <Cpu className="w-4 h-4" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#020203]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-10 select-none animate-in fade-in duration-300">
      <div className="bg-black/85 border border-brand-gold/30 w-full max-w-4xl relative shadow-[0_0_50px_rgba(197,160,89,0.15)] flex flex-col md:flex-row h-[90vh] md:h-[650px] overflow-hidden">
        {/* Decorative corner indicators */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-gold" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-brand-gold" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-brand-gold" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-gold" />

        {/* Left Side: Dynamic Tab Switcher */}
        <div className="w-full md:w-80 bg-white/[0.01] border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] tracking-[0.25em] text-brand-gold font-bold uppercase">Technical Specs</p>
              <h3 className="font-serif text-xl text-white italic mt-1 font-medium">硬核技术细节档案</h3>
            </div>

            <div className="space-y-2">
              {tabsConfig.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 border transition-all text-left cursor-pointer rounded-none relative overflow-hidden group ${
                      isActive
                        ? 'border-brand-gold/40 bg-brand-gold/10 text-brand-gold shadow-[0_0_15px_rgba(197,160,89,0.05)]'
                        : 'border-white/5 bg-transparent text-white/50 hover:text-white/80 hover:border-white/15'
                    }`}
                  >
                    <div className={`p-1.5 border ${isActive ? 'border-brand-gold/30 bg-brand-gold/10' : 'border-white/10 bg-white/5'}`}>
                      {tab.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-[0.1em] font-semibold">{tab.label}</span>
                      <span className="text-[8.5px] tracking-widest font-mono text-white/30 lowercase">{tab.sublabel}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden md:block bg-[#030304]/65 border border-white/[0.04] p-4 text-[10px] font-mono text-white/40 space-y-1.5">
            <div className="text-white/30">// 状态遥测：</div>
            <div>协议类型：HTTPS/TLS_1.3</div>
            <div>模型对齐速度：~112ms</div>
            <div>向量召回可信度：99.42%</div>
            <div>数据流安全防御等级：L-7</div>
          </div>
        </div>

        {/* Right Side: Hardcore Technical Readouts */}
        <div className="flex-1 flex flex-col min-w-0 bg-black/40 overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-white/[0.04] bg-white/[0.01] flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-brand-gold" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#fff]/60">T-GEO KNOWLEDGE ARCHIVE (T-KA)</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-none border border-white/10 bg-[#08080a] hover:border-white/30 text-white/50 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Details Content Box */}
          <div className="p-8 space-y-6">
            {activeTab === 'platform' && (
              <div className="animate-in fade-in duration-300 space-y-6 text-sm text-white/70 leading-relaxed">
                <div>
                  <span className="text-xs text-brand-gold uppercase tracking-[0.2em] font-bold block mb-2">架构原理 // ARCHITECTURAL BASE</span>
                  <h4 className="font-serif text-2xl text-white italic font-semibold tracking-wide">多平台 AI 搜索引擎联动控制引擎</h4>
                  <p className="mt-3">
                    大语言模型如 <strong>DeepSeek</strong>、<strong>Gemini</strong>、<strong>Claude</strong> 和 <strong>Kimi</strong> 的推荐触发路径本质上是一个多层语义检索过滤网络。<strong>T-GEO™ 联动控制引擎</strong> 解决了商户在各 AI 搜索引擎中由于信息孤岛和表示偏差面临的“不提及”、“被选择性滤除”甚至是“被同类竞品卡位拦截”等底层痛点。
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 my-2">
                  <div className="border border-white/5 bg-white/[0.01] p-4">
                    <span className="text-[9px] font-mono text-brand-gold block font-semibold mb-1">01. 语义图谱跑批对齐</span>
                    <p className="text-[11px] text-white/50 leading-relaxed">依据不同模型（思考路径网络 vs 长文本检索 vs 协同实时搜索）对实体的语义评估偏好，在后台通过多轮 prompt 控制矩阵跑批微调，将您店铺的基础特质对齐并注入 AI 语料库。</p>
                  </div>
                  <div className="border border-white/5 bg-white/[0.01] p-4">
                    <span className="text-[9px] font-mono text-brand-gold block font-semibold mb-1">02. 动态爬取及首屏监测</span>
                    <p className="text-[11px] text-white/50 leading-relaxed">联动控制引擎在全网 10 余个主流大模型推荐出口建立首屏返回监听。当用户触发“意图查询”（如：徐汇高品质SPA、万博周边好吃的烧鹅等）时，保障实时推荐。</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs text-brand-gold uppercase tracking-[0.2em] font-bold block">核心优势机制 & 商业价值</span>
                  <ul className="space-y-2 text-xs">
                    <li className="flex items-start gap-2 text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                      <div><strong>100% 捕获黄金首屏流量</strong>：将特定行业的高关联度提及词植入大模型推荐结果中，实测在大模型中提及推荐率提升 148%-260%。</div>
                    </li>
                    <li className="flex items-start gap-2 text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                      <div><strong>全平台分布式对齐</strong>：避免单一模型的过拟合偏好。通过自适应权重分发，不仅覆盖 DeepSeek，还可以无缝对齐 Kimi、豆包、Gemini 推荐。</div>
                    </li>
                    <li className="flex items-start gap-2 text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                      <div><strong>实体被动链接拉升</strong>：打通第三方权威媒体及百科源头，利用高权重网络做强关联支持，确保 AI 提取信息时链路完整安全。</div>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-white/5 pt-4 text-[10px] text-white/40 flex items-center justify-between font-mono">
                  <span>DEPLOYED ENGINE VERSION: V4.2_AI_SYNC</span>
                  <span className="text-brand-gold uppercase font-bold">CORE OPERATIVE STATUS OK</span>
                </div>
              </div>
            )}

            {activeTab === 'eeat' && (
              <div className="animate-in fade-in duration-300 space-y-6 text-sm text-white/70 leading-relaxed">
                <div>
                  <span className="text-xs text-brand-gold uppercase tracking-[0.2em] font-bold block mb-2">规范与审计法则 // RULES & AUDITS</span>
                  <h4 className="font-serif text-2xl text-white italic font-semibold tracking-wide">E-E-A-T 专有权威度与敏感语调审计套件</h4>
                  <p className="mt-3">
                    AI 搜索不采信广告化的低俗推广，它们看重 <strong>Experience（体验）</strong>、<strong>Expertise（专业）</strong>、<strong>Authoritativeness（权威）</strong> 及 <strong>Trustworthiness（受信赖度）</strong> 审计标准。我们的 <strong>EEAT Audit Suite</strong> 专为剔除营销空洞感、打磨真诚真切的人工真实体验而制。
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-white/5 bg-white/[0.01] p-4">
                    <span className="text-[9px] font-mono text-brand-gold block font-semibold mb-1">01. 剔除机器式低质量文本</span>
                    <p className="text-[11px] text-white/50 leading-relaxed">AI 模型能瞬间识别出其他 AI 大量复制出的套话模板。我们的审计套件能在生产出的内容文案中进行高精度词频熵值审计，避免被搜索引擎在索引侧因降权直接过滤。</p>
                  </div>
                  <div className="border border-white/5 bg-white/[0.01] p-4">
                    <span className="text-[9px] font-mono text-brand-gold block font-semibold mb-1">02. 注入真实情感契度 (Empathy Index)</span>
                    <p className="text-[11px] text-white/50 leading-relaxed">通过对技师话术、菜品细节或套房环境体验性描述的真实比对，自动追加实操步骤，符合搜素引擎对“真实经验”作为引用信源的核心法则。</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs text-[#C5A059] uppercase tracking-[0.2em] font-bold block">核心检测标准 & 系统安全</span>
                  <ul className="space-y-2 text-xs">
                    <li className="flex items-start gap-2 text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                      <div><strong>36 个维度合规扫描</strong>：覆盖平台禁用词、纯广告假大空话术、无意义堆砌和违规信托关联。</div>
                    </li>
                    <li className="flex items-start gap-2 text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                      <div><strong>搜索引擎置标对齐</strong>：分析 AI 引用源头格式（如 Wiki, 百度词条, 地理锚点、消费评论数据等），修正结构化标记以确保被判定为核心信源。</div>
                    </li>
                    <li className="flex items-start gap-2 text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                      <div><strong>一键诊断溯源性 (Trust)</strong>：提供修改前后的推荐概率增长预测，最大程度压降推广阻断风险，确保合规度达 99.4%。</div>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-white/5 pt-4 text-[10px] text-white/40 flex items-center justify-between font-mono">
                  <span>AUDITING INTEGRATION PIPELINE: EEAT-M4</span>
                  <span className="text-[#34D399] uppercase font-bold">AUDIT READY</span>
                </div>
              </div>
            )}

            {activeTab === 'rag' && (
              <div className="animate-in fade-in duration-300 space-y-6 text-sm text-white/70 leading-relaxed">
                <div>
                  <span className="text-xs text-[#C5A059] uppercase tracking-[0.2em] font-bold block mb-2">外源注入机制 // RAG SYSTEM ENGINEERING</span>
                  <h4 className="font-serif text-2xl text-white italic font-semibold tracking-wide">RAG 提示词引擎与商户检索增强实验室</h4>
                  <p className="mt-3">
                    现在的用户搜索并不检索基础黄页，大语言模型通过 <strong>RAG (Retrieval-Augmented Generation 检索增强生成)</strong> 技术，在海量私有数据和分布式网页碎片中，提取、重构最适合用户特定环境与意图的答案。RAG 提示词引擎实验室实现了 RAG 全管道的特征触发对齐。
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-white/5 bg-white/[0.01] p-4">
                    <span className="text-[9px] font-mono text-[#C5A059] block font-semibold mb-1">01. 匹配 RAG 块召回特征 (Chunking Tuning)</span>
                    <p className="text-[11px] text-white/50 leading-relaxed">AI 搜索在提取外源信源时，会将超长语料切分为固定 Chunk 向量（一般为 512 或 1024 Token）。我们自动微调生成文案的上下文长度，使每个切片信息密度最大化。</p>
                  </div>
                  <div className="border border-white/5 bg-white/[0.01] p-4">
                    <span className="text-[9px] font-mono text-[#C5A059] block font-semibold mb-1">02. 注入意图隐映射词 (Intent Embedding)</span>
                    <p className="text-[11px] text-white/50 leading-relaxed">在模板和生成的语料中，深度植入大语言模型最敏感的主体意图逻辑。当用户询问暗藏意图（如：想要高档避世感）时，精准激活该区域向量。</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs text-[#C5A059] uppercase tracking-[0.2em] font-bold block">核心研究模块与实验室应用</span>
                  <ul className="space-y-2 text-xs">
                    <li className="flex items-start gap-2 text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                      <div><strong>行业级 RAG 模板库</strong>：内置餐饮（招牌、黑珍珠背书）、推拿（身心灵疗法）、酒旅（环境、安保防滑、贴身管家）高响应检索模板 30 余套。</div>
                    </li>
                    <li className="flex items-start gap-2 text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                      <div><strong>一键复制生成高质量语料（Chunk-Data）</strong>：完美适配各社交平台、百科和网站外包分发，随时准备迎接大语言模型的强深度调取。</div>
                    </li>
                    <li className="flex items-start gap-2 text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                      <div><strong>温度与控制微秒级调节</strong>：支持温度系数、最高和最低 Token、重复惩罚参数动态调节，打造既严谨不刻板又完美避障的内容矩阵。</div>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-white/5 pt-4 text-[10px] text-white/40 flex items-center justify-between font-mono">
                  <span>RAG LAB ENVIRONMENT: PROMPT-FACTORY-V3</span>
                  <span className="text-brand-gold uppercase font-bold">SIMULATION ONLINE</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
