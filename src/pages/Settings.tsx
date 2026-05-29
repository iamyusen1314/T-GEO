import React, { useState } from 'react';
import { Shop } from '../types';
import { Settings as SettingsIcon, Users, Sliders, ShieldCheck } from 'lucide-react';

interface SettingsProps {
  shop: Shop;
  setShopId: (id: string) => void;
  shops: Shop[];
}

export function Settings({ shop, setShopId, shops }: SettingsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col mb-10">
        <h2 className="font-serif text-3xl text-white italic">设置与计费</h2>
        <p className="text-[11px] uppercase tracking-widest text-white/40 mt-2">System Configuration & Subscription</p>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-3 space-y-2 select-none">
          <Tab active={activeTab === 0} onClick={() => setActiveTab(0)}>
            <SettingsIcon className="w-4 h-4" />
            基础配置
          </Tab>
          <Tab active={activeTab === 1} onClick={() => setActiveTab(1)}>
            <Users className="w-4 h-4" />
            团队成员
          </Tab>
          <Tab active={activeTab === 2} onClick={() => setActiveTab(2)}>
            <Sliders className="w-4 h-4" />
            API 额度
          </Tab>
          <Tab active={activeTab === 3} onClick={() => setActiveTab(3)}>
            <ShieldCheck className="w-4 h-4" />
            订阅与账单
          </Tab>
        </div>

        <div className="col-span-9 bg-black/35 border border-white/5 p-10 space-y-12 relative">
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10" />
           {activeTab === 0 && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <section className="mb-12">
                 <h3 className="text-xs font-semibold uppercase tracking-widest text-[#fff]/60 mb-6 border-b border-white/[0.04] pb-4 tracking-wider">主体选择 (Demo)</h3>
                 <div className="space-y-6 max-w-md">
                   <div>
                     <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3 font-semibold">切换演示店铺</label>
                     <select 
                       value={shop.id}
                       onChange={(e) => setShopId(e.target.value)}
                       className="w-full border border-white/10 rounded-none px-4 py-3 text-sm bg-[#050507] text-brand-gold focus:outline-none focus:border-brand-gold/40 appearance-none cursor-pointer transition-colors"
                     >
                       {shops.map(s => (
                         <option key={s.id} value={s.id} className="bg-[#0e0e11] text-white font-semibold">
                           {s.name} ({s.industry === 'restaurant' ? '餐饮' : s.industry === 'spa' ? 'SPA' : '酒旅'})
                         </option>
                       ))}
                     </select>
                     <p className="text-[10px] text-white/40 mt-3 leading-relaxed">提示：切换店铺会动态更改全局的上下文、知识库、及内容工厂演示数据，以体现多行业的适配能力。</p>
                   </div>
                 </div>
               </section>
             </div>
           )}

           {activeTab === 1 && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <h3 className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-6 border-b border-white/[0.04] pb-4 flex justify-between items-center tracking-wider">
                 团队成员 (2)
                 <button className="text-[10px] text-brand-gold font-bold uppercase tracking-widest hover:underline cursor-pointer">邀请成员</button>
               </h3>
               <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 border border-white/5 bg-white/[0.01] hover:border-brand-gold/20 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-none bg-brand-gold/15 flex items-center justify-center text-brand-gold text-xs font-mono font-bold border border-brand-gold/30">
                       SY
                     </div>
                     <div>
                       <div className="text-sm font-semibold text-white">SamYu</div>
                       <div className="text-[10px] font-mono text-white/40 mt-1">iamyusen1314@gmail.com</div>
                     </div>
                   </div>
                   <div className="text-[9px] uppercase tracking-widest font-mono font-bold text-brand-gold px-2.5 py-1 border border-brand-gold/25 bg-brand-gold/10">Owner</div>
                 </div>
                 <div className="flex items-center justify-between p-4 border border-white/5 bg-white/[0.01] hover:border-brand-gold/20 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-none bg-white/5 flex items-center justify-center text-white/60 text-xs font-mono font-bold border border-white/20">
                       MJ
                     </div>
                     <div>
                       <div className="text-sm font-semibold text-white">店长小敏</div>
                       <div className="text-[10px] font-mono text-white/40 mt-1">min.jia@example.com</div>
                     </div>
                   </div>
                   <div className="text-[9px] uppercase tracking-widest font-mono font-bold text-white/50 px-2.5 py-1 border border-white/10 bg-white/5">Editor</div>
                 </div>
               </div>
             </div>
           )}

           {activeTab === 2 && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <h3 className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-6 border-b border-white/[0.04] pb-4 tracking-wider">大模型 API 额度</h3>
               <div className="grid grid-cols-2 gap-6">
                 <div className="p-6 border border-white/5 bg-white/[0.01] relative group hover:border-brand-gold/20 transition-all">
                   <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-white/20 group-hover:border-brand-gold/30" />
                   <div className="text-[10px] uppercase tracking-widest text-white/40 mb-4 font-semibold">当月 Token 消耗总量</div>
                   <div className="text-3xl font-mono text-white font-bold">1,248,500</div>
                   <div className="w-full bg-white/5 h-1 px-0.5 mt-4">
                     <div className="bg-brand-gold h-full w-[45%] shadow-[0_0_8px_rgba(197,160,89,0.5)]"></div>
                   </div>
                   <div className="text-[9px] uppercase tracking-widest font-mono font-semibold text-white/30 mt-2">1.2M / 3.0M 免费配额 (45%)</div>
                 </div>
                 <div className="p-6 border border-white/5 bg-white/[0.01] relative group hover:border-brand-gold/20 transition-all">
                   <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-white/20 group-hover:border-brand-gold/30" />
                   <div className="text-[10px] uppercase tracking-widest text-white/40 mb-4 font-semibold">当月内容生产篇数</div>
                   <div className="text-3xl font-mono text-white font-bold">482</div>
                   <div className="w-full bg-white/5 h-1 px-0.5 mt-4">
                     <div className="bg-brand-gold h-full w-[96%] shadow-[0_0_8px_rgba(197,160,89,0.5)]"></div>
                   </div>
                   <div className="text-[9px] uppercase tracking-widest font-mono font-semibold text-white/30 mt-2">482 / 500 配额 (96.4%)</div>
                 </div>
               </div>
             </div>
           )}

           {activeTab === 3 && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <h3 className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-6 border-b border-white/[0.04] pb-4 tracking-wider">订阅状态</h3>
               <div className="flex items-center justify-between p-8 border border-brand-gold/30 bg-brand-gold/[0.03] shadow-[0_0_15px_rgba(197,160,89,0.03)] mb-8 relative">
                   <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-brand-gold/40 animate-pulse" />
                   <div>
                     <h4 className="text-brand-gold font-bold uppercase tracking-[0.12em] text-sm mb-2">旗舰自营代运营版</h4>
                     <p className="text-[10px] text-white/50 tracking-wide uppercase">包含无限次诊断、全量词条人工优化代理、模型微调</p>
                   </div>
                   <div className="text-right">
                     <div className="text-3xl font-serif text-white font-bold">¥11,800 <span className="text-xs text-white/40 font-sans tracking-widest">/ 年</span></div>
                     <p className="text-[9px] text-green-400 font-bold uppercase tracking-widest mt-2 font-mono">Active until Dec 2026</p>
                   </div>
               </div>
               
               <h4 className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-4 tracking-wider">历史账单</h4>
               <table className="w-full text-left text-xs">
                 <thead className="text-[10px] uppercase tracking-widest text-white/30 border-b border-white/[0.04] bg-white/[0.01]">
                   <tr>
                     <th className="px-4 py-3 font-semibold">日期</th>
                     <th className="px-4 py-3 font-semibold">明细</th>
                     <th className="px-4 py-3 font-semibold">金额</th>
                     <th className="px-4 py-3 font-semibold">状态</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr className="border-b border-white/[0.04] hover:bg-white/[0.01]">
                     <td className="px-4 py-4 text-white/70 font-mono">2026-01-01</td>
                     <td className="px-4 py-4 text-white/50 font-semibold">旗舰自营代运营版 (包年)</td>
                     <td className="px-4 py-4 text-white/80 font-mono font-bold">¥11,800</td>
                     <td className="px-4 py-4 text-green-400 font-bold">已支付</td>
                   </tr>
                 </tbody>
               </table>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

function Tab({ children, active, onClick }: any) {
  return (
    <div 
      onClick={onClick} 
      className={`px-5 py-4 text-[10px] tracking-widest uppercase cursor-pointer transition-all duration-350 flex items-center gap-3 ${
        active 
          ? 'border-l-2 border-brand-gold bg-brand-gold/10 text-brand-gold font-bold' 
          : 'border-l-2 border-transparent text-white/40 hover:text-white/80 hover:bg-white/[0.01]'
      }`}
    >
      {children}
    </div>
  );
}
