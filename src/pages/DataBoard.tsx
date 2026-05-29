import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { Shop } from '../types';
import { LayoutGrid, Percent, Activity, RefreshCw } from 'lucide-react';
import { useToast } from '../components/Toast';

interface DataBoardProps {
  shop?: Shop;
}

export function DataBoard({ shop }: DataBoardProps) {
  const radarData = [
    { subject: 'AI 提及率', A: 85, B: 65, fullMark: 100 },
    { subject: '搜索卡位', A: 78, B: 55, fullMark: 100 },
    { subject: '信源权威度', A: 92, B: 70, fullMark: 100 },
    { subject: '内容准确率', A: 88, B: 60, fullMark: 100 },
    { subject: '情感推荐度', A: 75, B: 80, fullMark: 100 },
  ];

  const toast = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = () => { setRefreshKey(k => k + 1); toast.process('正在重新抓取平台热度', '实时拉取各大模型推荐覆盖率'); };

  const rivalName = shop?.industry === 'spa' ? '云水间水疗' : 
                    shop?.industry === 'hotel' ? '阿丽拉度假酒店' : 
                    '聚仙楼';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <h2 className="font-serif text-3xl text-white italic">数据洞察看板 {shop?.name ? `- ${shop.name}` : ''}</h2>
          <p className="text-[11px] uppercase tracking-widest text-white/40 mt-2">Deep Intelligence & Competitor Radar</p>
        </div>
        <button onClick={handleRefresh} className="px-4 py-2 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 hover:bg-brand-gold/20 transition-all cursor-pointer">
          <RefreshCw className="w-3 h-3" />
          刷新实时数据
        </button>
      </div>

      <div key={refreshKey} className="grid grid-cols-2 gap-6 flex-1 min-h-0 animate-in fade-in duration-500">
        <div className="bg-black/35 border border-white/5 p-8 flex flex-col relative">
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10" />
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white flex items-center gap-2">
                <Percent className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
                主流 AI 平台推荐推荐率 (Coverage)
              </h3>
              <p className="text-[10px] text-white/40 mt-1">实时各大主流大语言模型推荐热度抓取</p>
            </div>
            <span className="text-[9px] font-mono font-bold tracking-widest text-brand-gold bg-brand-gold/10 px-2.5 py-0.5 border border-brand-gold/20 uppercase">Core Engines</span>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-4 content-start">
            <PlatformRow name="DeepSeek" coverage="High" perf="95%" />
            <PlatformRow name="豆包 (Doubao)" coverage="Medium" perf="72%" />
            <PlatformRow name="Kimi" coverage="High" perf="88%" />
            <PlatformRow name="微信元宝" coverage="Low" perf="45%" warn />
            <PlatformRow name="文心一言" coverage="Medium" perf="68%" />
            <PlatformRow name="ChatGPT" coverage="High" perf="90%" />
            <PlatformRow name="Gemini" coverage="High" perf="85%" />
            <PlatformRow name="通义千问" coverage="Medium" perf="70%" />
          </div>
        </div>

        <div className="bg-black/35 border border-white/5 p-8 flex flex-col relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10" />
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-brand-gold animate-bounce" />
                竞品能力雷达 (Competitive Radar)
              </h3>
              <p className="text-[10px] text-brand-gold italic mt-1">You vs. {rivalName} (主要竞争对手)</p>
            </div>
          </div>
          <div className="flex-1 w-full relative min-h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                  <PolarGrid stroke="#ffffff15" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff60', fontSize: 10, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name={`${shop?.name || '当前门店'} (You)`} dataKey="A" stroke="#C5A059" fill="#C5A059" fillOpacity={0.25} />
                  <Radar name={`${rivalName} (Rival)`} dataKey="B" stroke="#ffffff30" fill="#ffffff15" fillOpacity={0.15} />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '20px', color: '#fff' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0e0e11', border: '1px solid #ffffff10', borderRadius: '0px' }} itemStyle={{color: '#fff'}} />
                </RadarChart>
              </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlatformRow({ name, perf, warn }: any) {
  return (
    <div className="flex items-center justify-between p-4 border border-white/[0.04] bg-white/[0.01] hover:border-brand-gold/20 transition-all group">
      <span className="text-xs text-white/80 font-semibold group-hover:text-brand-gold transition-colors">{name}</span>
      <div className="flex justify-end gap-3 items-center">
        <span className={`text-[10px] font-mono font-bold tracking-widest ${warn ? 'text-red-400' : 'text-green-400'}`}>{perf}</span>
        <div className={`w-1.5 h-1.5 rounded-full ${warn ? 'bg-red-400 animate-ping' : 'bg-green-400 animate-pulse'}`} />
      </div>
    </div>
  );
}
