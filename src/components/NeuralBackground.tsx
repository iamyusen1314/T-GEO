import React, { useEffect, useRef, useState } from 'react';
import { HERO_VIDEO_SRC } from '../lib/config';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label: string;
  type: 'core' | 'data' | 'web';
  glowColor: string;
}

// Search-intent packets that fly from the edges toward AI engine cores,
// representing real local-life queries being routed to LLMs.
interface QueryPacket {
  x: number;
  y: number;
  tx: number;
  ty: number;
  speed: number;
  label: string;
  life: number;     // 0..1 progress
  color: string;
}

const QUERY_POOL = [
  '徐汇适合商务宴请的火锅',
  '正规不踩雷的颂钵SPA',
  '江浙沪带泳池的亲子酒店',
  '人均200有包间的粤菜',
  '失眠调理推荐去哪做',
  '看海景的高端民宿',
  '深夜还营业的好餐厅',
  '情侣周末放松好去处',
  '景点附近的特色住宿',
  '带长辈吃环境好的店',
];

interface Props {
  /** 'hero' = login splash (more intense), 'ambient' = behind the workspace */
  variant?: 'hero' | 'ambient';
}

export function NeuralBackground({ variant = 'hero' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [videoOk, setVideoOk] = useState(true);

  const intense = variant === 'hero';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const coreAIs = [
      { name: 'DeepSeek', glow: '#3B82F6' },
      { name: '豆包', glow: '#EF4444' },
      { name: 'Kimi', glow: '#10B981' },
      { name: '腾讯元宝', glow: '#22D3EE' },
      { name: '通义千问', glow: '#A855F7' },
      { name: '文心一言', glow: '#2563EB' },
      { name: 'ChatGPT', glow: '#10A37F' },
      { name: 'Gemini', glow: '#C5A059' },
      { name: 'Claude', glow: '#8B5CF6' },
    ];
    const dataNodes = [
      '粤菜·长禧家珑厨', '泰隐颂钵SPA', '安岚度假酒店',
      '美团商家数据源', '大众点评商户索引', '小红书种草提及流',
      '百度百科高权信源', '高德地图店标坐标', '携程游记语料库', '飞猪精品度假链',
    ];
    const webNodes = [
      '高维知识星云', 'EEAT 合规链', 'RAG 提示词流', '相似向量微调',
      '恶意同行拦截', '本地SEO检索', '上下文知识切片',
    ];

    const nodes: Node[] = [];
    coreAIs.forEach((ai) => nodes.push({
      x: Math.random() * width, y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 2 + 3.5, label: ai.name, type: 'core', glowColor: ai.glow,
    }));
    dataNodes.forEach((name) => nodes.push({
      x: Math.random() * width, y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      radius: Math.random() * 1.5 + 2, label: name, type: 'data', glowColor: '#C5A059',
    }));
    webNodes.forEach((name) => nodes.push({
      x: Math.random() * width, y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1 + 1.5, label: name, type: 'web', glowColor: 'rgba(255,255,255,0.4)',
    }));

    // Location pins anchored to a faint map grid (lighting up as "discovered")
    const pins = Array.from({ length: intense ? 14 : 8 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      phase: Math.random() * Math.PI * 2,
    }));

    let packets: QueryPacket[] = [];
    const coreNodes = () => nodes.filter(n => n.type === 'core');

    const spawnPacket = () => {
      const targets = coreNodes();
      if (!targets.length) return;
      const target = targets[Math.floor(Math.random() * targets.length)];
      // Start from a random edge
      const edge = Math.floor(Math.random() * 4);
      let x = 0, y = 0;
      if (edge === 0) { x = Math.random() * width; y = -20; }
      else if (edge === 1) { x = width + 20; y = Math.random() * height; }
      else if (edge === 2) { x = Math.random() * width; y = height + 20; }
      else { x = -20; y = Math.random() * height; }
      packets.push({
        x, y, tx: target.x, ty: target.y,
        speed: 0.006 + Math.random() * 0.006,
        label: QUERY_POOL[Math.floor(Math.random() * QUERY_POOL.length)],
        life: 0, color: target.glowColor,
      });
    };

    let mouseX = -1000, mouseY = -1000, isMouseOver = false;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left; mouseY = e.clientY - rect.top; isMouseOver = true;
    };
    const handleMouseLeave = () => { isMouseOver = false; mouseX = -1000; mouseY = -1000; };
    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    canvas.parentElement?.addEventListener('mouseleave', handleMouseLeave);

    let frame = 0;
    const spawnEvery = intense ? 26 : 48;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);
      const time = Date.now() * 0.0016;
      const cx = width / 2, cy = height / 2;

      // 1. Micro grid matrix
      ctx.strokeStyle = 'rgba(197,160,89,0.025)';
      ctx.lineWidth = 0.5;
      const gridSize = 70;
      for (let x = 0; x < width; x += gridSize) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
      for (let y = 0; y < height; y += gridSize) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

      // 2. Rotating radar sweep — the "AI visibility scan"
      const sweepAngle = time * 0.6;
      const sweepRadius = Math.max(width, height) * 0.75;
      const grad = ctx.createConicGradient ? ctx.createConicGradient(sweepAngle, cx, cy) : null;
      if (grad) {
        grad.addColorStop(0, 'rgba(197,160,89,0.10)');
        grad.addColorStop(0.04, 'rgba(197,160,89,0.0)');
        grad.addColorStop(1, 'rgba(197,160,89,0.0)');
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, sweepRadius, sweepAngle - 0.5, sweepAngle);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }
      // Concentric radar rings
      ctx.strokeStyle = 'rgba(197,160,89,0.05)';
      ctx.lineWidth = 0.6;
      for (let r = 120; r < sweepRadius; r += 150) {
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      }

      // 3. Location pins lighting up as "discovered" coordinates
      pins.forEach((p) => {
        const pulse = (Math.sin(time * 1.4 + p.phase) + 1) / 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5 + pulse * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(197,160,89,${0.15 + pulse * 0.45})`;
        ctx.shadowBlur = 6 * pulse; ctx.shadowColor = '#C5A059';
        ctx.fill(); ctx.shadowBlur = 0;
        if (pulse > 0.92) {
          ctx.strokeStyle = `rgba(197,160,89,${(pulse - 0.92) * 4})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.arc(p.x, p.y, 6 + (1 - pulse) * 40, 0, Math.PI * 2); ctx.stroke();
        }
      });

      // 4. Synapse connections + flowing packets
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 200;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.16;
            if (nodes[i].type === 'core' || nodes[j].type === 'core') {
              ctx.strokeStyle = `rgba(197,160,89,${alpha * 1.5})`; ctx.lineWidth = 0.65;
            } else {
              ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.8})`; ctx.lineWidth = 0.4;
            }
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
            if ((i + j) % 3 === 0) {
              const progress = (time + (i * 0.08)) % 1.0;
              const px = nodes[i].x + (nodes[j].x - nodes[i].x) * progress;
              const py = nodes[i].y + (nodes[j].y - nodes[i].y) * progress;
              ctx.beginPath(); ctx.arc(px, py, 1.3, 0, Math.PI * 2);
              ctx.fillStyle = nodes[i].type === 'core' ? nodes[i].glowColor : '#C5A059';
              ctx.shadowBlur = 4; ctx.shadowColor = ctx.fillStyle as string; ctx.fill(); ctx.shadowBlur = 0;
            }
          }
        }
      }

      // 5. Query intent packets streaming toward engines
      if (frame % spawnEvery === 0 && packets.length < (intense ? 7 : 4)) spawnPacket();
      packets = packets.filter(pk => pk.life < 1);
      packets.forEach((pk) => {
        pk.life += pk.speed;
        const e = pk.life < 0.5 ? 2 * pk.life * pk.life : 1 - Math.pow(-2 * pk.life + 2, 2) / 2;
        pk.x = pk.x + (pk.tx - pk.x) * pk.speed * 6;
        pk.y = pk.y + (pk.ty - pk.y) * pk.speed * 6;
        const fade = pk.life < 0.15 ? pk.life / 0.15 : pk.life > 0.8 ? (1 - pk.life) / 0.2 : 1;
        // trail
        ctx.strokeStyle = `rgba(197,160,89,${0.18 * fade})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(pk.x, pk.y); ctx.lineTo(pk.tx, pk.ty); ctx.stroke();
        // head
        ctx.beginPath(); ctx.arc(pk.x, pk.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = pk.color; ctx.shadowBlur = 8; ctx.shadowColor = pk.color; ctx.fill(); ctx.shadowBlur = 0;
        // label
        if (intense) {
          ctx.fillStyle = `rgba(255,255,255,${0.5 * fade})`;
          ctx.font = '500 8.5px "JetBrains Mono", monospace';
          ctx.fillText(`"${pk.label}"`, pk.x + 8, pk.y - 6);
        }
        void e;
      });

      // 6. Nodes + HUD labels
      nodes.forEach((node) => {
        node.x += node.vx; node.y += node.vy;
        if (node.x < 10) { node.x = 10; node.vx = Math.abs(node.vx); }
        if (node.x > width - 10) { node.x = width - 10; node.vx = -Math.abs(node.vx); }
        if (node.y < 10) { node.y = 10; node.vy = Math.abs(node.vy); }
        if (node.y > height - 10) { node.y = height - 10; node.vy = -Math.abs(node.vy); }

        if (isMouseOver) {
          const mdx = mouseX - node.x, mdy = mouseY - node.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 180) {
            if (node.type === 'core') {
              ctx.strokeStyle = `rgba(197,160,89,${(1 - mdist / 180) * 0.15})`; ctx.lineWidth = 0.5;
              ctx.beginPath(); ctx.moveTo(node.x, node.y); ctx.lineTo(mouseX, mouseY); ctx.stroke();
            }
            const strength = (180 - mdist) / 180;
            node.vx += (mdx / mdist) * strength * 0.03;
            node.vy += (mdy / mdist) * strength * 0.03;
            const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
            const maxSpeed = node.type === 'core' ? 0.9 : 0.6;
            if (speed > maxSpeed) { node.vx = (node.vx / speed) * maxSpeed; node.vy = (node.vy / speed) * maxSpeed; }
          }
        }

        if (node.type === 'core') {
          const pulseRadius = node.radius + Math.sin(Date.now() * 0.004 + node.x * 2) * 5 + 6;
          ctx.strokeStyle = node.glowColor + '20'; ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2); ctx.stroke();
          ctx.strokeStyle = node.glowColor + '0d';
          ctx.beginPath(); ctx.arc(node.x, node.y, pulseRadius * 1.5, 0, Math.PI * 2); ctx.stroke();
        }

        ctx.shadowBlur = node.type === 'core' ? 14 : 6;
        ctx.shadowColor = node.glowColor;
        ctx.fillStyle = node.type === 'core' ? node.glowColor : '#E4E4E7';
        ctx.beginPath(); ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;

        const isHovered = isMouseOver && (Math.pow(mouseX - node.x, 2) + Math.pow(mouseY - node.y, 2)) < 80 * 80;
        if (node.type === 'core') {
          ctx.fillStyle = '#C5A059';
          ctx.font = '700 9px "JetBrains Mono", monospace';
          ctx.fillText(`[ ${node.label} ]`, node.x + 10, node.y + 3);
        } else if (node.type === 'data') {
          ctx.fillStyle = 'rgba(255,255,255,0.65)';
          ctx.font = '500 8.5px "JetBrains Mono", monospace';
          ctx.fillText(node.label, node.x + 8, node.y + 3);
        } else if (isHovered) {
          ctx.fillStyle = 'rgba(255,255,255,0.45)';
          ctx.font = '500 8px "JetBrains Mono", monospace';
          ctx.fillText(node.label, node.x + 8, node.y + 3);
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      canvas.parentElement?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intense]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* 1. Swappable themed background video (put your file at public/hero.mp4) */}
      {videoOk && (
        <video
          autoPlay muted loop playsInline
          onError={() => setVideoOk(false)}
          className={`absolute inset-0 w-full h-full object-cover scale-[1.01] mix-blend-screen ${intense ? 'opacity-65' : 'opacity-75'}`}
          style={{ filter: 'brightness(0.7) contrast(1.15) saturate(0.9)' }}
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
      )}

      {/* 2. Dark/amber cinematic tint overlay */}
      <div
        className="absolute inset-0 bg-[#020203]/55 bg-gradient-to-tr from-[#020203]/80 via-transparent to-[#040406]/20"
        style={{ backdropFilter: 'blur(1.5px)' }}
      />

      {/* 3. Live local-SEO radar canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" style={{ opacity: 0.95 }} />

      {/* 4. CRT scanline + moving sweep line for sci-fi fidelity */}
      <div className="absolute inset-0 hud-scanlines opacity-60" />
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent animate-scanline" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,#020203_100%)] opacity-70" />
    </div>
  );
}
