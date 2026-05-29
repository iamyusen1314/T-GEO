import React, { useState } from 'react';
import { FileText, Download, Play, Eye, ArrowLeft } from 'lucide-react';
import { Shop } from '../types';

interface ReportsProps {
  shop?: Shop;
}

export function Reports({ shop }: ReportsProps) {
  const [selectedReport, setSelectedReport] = useState<number | null>(null);

  const isSpa = shop?.industry === 'spa';
  const isHotel = shop?.industry === 'hotel';

  if (selectedReport) {
    return (
      <div className="space-y-6 animate-in slide-in-from-right-8 duration-500 h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-6">
            <button onClick={() => setSelectedReport(null)} className="p-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="font-serif text-2xl text-white italic">2026年{5-selectedReport}月深度诊断报告 {shop?.name ? `- ${shop.name}` : ''}</h2>
              <p className="text-[10px] uppercase tracking-widest text-brand-gold mt-1">Status: Finalized & Generated</p>
            </div>
          </div>
          <button className="px-5 py-2 bg-brand-gold text-[#0A0A0B] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-all">
            <Download className="w-3 h-3" />
            Download PDF
          </button>
        </div>

        <div className="flex-1 bg-[#EEF0F2] overflow-y-auto w-full relative">
           <div className="max-w-4xl mx-auto bg-white min-h-[1056px] my-10 p-16 shadow-2xl relative text-slate-800">
               {/* Watermark/Header */}
               <div className="absolute top-0 right-0 p-12 text-right opacity-40">
                  <h1 className="font-serif text-3xl font-bold tracking-widest text-slate-900">T-GEO<span className="text-amber-600">™</span></h1>
                  <p className="text-[10px] uppercase tracking-[0.2em] mt-1 text-slate-500">Confidential Report</p>
               </div>
               
               <div className="pt-20 pb-8 border-b-2 border-amber-600/30 mb-10">
                 <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">Executive Summary</p>
                 <h1 className="text-5xl font-serif font-bold text-slate-900 mb-6">{shop?.name || '当前门店'} AI 搜索可见度诊断</h1>
                 <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                   基于 10 个主流大模型平台、针对 100 个核心意图的穷举测试。本报告呈现贵品牌在 AI 搜索引擎生态中的客观位置与优化路径，由 T-GEO™ Platform 自动生成。
                 </p>
               </div>

               <div className="mb-14">
                 <h3 className="text-xl font-serif font-bold mb-6 border-l-4 border-amber-600 pl-4 text-slate-900">1. T-LBR™ 核心诊断得分</h3>
                 <div className="flex items-end gap-4 p-8 bg-slate-50 border border-slate-200">
                    <span className="text-7xl font-serif text-slate-900 font-medium">78</span>
                    <span className="text-slate-500 pb-3 font-medium">/ 100</span>
                    <div className="ml-auto text-right pb-2">
                      <p className="text-sm font-bold text-emerald-600">领先行业均值 (45分) 73%</p>
                      <p className="text-xs text-slate-500 mt-2 font-medium">评定等级：优秀 (优先展示池)</p>
                    </div>
                 </div>
               </div>

               <div>
                 <h3 className="text-xl font-serif font-bold mb-6 border-l-4 border-amber-600 pl-4 text-slate-900">2. Top 3 优化短板与建议</h3>
                 <table className="w-full text-left text-sm">
                   <thead>
                     <tr className="border-b-2 border-slate-300">
                       <th className="py-4 px-4 text-slate-500 font-bold uppercase tracking-wider text-xs">发现问题 (Insight)</th>
                       <th className="py-4 px-4 text-slate-500 font-bold uppercase tracking-wider text-xs">影响面 (Impact)</th>
                       <th className="py-4 px-4 text-slate-500 font-bold uppercase tracking-wider text-xs">对策 (Action)</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr className="border-b border-slate-100">
                       <td className="py-5 px-4 font-bold text-slate-800">百度百科提及率低 (15%)</td>
                       <td className="py-5 px-4 text-orange-600 font-medium">严重影响豆包、文心的底层信任分</td>
                       <td className="py-5 px-4 text-slate-600">执行百度百科/搜狗百科词条翻新与加持</td>
                     </tr>
                     <tr className="border-b border-slate-100">
                       <td className="py-5 px-4 font-bold text-slate-800">
                         {isSpa ? '"情侣SPA/私密" 意图命中率低于竞品' : isHotel ? '"周末短途/儿童房" 意图命中率低于竞品' : '"包间/宴请" 意图命中率低于竞品'}
                       </td>
                       <td className="py-5 px-4 text-amber-600 font-medium">流失高客单价{isSpa ? '情侣客群' : isHotel ? '家庭客群' : '商务客群'}</td>
                       <td className="py-5 px-4 text-slate-600">在小红书、大众点评中铺设相关场景软文</td>
                     </tr>
                     <tr className="border-b border-slate-100">
                       <td className="py-5 px-4 font-bold text-slate-800">
                         {isSpa ? '疗愈项目信息陈旧' : isHotel ? '酒店特色设施信息未同步' : '招牌菜信息陈旧'}
                       </td>
                       <td className="py-5 px-4 text-slate-600 font-medium">大模型未收录最新特色项目</td>
                       <td className="py-5 px-4 text-slate-600">更新知识图谱库，重新生成多版本推介语投喂</td>
                     </tr>
                   </tbody>
                 </table>
               </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-serif text-3xl text-white italic">诊断报告 {shop?.name ? `- ${shop.name}` : ''}</h2>
          <p className="text-[11px] uppercase tracking-widest text-white/40 mt-2">Strategic Reports Archives</p>
        </div>
        <button className="px-4 py-2 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-brand-gold/20 transition-all cursor-pointer">
          <Play className="w-3 h-3" />
          重新运行诊断
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-black/35 p-6 border border-white/5 flex flex-col relative group transition-all duration-300 hover:border-brand-gold/20 hover:shadow-[0_0_15px_rgba(197,160,89,0.03)]">
            {/* Corner visual tech details */}
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/20 group-hover:border-brand-gold/30" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/20 group-hover:border-brand-gold/30" />

            <div className="w-10 h-10 border border-brand-gold/30 flex items-center justify-center text-brand-gold bg-brand-gold/5 mb-4 group-hover:scale-105 transition-transform duration-300">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white mb-2 group-hover:text-brand-gold transition-colors">2026年{5-i}月深度诊断报告</h3>
            <p className="text-[10.5px] text-white/40 mb-8 leading-relaxed">包含 10 个 AI 平台、100+ 核心搜索意图的全面跑测结果与竞品分析。</p>
            <div className="mt-auto flex gap-3">
              <button 
                onClick={() => setSelectedReport(i)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest font-bold text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-colors cursor-pointer">
                <Eye className="w-3.5 h-3.5 text-brand-gold" />
                在线预览
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest font-bold text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-colors cursor-pointer">
                <Download className="w-3.5 h-3.5" />
                PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
