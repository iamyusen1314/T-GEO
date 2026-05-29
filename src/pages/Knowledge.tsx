import React from 'react';
import { Network, Upload, ChevronRight, Check } from 'lucide-react';
import { Shop } from '../types';
import { useToast } from '../components/Toast';

interface KnowledgeProps {
  shop?: Shop;
}

export function Knowledge({ shop }: KnowledgeProps) {
  const isSpa = shop?.industry === 'spa';
  const isHotel = shop?.industry === 'hotel';
  const toast = useToast();

  const schemaName = isSpa ? 'SPA Schema' : isHotel ? 'Hotel Schema' : 'Restaurant Schema';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl text-white italic">知识库与图谱 {shop?.name ? `- ${shop.name}` : ''}</h2>
          <p className="text-[11px] uppercase tracking-widest text-white/40 mt-2">Industry Knowledge Base & RAG</p>
        </div>
        <button onClick={() => toast.process('正在解析上传资料', 'AI 抽取菜单/资质/媒体报道为知识图谱节点')} className="px-4 py-2 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 hover:bg-brand-gold/20 transition-all cursor-pointer">
          <Upload className="w-3 h-3 text-brand-gold animate-bounce" />
          上传资料文件
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-4 bg-black/35 border border-white/5 flex flex-col h-full overflow-hidden relative">
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10" />
          <div className="p-4 border-b border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-brand-gold animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white">实体与意图映射</span>
            </div>
            <span className="text-[9px] px-2 py-0.5 border border-brand-gold/30 text-brand-gold font-mono">MAP: RAG_ACTIVE</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
            <TreeItem label="基础信息" count="12/12" active />
            {isSpa && (
              <>
                <TreeItem label="项目/套餐" count="8/15" />
                <TreeItem label="技师/疗愈师" count="5/5" />
                <TreeItem label="场景情绪" count="6/10" />
              </>
            )}
            {isHotel && (
              <>
                <TreeItem label="房型信息" count="4/4" />
                <TreeItem label="配套设施" count="12/15" />
                <TreeItem label="周边景点" count="8/10" />
              </>
            )}
            {!isSpa && !isHotel && (
              <>
                <TreeItem label="菜系/派系" count="2/2" />
                <TreeItem label="招牌菜" count="8/15" />
                <TreeItem label="厨师/创始人" count="1/1" />
              </>
            )}
            <TreeItem label="场景标签" count="5/5" />
            <TreeItem label="特色服务" count="6/10" />
          </div>
        </div>
        
        <div className="col-span-8 bg-black/35 border border-white/5 flex flex-col h-full overflow-hidden relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10" />
          <div className="p-4 border-b border-white/[0.04] bg-white/[0.01] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-white">基础信息字段 ({schemaName})</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-green-500/10 text-green-400 font-bold border border-green-500/20 rounded-none uppercase">Synced</span>
            </div>
            <button onClick={() => toast.info('进入图谱字段编辑模式', schemaName + ' 结构可视化编辑')} className="text-[10px] text-brand-gold font-bold uppercase tracking-widest hover:text-white transition-colors cursor-pointer">EDIT SCHEMA</button>
          </div>
          <div className="flex-1 overflow-y-auto p-0">
            <table className="w-full text-left">
              <thead className="text-[10px] uppercase tracking-widest text-white/30 border-b border-white/[0.04] bg-[#0c0c0e]/95 sticky top-0">
                <tr>
                  <th className="px-6 py-4 font-semibold">字段名 (Entity)</th>
                  <th className="px-6 py-4 font-semibold">当前值 (Value)</th>
                  <th className="px-6 py-4 font-semibold">来源信源 (Source)</th>
                  <th className="px-6 py-4 font-semibold text-brand-gold">AI 引用率</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                <TableRow entity="店铺名称" value={shop?.name || "未知店铺"} source="营业执照" quote="98%" />
                <TableRow entity="电话" value="020-88888888" source="美团商家后台" quote="45%" />
                <TableRow entity="营业时间" value={isHotel ? "24小时" : "11:00-22:00"} source="大众点评" quote="76%" />
                <TableRow entity="人均客单价" value={isHotel ? "¥1,850" : isSpa ? "¥398" : "¥158"} source="平台统计" quote="89%" />
                <TableRow entity="位置信息" value={isHotel ? "山林隐秘景区核心位置" : "地铁站E口步行300m"} source="高德地图" quote="92%" />
                <TableRow entity="停车信息" value="免费专用停车场（含新能源充电桩）" source="商家提报" quote="85%" />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function TreeItem({ label, count, active }: any) {
  const toast = useToast();
  return (
    <div onClick={() => toast.info('已聚焦实体节点', label + ' · 完整度 ' + count)} className={`flex items-center justify-between p-3.5 rounded-none cursor-pointer border transition-all ${
      active 
        ? 'bg-brand-gold/10 border-brand-gold/30 shadow-[inset_3px_0_10px_rgba(197,160,89,0.05)]' 
        : 'hover:bg-white/[0.02] border-transparent hover:border-white/5'
    }`}>
      <div className="flex items-center gap-2">
        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${active ? 'text-brand-gold rotate-90' : 'text-white/30'}`} />
        <span className={active ? 'text-white font-bold tracking-wider' : 'text-white/60 tracking-wide'}>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {active && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping" />}
        <span className={`text-[10px] font-mono font-bold ${active ? 'text-brand-gold' : 'text-white/30'}`}>{count}</span>
      </div>
    </div>
  );
}

function TableRow({ entity, value, source, quote }: any) {
  return (
    <tr className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
      <td className="px-6 py-4 font-semibold text-white/95 group-hover:text-brand-gold transition-colors">{entity}</td>
      <td className="px-6 py-4 text-white/50 group-hover:text-white/70 transition-colors font-sans">{value}</td>
      <td className="px-6 py-4">
        <span className="px-2.5 py-1 bg-black/40 border border-white/10 rounded-none text-[9px] uppercase tracking-widest text-white/50 group-hover:border-white/20 transition-colors font-semibold">
          {source}
        </span>
      </td>
      <td className="px-6 py-4 font-mono font-bold text-brand-gold text-xs">{quote}</td>
    </tr>
  );
}
