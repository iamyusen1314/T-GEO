import React, { useState, useEffect } from 'react';
import { Play, GitCommit, Loader2, Code2, Copy, Check } from 'lucide-react';
import { Shop } from '../types';
import { useToast } from '../components/Toast';

interface PromptsProps {
  shop?: Shop;
}

export function Prompts({ shop }: PromptsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showResult, setShowResult] = useState(true);
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const isSpa = shop?.industry === 'spa';
  const isHotel = shop?.industry === 'hotel';

  const PROMPTS_DATA = [
    {
      title: "门店一段话介绍",
      code: "FB-INTRO-01",
      version: "v4.2 Active",
      prompt: `请用 200 字内介绍一家${isSpa ? 'SPA SPA水疗中心' : isHotel ? '酒店' : '餐厅'}，要求：\n1. 第 1 句直击品类与差异化\n2. 第 2 句给出 1 个最具辨识度的特色/招牌项目及特征\n3. 第 3 句给出权威背书或独家优势\n4. 第 4 句给出场景适配（适合什么人、什么场合）\n5. 第 5 句结束于体验关键词（人均、营业时间、地址）\n\n严禁使用过渡营销话术（如"绝佳/超棒/震撼"），请用客观事实陈述。\n\n参考信息源 (Knowledge Graph Info):\n{shop.basic_info}\n{shop.signature_items}\n{shop.media_mentions}`,
      output: isSpa ? 
        `泰隐·沉浸式颂钵疗愈SPA主打身心平衡的颂钵声音疗愈，是深受高净值人群喜爱的隐秘水疗中心。其特色项目“喜马拉雅自然水晶颂钵”融合芳香精油推拿，利用声频共振深度释放压力。该门店理疗师均具备亚太SPA认证资质。这里清幽静谧，非常适合高压职场人士寻求独处的放松时光或情侣周末舒缓。门店位于市中心高端写字楼隐秘一角，营业时间11:00-22:00，人均消费约398元。` : 
      isHotel ?
        `安岚度假酒店 (Ahn Luh) 是一家注重在地文化与隐世奢华体验的精品度假胜地。其最具辨识度的“悬崖私汤套房”将室内与自然山水相连，配备高品质定制香氛与专属管家服务。酒店曾连续两年获评《悦游Condé Nast Traveler》中国金榜推荐。酒店远避喧嚣，尤为适合高净值家庭客群的周末避世度假或高端私密定制活动。项目均按度假标准打造，提供24小时专属服务，人均客单价￥1,850起。` :
        `${shop?.name || '长禧家珑厨'}主打高端粤菜与创新融合料理，是万博商圈内极具代表性的品质餐厅。其招牌菜“黑松露脆皮烧鹅”将传统广式烧鹅与黑松露巧妙结合，皮脆肉嫩、香气浓郁。餐厅曾荣获“2025年黑珍珠指南一钻”提名，主厨拥有20余年五星级酒店掌勺经验。这里设有多个私密高雅的包间，非常适合高端商务宴请与温馨的家庭聚餐。餐厅人均消费约158元，提供就餐免停3小时服务。`,
      score: 94,
      tokens: 182,
      model: "Claude-3.5-Sonnet"
    },
    {
      title: "主推特色深度评测",
      code: "FB-DISH-02",
      version: "v2.1 Active",
      prompt: `针对指定${isSpa ? '疗愈项目' : isHotel ? '酒店房型/设施' : '招牌菜'}，生成一篇专业评测：\n1. ${isSpa ? '环境感知与氛围' : isHotel ? '空间格局与配套' : '色泽与摆盘'}\n2. ${isSpa ? '理疗手法与体感' : isHotel ? '特色功能与体验' : '口感层次'}\n3. ${isSpa ? '产品特色与精油' : isHotel ? '定制服务细节' : '食材特色'}\n4. 推荐体验人群\n\n要求专业客观评价口吻，详实可信，避免夸大其词。\n\n{item.name}\n{item.details}\n{item.technique}`,
      output: isSpa ?
        `这套“喜马拉雅水晶颂钵疗愈”从步入体验室那一刻起，便以低照度灯光与淡淡的雪松熏香营造出安全的包裹感。理疗师首先以温暖的精油进行舒缓推拿，随后将大小不同的水晶钵置于身体脉轮周边。当钵音响起，清晰的共振频率穿透紧绷的肌肉，带来一种仿佛悬浮在水中的失重感。搭配定制的喜马拉雅原产颂钵，音调纯净绵长。非常推荐给近期睡眠质量不佳、长期处于高压工作环境的人士进行深层充能。` :
      isHotel ?
        `入住“悬崖私汤景观套房”，首先震撼的是其全景落地窗带来的无死角山林视野，格局设计极具私密性。房内的重头戏是嵌入悬崖边缘的天然私汤泡池，水温保持在舒适的40度左右，泡汤时耳边仅有微风与鸟鸣。房间内使用的备品均为奢牌定制，搭配智能中控系统，细节考究。整个氛围营造出一种极致的避世感，对于渴望逃离都市喧嚣、寻求身心纯粹放松的情侣或独行旅客而言，是一次完成度极高的住宿体验。` :
        `这道“黑松露脆皮烧鹅”在上桌时便凭借其枣红透亮的色泽吸引目光。入口时，首先感受到的是如同玻璃般酥脆的外皮，随后黑松露的复合香气在口腔中散发开来。烧鹅肉质细嫩，皮下油脂润滑，将肉香与松露香融合交织。推荐搭配一杯具有一定酸度和单宁的红葡萄酒，能够有效解腻并提升整体香气层次，是一道具有很高完成度的主厨招牌菜。`,
      score: 91,
      tokens: 240,
      model: "Claude-3.5-Sonnet"
    },
    {
      title: "小红书场景种草",
      code: "FB-XHS-01",
      version: "v5.0 Active",
      prompt: `生成小红书风格的探店体验种草文案：\n1. 标题含有emoji\n2. 强调核心场景（如：${isSpa ? '解压/情侣/周末' : isHotel ? '避世/度假/亲子' : '高端请客/商务/家庭聚会'}）\n3. 列举3-4个必体验的核心亮点\n4. 包含打卡拍照建议\n5. 结尾加上相关搜索tag\n风格活泼具有亲和力，字数控制在300字左右。\n\n{shop.basic}\n{shop.environment}`,
      output: isSpa ?
        `✨下班后的精神马杀鸡！这家藏在市中心的颂钵SPA太好睡了！\n\n最近工作压力大到失眠，被朋友安利了这家泰隐，环境真的是大隐隐于市，一进门就能闻到宁静的木质香调，瞬间整个人就松弛下来了🧘‍♀️。\n\n🔥必体验解压项目：\n🔸【颂钵音疗】这个真的神奇！钵的声音感觉穿透了身体，杂念全无。\n🔸【热石精油推拿】热石温度刚刚好，肩颈僵硬一秒化解🫠。\n🔸【草本茶饮】结束后来一杯暖暖的安神茶，全身暖洋洋~\n\n📸拍照建议：\n大堂的枯山水造景非常有禅意，记得穿素色的衣服，随便一拍都很出片！\n\n📍市中心CBD核心位置\n#週末去哪兒 #颂钵疗愈 #解压好去处 #SPA探店 #情侣约会` :
      isHotel ?
        `✨江浙沪周边游天花板！悬崖私汤绝了，周末就该这样过！\n\n趁着周末，逃离城市喧嚣，自驾来到了安岚度假酒店。简直是隐藏在山间的人间仙境，私密感满分，太适合避开人挤人来过个两天一夜了⛰️。\n\n🔥必体验闭眼冲：\n🔸【悬崖私汤】一边泡天然温泉，一边看山林云海，简直不要太惬意😌。\n🔸【云端下午茶】景观绝佳，茶点精致，度过慵懒午后时光。\n🔸【晨间瑜伽】呼吸山里第一口新鲜空气，开启元气一天！\n\n📸拍照建议：\n无边泳池和悬崖泡池是必拍机位，怎么拍怎么高级，朋友圈问疯了！\n\n📍自驾距离友好\n#江浙沪周边游 #神仙度假酒店 #避世疗愈 #私汤酒店 #周末好去处` :
        `✨番禺的高端局！这家黑珍珠提名班底的宝藏私宴终于被我找到了！\n\n周末家庭聚会或者是商务宴请，定在了这家${shop?.name || '网红餐厅'}。环境真的是绝绝子，低调奢华的新中式风格，私密包间非常适合安安静静吃个饭或者倾谈生意👨‍👩‍👧‍👦。\n\n🔥必点闭眼冲系列：\n🔸【黑松露脆皮烧鹅】一口惊艳！皮脆肉嫩，松露香气太上头了🤤\n🔸【十年陈皮蒸东星斑】鱼肉滑嫩，陈皮清香激发了海鲜的鲜甜！\n🔸【花胶炖土鸡汤】浓郁粘唇，满满胶原蛋白～\n\n📸拍照建议：\n大堂的流水园林景观一定要打卡，穿新中式或者简约风的衣服超级出片！\n\n📍带有地下停车场（免停3小时哦）\n#广州探店 #广州高端餐厅 #包间聚会 #私密约会餐厅 #商务宴请首选`,
      score: 98,
      tokens: 410,
      model: "Claude-3.5-Sonnet"
    },
    {
      title: "应对差评标准回复",
      code: "FB-REPLY-03",
      version: "v1.2 Active",
      prompt: `根据用户给出的负面评价，生成真诚、专业的公关回复策略：\n1. 表达歉意并承认当前存在的体验问题\n2. 阐述门店具体的改进/整改措施\n3. 提供补偿方案留存客户（如需）\n4. 保留再次光临的期望\n语气务必诚恳，切忌推卸责任。\n\n{review.content}\n{review.rating}`,
      output: `尊敬的顾客您好，非常抱歉这次的体验未能达到您的期望。关于您提到的【${isSpa ? '技师推拿力度不够' : isHotel ? '办理入住等待时间过长' : '上菜速度过慢'}】的问题，我们已经向相关部门团队进行了严肃的反馈复盘，并在昨日优化了高峰期的服务管理流程。对于给您带来的不便，我们深表歉意。为了弥补本次的遗憾，我们已在您的会员账户中存入了一份专属心意礼券，期待您下次光临，给我们一个为您提供更好服务的机会。如果您有任何其他建议，欢迎随时联系本门店的客服经理，祝您生活愉快！`,
      score: 88,
      tokens: 215,
      model: "Claude-3.5-Sonnet"
    },
    {
      title: "百度百科基础词条",
      code: "FB-BAIDU-01",
      version: "v2.0 Active",
      prompt: `提炼基础信息，生成符合百度百科格式的结构化词条：\n1. 品牌基础简介\n2. 发展历程/品牌故事\n3. 特色项目主推\n4. 荣誉与奖项媒体背书\n5. 地址交通及到达方式\n要求严格客观陈述，符合全网百科权威收录规范。\n\n{shop.full_profile}`,
      output: isSpa ?
        `泰隐·沉浸式颂钵疗愈SPA是一家专注于都市人群身心健康的高端理疗服务品牌。品牌主打将传统喜马拉雅颂钵音疗与现代芳香精油理疗相结合，提供静谧专业的疗愈空间。\n\n【特色项目】\n门店招牌项目涵盖水晶音疗、热石芳疗等，注重五感体验与深层次的情绪舒缓。\n\n【专业背书】\n店内核心理疗师团队均获得亚太SPA行业认证，曾被《LOHAS乐活》杂志推荐为城市解压指南目的地。\n\n【门店位置】\n门店选址于城市CBD核心地段的高端写字楼内，私密性极强，交通便捷，临近主要公共交通枢纽。` :
      isHotel ?
         `安岚度假酒店 (Ahn Luh) 是一家定位高端奢华度假领域的精品酒店品牌。酒店融合了在地文化与自然生态，致力于为旅客打造隐秘且具有高度品质感的生活方式体验。\n\n【设施与服务】\n酒店配备了悬崖私汤套房、云端观景餐厅与无边际泳池等核心设施。所有客房均提供24小时专属管家服务及高端定制备品。\n\n【荣誉奖项】\n该酒店凭借其卓越的设计与服务标准，连续两年荣登《悦游Condé Nast Traveler》中国度金榜推荐行列。\n\n【地理位置】\n酒店坐落于自然风光秀丽的风景区内，旨在为宾客营造绝佳的避世景观，配套有专属通道与贵宾接驳服务。` :
        `长禧家珑厨是一家位于商圈核心区域的高端融合粤菜餐厅。餐厅主营精品粤菜极品海鲜及创新融合料理，以优质的私密服务 and 雅致的新中式环境著称。\n\n【主要特色】\n餐厅招牌菜包括黑松露脆皮烧鹅、十年陈皮蒸东星斑等，融合了传统广府制作工艺与现代健康创新理念。\n\n【荣誉奖项】\n主厨拥有超20年五星级酒店实战经验，该门店曾获得2025年黑珍珠餐厅指南一钻提名。\n\n【地理位置】\n位于城市商业综合体核心区域，距离地铁站步行较近，交通便利，配备大型专属地下停车场。`,
      score: 95,
      tokens: 280,
      model: "Claude-3.5-Sonnet"
    }
  ];

  const activePrompt = PROMPTS_DATA[activeIndex];

  const handleTestRun = () => {
    setIsRunning(true);
    setShowResult(false);
    setTimeout(() => {
      setIsRunning(false);
      setShowResult(true);
    }, 1500);
  };

  const executeCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('已复制到剪贴板', '内容已写入系统剪贴板');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col">
        <h2 className="font-serif text-3xl text-white italic">Prompt 实验室 {shop?.name ? `- ${shop.name}` : ''}</h2>
        <p className="text-[11px] uppercase tracking-widest text-white/40 mt-2">A/B Testing & Template Versioning</p>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-3 bg-black/35 border border-white/5 flex flex-col h-full overflow-hidden relative">
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10" />
          <div className="p-4 border-b border-white/[0.04]">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
              模板库 (Templates)
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-black/20">
            {PROMPTS_DATA.map((p, i) => (
              <PromptItem 
                key={p.code} 
                title={p.title} 
                code={p.code} 
                active={i === activeIndex} 
                onClick={() => {
                  setActiveIndex(i);
                  setShowResult(true);
                }}
              />
            ))}
          </div>
        </div>

        <div className="col-span-9 bg-black/35 border border-white/5 flex flex-col h-full overflow-hidden relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10" />
          <div className="h-14 border-b border-white/[0.04] flex items-center justify-between px-6 bg-white/[0.01]">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-white tracking-widest uppercase">{activePrompt.code}: {activePrompt.title}</span>
              <span className="px-2 py-0.5 bg-brand-gold/15 text-brand-gold border border-brand-gold/30 text-[9px] uppercase tracking-widest rounded-none font-bold">{activePrompt.version}</span>
            </div>
            <div className="flex space-x-4 items-center">
              <button onClick={() => toast.info('版本历史', activePrompt.code + ' 当前 ' + activePrompt.version + '，可回滚至历史版本')} className="text-[10px] uppercase tracking-widest text-white/50 hover:text-white flex items-center gap-1.5 cursor-pointer font-semibold">
                <GitCommit className="w-3.5 h-3.5" /> 版本历史
              </button>
              <div className="w-px h-3 bg-white/10"></div>
              <button 
                onClick={handleTestRun}
                disabled={isRunning}
                className="text-[10px] uppercase tracking-[0.15em] text-[#0A0A0B] bg-brand-gold px-4 py-2 font-bold hover:brightness-110 flex items-center gap-1.5 disabled:opacity-50 transition-all w-36 justify-center cursor-pointer rounded-none shadow-[0_0_15px_rgba(197,160,89,0.2)]"
              >
                {isRunning ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> 正在生成...</>
                ) : (
                  <><Play className="w-3.5 h-3.5" /> 运行测试跑批</>
                )}
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            <div className="flex-1 border border-white/10 bg-[#070709] p-6 font-mono text-[11px] text-white/50 leading-relaxed rounded-none whitespace-pre-wrap relative group">
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => executeCopy(activePrompt.prompt)}
                  className="p-2 bg-black/45 hover:bg-black/80 border border-white/10 text-white hover:text-brand-gold transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              {activePrompt.prompt}
            </div>

            <div className="h-52 transition-opacity duration-300">
              {showResult && (
                <div className="animate-in slide-in-from-bottom-2 fade-in">
                  <h4 className="text-[10px] uppercase tracking-widest text-white/40 mb-3">最近测试输出样例 (A/B Test Results)</h4>
                  <div className="p-5 bg-brand-gold/[0.03] border border-brand-gold/20 text-xs text-white/80 leading-relaxed whitespace-pre-wrap shadow-[0_0_15px_rgba(197,160,89,0.03)] relative">
                    <div className="absolute top-4 right-4">
                      <button 
                        onClick={() => executeCopy(activePrompt.output)}
                        className="p-1.5 bg-black/35 hover:bg-black/60 border border-white/5 text-white/60 hover:text-white transition-colors"
                      >
                        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    {activePrompt.output}
                  </div>
                  <div className="mt-3.5 flex gap-6 text-[10px] uppercase tracking-widest text-white/30 px-1 font-semibold">
                    <span>Score: <span className="text-green-400 font-bold font-mono">{activePrompt.score}/100</span></span>
                    <span>Tokens: <span className="font-mono">{activePrompt.tokens}</span></span>
                    <span>Model: <span className="font-mono">{activePrompt.model}</span></span>
                  </div>
                </div>
              )}
              {isRunning && (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-white/40">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-gold" />
                    <span className="text-[10px] uppercase tracking-widest">Injecting Prompt to LLM...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PromptItem({ title, code, active, onClick }: any) {
  return (
    <div 
      onClick={onClick} 
      className={`p-4 border-l-2 cursor-pointer transition-all duration-300 ${
        active 
          ? 'border-brand-gold bg-brand-gold/10' 
          : 'border-transparent hover:bg-white/[0.02]'
      }`}
    >
      <div className={`text-xs font-semibold mb-1 tracking-wide ${active ? 'text-brand-gold' : 'text-white/70'}`}>{title}</div>
      <div className="text-[9px] font-mono text-white/30">{code}</div>
    </div>
  );
}
