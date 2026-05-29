import React, { useState, useEffect } from 'react';
import { Plus, Move, LayoutGrid } from 'lucide-react';
import { Shop } from '../types';

const RESTAURANT_TASKS = [
  { id: 't1', title: "大众点评基础信息更新", platform: "大众点评", dueDate: "无期限", status: "backlog" },
  { id: 't2', title: "高德地图POI纠错", platform: "高德地图", dueDate: "本周三", status: "backlog" },
  { id: 't3', title: "新品上市公众号排版", platform: "微信公众号", dueDate: "本周末", status: "backlog" },
  { id: 't4', title: "商务宴请探店Vlog", platform: "抖音", dueDate: "今天 18:00", status: "review" },
  { id: 't5', title: "高端粤菜场景种草", platform: "小红书", dueDate: "明天 12:00", status: "review" },
  { id: 't6', title: "带父母聚餐必选榜单", platform: "小红书", dueDate: "明天 15:00", status: "review" },
  { id: 't7', title: "百度百科信息更正", platform: "百度百科", dueDate: "本周五", status: "executing" },
  { id: 't8', title: "中秋活动预热稿件", platform: "知乎", dueDate: "明晚", status: "executing" },
  { id: 't9', title: "美团团购套餐上新", platform: "美团", dueDate: "今天", status: "published" },
  { id: 't10', title: "黑松露脆皮烧鹅吃法", platform: "小红书", dueDate: "2天前", status: "published" },
];

const SPA_TASKS = [
  { id: 't1', title: "大众点评基础套餐更新", platform: "大众点评", dueDate: "无期限", status: "backlog" },
  { id: 't2', title: "预约小程序升级推广", platform: "微信公众号", dueDate: "本周末", status: "backlog" },
  { id: 't3', title: "颂钵疗愈沉浸式体验", platform: "抖音", dueDate: "今天 18:00", status: "review" },
  { id: 't4', title: "周末情侣放松探店", platform: "小红书", dueDate: "明天 12:00", status: "review" },
  { id: 't5', title: "失眠者必看疗愈指南", platform: "小红书", dueDate: "明天 15:00", status: "review" },
  { id: 't6', title: "本地生活服务门店纠错", platform: "高德地图", dueDate: "本周三", status: "backlog" },
  { id: 't7', title: "技师团队履历完善", platform: "百度百科", dueDate: "本周五", status: "executing" },
  { id: 't8', title: "美团限时团购券上线", platform: "美团", dueDate: "今天", status: "published" },
  { id: 't9', title: "精油科普分享", platform: "知乎", dueDate: "2天前", status: "published" },
];

const HOTEL_TASKS = [
  { id: 't1', title: "携程房型基础信息更新", platform: "携程", dueDate: "无期限", status: "backlog" },
  { id: 't2', title: "飞猪大促活动海报", platform: "飞猪", dueDate: "本周三", status: "backlog" },
  { id: 't3', title: "高德打车定位纠错", platform: "高德地图", dueDate: "本周五", status: "backlog" },
  { id: 't4', title: "无边泳池打卡Vlog", platform: "抖音", dueDate: "今天 18:00", status: "review" },
  { id: 't5', title: "江浙沪逃离城市计划", platform: "小红书", dueDate: "明天 12:00", status: "review" },
  { id: 't6', title: "宠物友好攻略", platform: "小红书", dueDate: "明天 15:00", status: "review" },
  { id: 't7', title: "五星级体验深评", platform: "知乎", dueDate: "明晚", status: "executing" },
  { id: 't8', title: "马蜂窝本地游记", platform: "马蜂窝", dueDate: "明晚", status: "executing" },
  { id: 't9', title: "周末双日游套餐上新", platform: "美团", dueDate: "今天", status: "published" },
];

const COLUMNS = [
  { id: 'backlog', title: '待处理 (Backlog)' },
  { id: 'review', title: '达人匹配 / 审核中' },
  { id: 'executing', title: '排期执行中' },
  { id: 'published', title: '已发布 (Published)' },
];

interface DistributionProps {
  shop?: Shop;
}

export function Distribution({ shop }: DistributionProps) {
  const [tasks, setTasks] = useState(RESTAURANT_TASKS);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [hoveredColumnId, setHoveredColumnId] = useState<string | null>(null);

  useEffect(() => {
    if (shop?.industry === 'spa') setTasks(SPA_TASKS);
    else if (shop?.industry === 'hotel') setTasks(HOTEL_TASKS);
    else setTasks(RESTAURANT_TASKS);
  }, [shop?.industry]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setHoveredColumnId(columnId);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    if (draggedTaskId) {
      setTasks(prev => prev.map(t => t.id === draggedTaskId ? { ...t, status: statusId } : t));
    }
    setDraggedTaskId(null);
    setHoveredColumnId(null);
  };

  const addNewTask = () => {
    const defaultPlatform = shop?.industry === 'hotel' ? "携程" : shop?.industry === 'spa' ? "美团" : "小红书";
    const newTask = {
      id: 't' + Date.now(),
      title: "定制渠道推广文案批次配置",
      platform: defaultPlatform,
      dueDate: "刚刚",
      status: "backlog"
    };
    setTasks([newTask, ...tasks]);
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl text-white italic">分发任务看板 {shop?.name ? `- ${shop.name}` : ''}</h2>
          <p className="text-[11px] uppercase tracking-widest text-white/40 mt-2">Content Orchestration & Publishing</p>
        </div>
        <button 
          onClick={addNewTask}
          className="px-4 py-2 bg-brand-gold text-[#0A0A0B] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:brightness-110 hover:shadow-[0_0_15px_rgba(197,160,89,0.35)] transition-all cursor-pointer rounded-none">
          <Plus className="w-3.5 h-3.5" />
          创建分发任务
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 flex-1 min-h-0">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          const isHovered = hoveredColumnId === col.id;
          return (
            <div 
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={() => setHoveredColumnId(null)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`bg-black/35 border transition-all duration-300 flex flex-col h-full relative ${
                isHovered ? 'border-brand-gold/40 shadow-[0_0_20px_rgba(197,160,89,0.03)] bg-brand-gold/[0.01]' : 'border-white/5'
              }`}
            >
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/5" />
              <div className="p-4 border-b border-white/[0.04] flex justify-between items-center bg-white/[0.01]">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-white/70 flex items-center gap-2">
                  <LayoutGrid className="w-3 h-3 text-brand-gold animate-pulse" />
                  {col.title}
                </span>
                <span className="text-[10px] bg-brand-gold/10 border border-brand-gold/20 px-2 py-0.5 font-semibold text-brand-gold">{colTasks.length}</span>
              </div>
              <div className="p-3 flex-1 overflow-y-auto space-y-3 bg-black/10 select-none">
                {colTasks.map(item => (
                  <div 
                    key={item.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    className="p-4 border border-white/10 bg-[#070709] hover:border-brand-gold/45 cursor-grab active:cursor-grabbing transition-all duration-300 group hover:shadow-[0_0_15px_rgba(197,160,89,0.02)]"
                  >
                    <div className="flex items-center justify-between mb-3 text-[9px] uppercase tracking-widest text-white/30 font-semibold">
                      <span className={`px-2 py-0.5 border font-semibold ${getPlatformClass(item.platform)}`}>{item.platform}</span>
                      <span className="font-mono text-white/40">{item.dueDate}</span>
                    </div>
                    <h4 className="text-xs text-white/85 font-semibold leading-relaxed group-hover:text-brand-gold transition-colors">{item.title}</h4>
                    <div className="mt-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-white/30 text-[9px] uppercase tracking-widest font-mono">
                      <Move className="w-2.5 h-2.5" /> Drag context
                    </div>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div className="h-28 flex flex-col items-center justify-center border border-dashed border-white/5 text-[9px] text-white/20 uppercase tracking-widest gap-2">
                    <span>释放文件块至此</span>
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
