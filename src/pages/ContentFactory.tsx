import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Loader2, X, FileText, Check, AlertTriangle } from 'lucide-react';
import { Shop } from '../types';
import { useToast } from '../components/Toast';

interface ContentFactoryProps {
  shop?: Shop;
}

export function ContentFactory({ shop }: ContentFactoryProps) {
  const [activeTab, setActiveTab] = useState('全部内容');
  const [data, setData] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const tabs = ['全部内容', '小红书种草', '官方问答', '短视频脚本'];

  const isRestaurant = shop?.industry === 'restaurant';
  const isSpa = shop?.industry === 'spa';
  const isHotel = shop?.industry === 'hotel';

  useEffect(() => {
    // Generate initial specific data based on industry
    const baseData = [
      { 
        id: 1, 
        title: isRestaurant ? "【探店】发现隐藏宝藏，黑珍珠班底的高端粤菜" : 
               isSpa ? "【疗愈】沉浸式颂钵，释放身心压力的周末指南" : 
               "【避世】江浙沪周边的高端隐世酒店体验分享", 
        type: "小红书种草", 
        time: "10分钟前", 
        compliance: "通过", 
        status: "草稿" 
      },
      { 
        id: 2, 
        title: `${shop?.name || '本店'}的环境与设施情况如何？`, 
        type: "官方问答", 
        time: "2小时前", 
        compliance: "通过", 
        status: "待分发" 
      },
      { 
        id: 3, 
        title: isRestaurant ? "招牌黑松露脆皮烧鹅的制作工艺解密" : 
               isSpa ? "精油推拿与颂钵结合：深度放松原理解读" : 
               "五星级床品与定制香氛：解析客房细节体验", 
        type: "公众号长文", 
        time: "昨天", 
        compliance: "包含敏感词", 
        status: "需修改" 
      },
      { 
        id: 4, 
        title: isRestaurant ? "商务宴请请客指南：首选环境好的私密餐厅" : 
               isSpa ? "送长辈的健康体控礼物：放松SPA精选" : 
               "家庭周末度假挑选思路：江浙沪酒店篇", 
        type: "知乎回答", 
        time: "昨天", 
        compliance: "通过", 
        status: "已分发" 
      },
      { 
        id: 5, 
        title: isRestaurant ? "广州正宗烧鹅，必打卡的地方！" : 
               isSpa ? "全景颂钵疗愈全过程体验" : 
               "带私汤的隐秘套房开箱", 
        type: "短视频脚本", 
        time: "昨天", 
        compliance: "通过", 
        status: "草稿" 
      },
    ];
    setData(baseData);
  }, [shop?.id]); // Re-run when shop changes

  const filteredData = activeTab === '全部内容' 
    ? data 
    : data.filter(item => item.type === activeTab || (activeTab === '小红书种草' && item.type.includes('小红书')));

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowModal(false);
      const newItems = [
        { 
          id: Date.now(), 
          title: isRestaurant ? "本地人私藏的宴请神仙餐厅" : 
                 isSpa ? "周末逃离城市，沉浸式疗愈体验" : 
                 "远离喧嚣的避世秘境，周末游优选", 
          type: "小红书种草", 
          time: "刚刚", 
          compliance: "通过", 
          status: "草稿" 
        },
        { 
          id: Date.now()+1, 
          title: isRestaurant ? "十年陈皮蒸东星斑口感评测" : 
                 isSpa ? "不同脉轮对应颂钵音调解析" : 
                 "酒店无边泳池与私汤开放时间指引", 
          type: "官方问答", 
          time: "刚刚", 
          compliance: "通过", 
          status: "待分发" 
        }
      ];
      setData([ ...newItems, ...data ]);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col relative">
      <div className="flex flex-col">
        <h2 className="font-serif text-3xl text-white italic">内容生产工厂 {shop?.name ? `- ${shop.name}` : ''}</h2>
        <p className="text-[11px] uppercase tracking-widest text-white/40 mt-2">EEAT-Compliant Content Generation</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Metric title="本月生成配额" value={480 + data.length} total="500" />
        <Metric title="待审核内容" value={data.filter(d => d.status === '需修改').length} />
        <Metric title="合规通过率" value="99.4%" highlight />
      </div>

      <div className="flex-1 bg-black/35 border border-white/5 overflow-hidden flex flex-col relative">
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10" />
        <div className="h-14 border-b border-white/[0.04] flex items-center justify-between px-6 bg-white/[0.01]">
          <div className="flex space-x-6 items-center h-full">
            {tabs.map(tab => (
              <span 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-semibold cursor-pointer transition-all border-b-2 h-full flex items-center px-1 tracking-wider ${
                  activeTab === tab 
                    ? 'text-brand-gold border-brand-gold font-bold' 
                    : 'text-white/40 border-transparent hover:text-white/80'
                }`}
              >
                {tab}
              </span>
            ))}
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="text-[10px] uppercase font-bold tracking-widest text-[#0A0A0B] bg-brand-gold px-4 py-2 hover:brightness-110 transition-all cursor-pointer rounded-none shadow-[0_0_12px_rgba(197,160,89,0.15)]"
          >
            新建批量生产
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] uppercase tracking-widest text-white/30 border-b border-white/[0.04] sticky top-0 bg-[#0e0e11] z-10">
              <tr>
                <th className="px-6 py-4 font-semibold">标题 / 焦点关键词</th>
                <th className="px-6 py-4 font-semibold">类型</th>
                <th className="px-6 py-4 font-semibold">生产时间</th>
                <th className="px-6 py-4 font-semibold">合规检测</th>
                <th className="px-6 py-4 font-semibold">状态</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {filteredData.map(item => (
                <ContentRow key={item.id} {...item} />
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center p-20 text-white/40">
              <p>该分类下暂无内容</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="absolute inset-0 bg-[#0A0A0B]/85 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-[#0e0e11] border border-brand-gold/30 w-[500px] shadow-2xl relative">
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-brand-gold/40" />
            <div className="flex items-center justify-between p-6 border-b border-white/[0.04] bg-white/[0.01]">
              <h3 className="font-serif text-xl text-white italic">配置批量生成任务</h3>
              <button disabled={isGenerating} onClick={() => setShowModal(false)} className="text-white/40 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isGenerating ? (
              <div className="p-16 flex flex-col items-center justify-center space-y-6">
                <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
                <div className="text-center">
                  <p className="text-white text-sm font-medium mb-2">正在按照 E-E-A-T 规范生成内容...</p>
                  <p className="text-[10px] uppercase tracking-widest text-brand-gold font-mono">Invoking Claude-3.5-Sonnet & Content Agents</p>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3 font-semibold">选择生成模板组合 (Templates)</label>
                  <select className="w-full border border-white/10 rounded-none px-4 py-3 text-sm bg-[#050507] text-white/80 focus:outline-none appearance-none cursor-pointer hover:border-brand-gold/40 transition-colors">
                    <option>小红书探店 + 官方图文问答 (推荐)</option>
                    <option>大众点评高赞评价模板</option>
                    <option>抖音短视频分镜脚本</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3 font-semibold">输入本次推广核心关键词 / 约束</label>
                  <textarea 
                    rows={3} 
                    defaultValue={
                      isRestaurant ? "重点推介【黑松露脆皮烧鹅】以及包间的【商务宴请】属性。需带入中秋节的聚餐氛围。" : 
                      isSpa ? "重点推介【水晶颂钵疗愈】以及安静的【环境】属性。需带入周末放松解压的氛围。" :
                      "重点推介【带私汤隐世别院】以及高端的【洗浴用品】属性。体验江浙沪周边周末度假的慵懒感。"
                    }
                    className="w-full border border-white/10 rounded-none px-4 py-3 text-sm bg-[#050507] text-white/80 focus:outline-none focus:border-brand-gold/40 transition-colors resize-none" 
                  />
                </div>
                <div className="flex gap-4 pt-4 border-t border-white/[0.04]">
                  <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-white/10 text-white/60 text-xs uppercase tracking-widest hover:bg-white/5 transition-all cursor-pointer">
                    取消
                  </button>
                  <button onClick={handleGenerate} className="flex-[2] px-4 py-3 bg-brand-gold text-[#0A0A0B] text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer">
                    提交 AI 生成
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ title, value, total, highlight }: any) {
  return (
    <div className={`p-6 border relative group transition-all duration-300 ${highlight ? 'bg-brand-gold/[0.03] border-brand-gold/30 shadow-[0_0_15px_rgba(197,160,89,0.02)]' : 'bg-black/25 border-white/5 hover:border-white/15'}`}>
      <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-white/20 group-hover:border-brand-gold/30" />
      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-4 font-semibold">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className={`font-serif text-4xl font-medium ${highlight ? 'text-brand-gold' : 'text-white'}`}>{value}</span>
        {total && <span className="text-[10px] tracking-widest text-white/30">/ {total}</span>}
      </div>
    </div>
  );
}

function ContentRow({ title, type, time, compliance, status }: any) {
  const toast = useToast();
  const getStatusColor = (s: string) => {
    switch (s) {
      case '草稿': return 'text-white/40 border-white/10 bg-white/[0.01]';
      case '待分发': return 'text-blue-400 border-blue-400/20 bg-blue-500/5';
      case '需修改': return 'text-red-400 border-red-400/20 bg-red-500/5';
      case '已分发': return 'text-green-400 border-green-500/20 bg-green-500/5';
      default: return 'text-white/40 border-white/10';
    }
  };

  const isPass = compliance === '通过';

  return (
    <tr className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
      <td className="px-6 py-5 font-semibold text-white/80 group-hover:text-brand-gold transition-colors">{title}</td>
      <td className="px-6 py-5 text-white/50">{type}</td>
      <td className="px-6 py-5 text-white/40 text-[10px] uppercase tracking-widest font-mono font-semibold">{time}</td>
      <td className={`px-6 py-5 text-xs font-semibold ${isPass ? 'text-green-400' : 'text-red-400'}`}>
        <div className="flex items-center gap-1.5 font-mono">
          {isPass ? <CheckCircle className="w-3.5 h-3.5 text-green-400 animate-pulse" /> : <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-bounce" />}
          {compliance}
        </div>
      </td>
      <td className="px-6 py-5">
        <span className={`px-2.5 py-1 border rounded-none text-[9px] uppercase tracking-widest font-mono font-bold ${getStatusColor(status)}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-5 text-right">
        <button onClick={() => toast.info('打开内容编辑器', title)} className="text-[9px] uppercase tracking-widest font-bold text-brand-gold hover:text-white transition-colors cursor-pointer underline">编辑预览</button>
      </td>
    </tr>
  );
}
