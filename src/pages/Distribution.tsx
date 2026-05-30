import React, { useState, useMemo } from 'react';
import { Plus, Move, LayoutGrid, CalendarRange, Users, Link2, Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { Shop } from '../types';
import { useToast } from '../components/Toast';
import { usePipeline } from '../store/PipelineContext';
import { PUBLISHER_LABEL, type ContentJob, type JobStatus } from '../lib/workflow';
import {
  generateWeeklyPlan, STAGE_LABEL,
  type Stage, type Industry,
} from '../lib/distribution';

const COLUMNS: { id: JobStatus; title: string }[] = [
  { id: 'backlog', title: '待派单 (Backlog)' },
  { id: 'review', title: '达人匹配 / 审核中' },
  { id: 'executing', title: '排期执行中' },
  { id: 'published', title: '已发布 (Published)' },
];

interface DistributionProps { shop?: Shop; }

export function Distribution({ shop }: DistributionProps) {
  const toast = useToast();
  const { jobsFor, moveTask, backfill, addManualTask } = usePipeline();
  const industry = (shop?.industry ?? 'restaurant') as Industry;

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>('cold');

  const plan = useMemo(() => generateWeeklyPlan(industry, stage), [industry, stage]);

  const jobs = jobsFor(industry);
  const distJobs = jobs.filter(j => ['backlog', 'review', 'executing', 'published'].includes(j.status));
  const published = distJobs.filter(j => j.status === 'published').length;
  const progress = Math.min(100, Math.round((published / plan.total) * 100));

  const handleDrop = (e: React.DragEvent, status: JobStatus) => {
    e.preventDefault();
    if (draggedId) moveTask(industry, draggedId, status);
    setDraggedId(null); setHoveredCol(null);
  };

  const getPlatformClass = (platform: string) => {
    switch (platform) {
      case '小红书': return 'bg-red-500/15 text-red-400 border-red-500/30';
      case '抖音': return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case '微信公众号': return 'bg-green-500/15 text-green-400 border-green-500/30';
      case '大众点评': return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case '美团': return 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30';
      case '携程': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case '飞猪': return 'bg-yellow-600/15 text-yellow-400 border-yellow-600/30';
      default: return 'bg-white/5 text-white/50 border-white/10';
    }
  };

  const stages: Stage[] = ['cold', 'ramp', 'maintain'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl text-white italic">分发任务看板 {shop?.name ? `- ${shop.name}` : ''}</h2>
          <p className="text-[11px] uppercase tracking-widest text-white/40 mt-2">Feeding Plan & Content Orchestration</p>
        </div>
        <button
          onClick={() => {
            const p = industry === 'hotel' ? '携程' : industry === 'spa' ? '美团' : '小红书';
            addManualTask(industry, p, 'merchant_self');
            toast.info('已创建分发任务', '已加入待派单列');
          }}
          className="px-4 py-2 bg-brand-gold text-[#0A0A0B] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:brightness-110 hover:shadow-[0_0_15px_rgba(197,160,89,0.35)] transition-all cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> 创建分发任务
        </button>
      </div>

      {/* ===== 本周投喂作战卡 ===== */}
      <section className="bg-brand-card border border-brand-gold/20 p-6 relative overflow-hidden shadow-[0_0_15px_rgba(197,160,89,0.03)]">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-brand-gold/40" />
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent animate-shimmer" />
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <CalendarRange className="w-4 h-4 text-brand-gold" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">本周投喂作战计划</h3>
              <p className="text-[10px] text-white/40 mt-1">{STAGE_LABEL[stage]} · 共 <span className="text-brand-gold font-bold">{plan.total}</span> 篇 · 内容由「内容工厂」按此计划生成</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {stages.map(s => (
              <button key={s}
                onClick={() => { setStage(s); toast.info('已切换运营阶段', STAGE_LABEL[s] + ' · 节奏已重算'); }}
                className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1.5 border transition-all cursor-pointer ${
                  stage === s ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' : 'border-white/10 text-white/40 hover:text-white/70'
                }`}>
                {s === 'cold' ? '冷启动' : s === 'ramp' ? '爬坡期' : '维护期'}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold mb-3 flex items-center gap-2">
              <Target className="w-3 h-3 text-brand-gold/60" /> 平台分配（在哪发 · 发几篇 · 谁发）
            </div>
            <div className="space-y-2">
              {plan.items.map(item => (
                <div key={item.platformId} className="flex items-center gap-3 group">
                  <span className="text-[11px] text-white/70 w-20 truncate">{item.platformName}</span>
                  <span className="text-[8px] text-brand-gold tracking-wider">{'★'.repeat(item.weight)}</span>
                  <div className="flex-1 h-4 bg-white/5 relative overflow-hidden">
                    <div className="h-full bg-brand-gold/30 group-hover:bg-brand-gold/45 transition-colors" style={{ width: `${(item.count / plan.total) * 100}%` }} />
                  </div>
                  <span className="text-xs font-mono font-bold text-white w-10 text-right">{item.count} 篇</span>
                  <span className="text-[8px] uppercase tracking-widest text-white/40 w-14 text-right">{PUBLISHER_LABEL[item.publisher]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 space-y-4 lg:border-l border-white/5 lg:pl-6">
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold mb-3 flex items-center gap-2">
                <Users className="w-3 h-3 text-brand-gold/60" /> 账号矩阵（本周需要的发布主体）
              </div>
              <div className="space-y-2">
                {plan.accounts.map(a => (
                  <div key={a.publisher} className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">{a.label} <span className="text-white/30 text-[9px]">({a.platforms.join('/')})</span></span>
                    <span className="font-mono font-bold text-brand-gold">{a.accounts} 个</span>
                  </div>
                ))}
                <p className="text-[9px] text-white/25 pt-1 leading-relaxed">* 客户自营账号 + 真实达人，人机协作，绝不养号/刷量</p>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-white/40 mb-2">
                <span>本周完成进度</span>
                <span className="text-brand-gold font-mono font-bold">{published}/{plan.total}</span>
              </div>
              <div className="h-1.5 bg-white/5 overflow-hidden">
                <div className="h-full bg-brand-gold transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 看板：直接读共享流水线（内容工厂采用的内容立刻出现在这里） ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {COLUMNS.map(col => {
          const colJobs = distJobs.filter(j => j.status === col.id);
          const isHovered = hoveredCol === col.id;
          return (
            <div key={col.id}
              onDragOver={(e) => { e.preventDefault(); setHoveredCol(col.id); }}
              onDragLeave={() => setHoveredCol(null)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`bg-black/35 border transition-all duration-300 flex flex-col relative ${
                isHovered ? 'border-brand-gold/40 shadow-[0_0_20px_rgba(197,160,89,0.03)] bg-brand-gold/[0.01]' : 'border-white/5'
              }`}>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/5" />
              <div className="p-4 border-b border-white/[0.04] flex justify-between items-center bg-white/[0.01]">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-white/70 flex items-center gap-2">
                  <LayoutGrid className="w-3 h-3 text-brand-gold animate-pulse" /> {col.title}
                </span>
                <span className="text-[10px] bg-brand-gold/10 border border-brand-gold/20 px-2 py-0.5 font-semibold text-brand-gold">{colJobs.length}</span>
              </div>
              <div className="p-3 space-y-3 bg-black/10 select-none min-h-[140px] max-h-[60vh] overflow-y-auto scrollbar-thin">
                {colJobs.map(job => (
                  <div key={job.id} draggable
                    onDragStart={(e) => { setDraggedId(job.id); e.dataTransfer.effectAllowed = 'move'; }}
                    className="p-4 border border-white/10 bg-[#070709] hover:border-brand-gold/45 cursor-grab active:cursor-grabbing transition-all duration-300 group hover:shadow-[0_0_15px_rgba(197,160,89,0.02)]">
                    <div className="flex items-center justify-between mb-2.5 text-[9px] uppercase tracking-widest font-semibold">
                      <span className={`px-2 py-0.5 border ${getPlatformClass(job.platform)}`}>{job.platform}</span>
                      <span className="font-mono text-white/35">{job.contentType}</span>
                    </div>
                    <h4 className="text-xs text-white/85 font-semibold leading-relaxed group-hover:text-brand-gold transition-colors line-clamp-2">{job.title}</h4>
                    <div className="text-[9px] text-white/35 mt-1.5"><span className="text-brand-gold/60">意图:</span> {job.targetIntent}</div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[8px] uppercase tracking-widest text-white/40 flex items-center gap-1">
                        <Users className="w-2.5 h-2.5 text-brand-gold/50" /> {PUBLISHER_LABEL[job.publisher]}
                      </span>
                      {job.status === 'published' ? (
                        job.cited ? (
                          <span className="text-[8px] uppercase tracking-widest text-green-400 flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" /> 已被AI引用
                          </span>
                        ) : (
                          <button onClick={() => { backfill(industry, job.id); toast.success('已回填发布链接', '该篇已进入 AI 引用监测队列'); }}
                            className="text-[8px] uppercase tracking-widest text-brand-gold flex items-center gap-1 hover:brightness-125 cursor-pointer">
                            <Link2 className="w-2.5 h-2.5" /> 回填URL
                          </button>
                        )
                      ) : (
                        <span className="text-[8px] uppercase tracking-widest text-white/20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Move className="w-2.5 h-2.5" /> 拖拽流转
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {colJobs.length === 0 && (
                  <div className="h-28 flex flex-col items-center justify-center border border-dashed border-white/5 text-[9px] text-white/20 uppercase tracking-widest gap-2">
                    <Sparkles className="w-3 h-3 text-white/15" /> 释放任务卡至此
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
