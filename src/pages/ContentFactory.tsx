import React, { useState } from 'react';
import { Loader2, X, Check, AlertTriangle, Sparkles, Wand2, ArrowRight, Send, FileText, ShieldCheck, Eye } from 'lucide-react';
import { Shop } from '../types';
import { useToast } from '../components/Toast';
import { usePipeline } from '../store/PipelineContext';
import { PIPELINE_STAGES, PUBLISHER_LABEL, type ContentJob } from '../lib/workflow';
import type { Industry } from '../lib/distribution';

interface ContentFactoryProps { shop?: Shop; }

export function ContentFactory({ shop }: ContentFactoryProps) {
  const toast = useToast();
  const { jobsFor, generateFromPlan, adopt, fix } = usePipeline();
  const industry = (shop?.industry ?? 'restaurant') as Industry;
  const shopName = shop?.name ?? '当前店铺';

  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<ContentJob | null>(null);

  const jobs = jobsFor(industry);
  const factoryJobs = jobs.filter(j => j.status === 'draft' || j.status === 'ready'); // 工厂工序
  const draftCount = jobs.filter(j => j.status === 'draft').length;
  const readyCount = jobs.filter(j => j.status === 'ready').length;
  const passRate = factoryJobs.length
    ? Math.round((factoryJobs.filter(j => j.compliance === 'pass').length / factoryJobs.length) * 100)
    : 100;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const n = generateFromPlan(industry, 'cold', shopName);
      setIsGenerating(false);
      toast.success(`已按本周作战计划生成 ${n} 条内容`, '内容 Agent 已调用知识库 + Prompt 库，待合规校验与采用');
    }, 1500);
  };

  const handleAdopt = (j: ContentJob) => {
    if (j.compliance !== 'pass') {
      toast.warn('该内容含敏感词，需先修复', j.title);
      return;
    }
    adopt(industry, j.id);
    toast.success('已采用 → 已进入分发看板', `${j.platform} · ${PUBLISHER_LABEL[j.publisher]} 待派单`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl text-white italic">内容生产工厂 {shop?.name ? `- ${shop.name}` : ''}</h2>
          <p className="text-[11px] uppercase tracking-widest text-white/40 mt-2">Plan-Driven Content Agent Pipeline</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-4 py-2 bg-brand-gold text-[#0A0A0B] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:brightness-110 hover:shadow-[0_0_15px_rgba(197,160,89,0.35)] transition-all cursor-pointer disabled:opacity-50">
          {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
          {isGenerating ? '内容 Agent 生成中…' : '按本周作战计划一键生成'}
        </button>
      </div>

      {/* ===== Agent 流水线状态条（内容工厂 ↔ 分发看板 同一条流水线） ===== */}
      <section className="bg-brand-card border border-white/5 p-5 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent animate-shimmer" />
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {PIPELINE_STAGES.map((s, i) => {
            const isFactory = s.key === 'generate' || s.key === 'compliance' || s.key === 'adopt';
            return (
              <React.Fragment key={s.key}>
                <div className={`flex-1 min-w-[130px] p-3 border ${isFactory ? 'border-brand-gold/30 bg-brand-gold/[0.04]' : 'border-white/5 bg-black/20'}`}>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-mono ${isFactory ? 'text-brand-gold' : 'text-white/30'}`}>0{i + 1}</span>
                    <span className={`text-[11px] font-bold ${isFactory ? 'text-white' : 'text-white/50'}`}>{s.label}</span>
                  </div>
                  <div className="text-[8px] uppercase tracking-widest text-brand-gold/60 mt-1">{s.agent}</div>
                  <div className="text-[9px] text-white/35 mt-1 leading-tight">{s.desc}</div>
                </div>
                {i < PIPELINE_STAGES.length - 1 && <ArrowRight className="w-3 h-3 text-white/20 flex-shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>
        <p className="text-[9px] text-white/30 mt-3 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-brand-gold/50" />
          内容由「本周投喂作战计划」驱动生成 → 合规校验 → <strong className="text-white/50">一键采用即进入分发看板</strong>，两页同步同一条流水线。
        </p>
      </section>

      {/* 指标 */}
      <div className="grid grid-cols-3 gap-4">
        <Metric title="待采用草稿" value={draftCount} icon={<FileText className="w-4 h-4" />} />
        <Metric title="合规通过待发" value={readyCount} icon={<ShieldCheck className="w-4 h-4" />} />
        <Metric title="合规通过率" value={`${passRate}%`} icon={<ShieldCheck className="w-4 h-4" />} highlight />
      </div>

      {/* 工厂工序：草稿 / 待采用 列表 */}
      <div className="flex-1 bg-black/35 border border-white/5 overflow-hidden flex flex-col relative">
        <div className="h-12 border-b border-white/[0.04] flex items-center justify-between px-6 bg-white/[0.01]">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/80">AI 生成内容（待采用 → 进分发）</span>
          <span className="text-[10px] text-white/40 font-mono">{factoryJobs.length} 条</span>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {factoryJobs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-white/40">
              <Wand2 className="w-7 h-7 text-white/15" />
              <p className="text-xs">还没有待采用内容，点右上角「按本周作战计划一键生成」</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="text-[10px] uppercase tracking-widest text-white/30 border-b border-white/[0.04] sticky top-0 bg-[#0e0e11] z-10">
                <tr>
                  <th className="px-6 py-3 font-semibold">标题 / 目标意图</th>
                  <th className="px-6 py-3 font-semibold">平台</th>
                  <th className="px-6 py-3 font-semibold">发布人</th>
                  <th className="px-6 py-3 font-semibold">合规</th>
                  <th className="px-6 py-3 font-semibold">质量分</th>
                  <th className="px-6 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {factoryJobs.map(j => (
                  <tr key={j.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 max-w-[320px]">
                      <div className="font-semibold text-white/85 truncate group-hover:text-brand-gold transition-colors">{j.title}</div>
                      <div className="text-[10px] text-white/35 mt-0.5 flex items-center gap-1.5">
                        <span className="text-brand-gold/60">意图:</span>{j.targetIntent}
                        {j.status === 'ready' && <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 text-[8px] uppercase">已合规·待采用</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/60">{j.platform}</td>
                    <td className="px-6 py-4 text-white/50 text-[11px]">{PUBLISHER_LABEL[j.publisher]}</td>
                    <td className="px-6 py-4">
                      {j.compliance === 'pass'
                        ? <span className="flex items-center gap-1 text-green-400 font-mono text-[11px]"><Check className="w-3.5 h-3.5" />通过</span>
                        : <span className="flex items-center gap-1 text-red-400 font-mono text-[11px]"><AlertTriangle className="w-3.5 h-3.5 animate-bounce" />含敏感词</span>}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-brand-gold">{j.score}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => setPreview(j)} className="text-[9px] uppercase tracking-widest font-bold text-white/50 hover:text-white flex items-center gap-1 cursor-pointer">
                          <Eye className="w-3 h-3" />预览
                        </button>
                        {j.compliance === 'pass' ? (
                          <button onClick={() => handleAdopt(j)} className="text-[9px] uppercase tracking-widest font-bold text-brand-gold hover:text-white flex items-center gap-1 cursor-pointer">
                            <Send className="w-3 h-3" />一键采用
                          </button>
                        ) : (
                          <button onClick={() => { fix(industry, j.id); toast.success('已自动改写并通过合规', j.title); }}
                            className="text-[9px] uppercase tracking-widest font-bold text-amber-400 hover:text-white flex items-center gap-1 cursor-pointer">
                            <Wand2 className="w-3 h-3" />修复
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 预览弹窗 */}
      {preview && (
        <div className="absolute inset-0 bg-[#0A0A0B]/85 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in p-6">
          <div className="bg-[#0e0e11] border border-brand-gold/30 w-[560px] max-h-[80vh] flex flex-col shadow-2xl relative">
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-brand-gold/40" />
            <div className="flex items-center justify-between p-5 border-b border-white/[0.04] bg-white/[0.01]">
              <div>
                <h3 className="font-serif text-lg text-white italic">{preview.title}</h3>
                <p className="text-[10px] text-white/40 mt-1">{preview.platform} · {PUBLISHER_LABEL[preview.publisher]} · 意图「{preview.targetIntent}」</p>
              </div>
              <button onClick={() => setPreview(null)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 overflow-y-auto scrollbar-thin text-sm text-white/75 leading-relaxed whitespace-pre-wrap">{preview.body}</div>
            <div className="flex justify-end gap-3 p-4 border-t border-white/[0.04]">
              <button onClick={() => setPreview(null)} className="px-4 py-2 border border-white/10 text-white/60 text-xs uppercase tracking-widest hover:bg-white/5">关闭</button>
              {preview.compliance === 'pass' && (
                <button onClick={() => { handleAdopt(preview); setPreview(null); }} className="px-4 py-2 bg-brand-gold text-[#0A0A0B] text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:brightness-110">
                  <Send className="w-3 h-3" />采用并进分发
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ title, value, icon, highlight }: any) {
  return (
    <div className={`p-5 border relative group transition-all duration-300 ${highlight ? 'bg-brand-gold/[0.03] border-brand-gold/30' : 'bg-black/25 border-white/5 hover:border-white/15'}`}>
      <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-white/20 group-hover:border-brand-gold/30" />
      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3 font-semibold flex items-center gap-2">
        <span className="text-brand-gold/60">{icon}</span>{title}
      </p>
      <div className="font-serif text-3xl font-medium text-white">{value}</div>
    </div>
  );
}
