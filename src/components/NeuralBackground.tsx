import React, { useEffect, useRef } from 'react';

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

export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Precise node setups representing entities in T-GEO semantic graphs
    const coreAIs = [
      { name: 'DeepSeek R1', glow: '#3B82F6' },
      { name: 'Gemini Pro 2.5', glow: '#C5A059' },
      { name: 'Claude 3.5 Sonnet', glow: '#8B5CF6' },
      { name: 'Kimi Chat RAG', glow: '#10B981' },
      { name: '豆包 API', glow: '#EF4444' },
    ];

    const dataNodes = [
      '粤菜·长禧家珑厨', '泰隐颂钵SPA', '安岚度假酒店',
      '美团商家数据源', '大众点评商户索引', '小红书种草提及流',
      '百度百科高权信源', '高德地图店标坐标', '携程游记语料库', '飞猪精品度假链'
    ];

    const webNodes = [
      '高维知识星云', 'EEAT 合规链', 'RAG 提示词流', '相似向量微调',
      '恶意同行拦截', '本地SEO检索', '上下文知识切片'
    ];

    const nodes: Node[] = [];

    // Place core nodes
    coreAIs.forEach((ai) => {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 3.5,
        label: ai.name,
        type: 'core',
        glowColor: ai.glow,
      });
    });

    // Place normal data nodes
    dataNodes.forEach((name) => {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: Math.random() * 1.5 + 2,
        label: name,
        type: 'data',
        glowColor: '#C5A059',
      });
    });

    // Place smaller web nodes
    webNodes.forEach((name) => {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1 + 1.5,
        label: name,
        type: 'web',
        glowColor: 'rgba(255, 255, 255, 0.4)',
      });
    });

    let mouseX = -1000;
    let mouseY = -1000;
    let isMouseOver = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseOver = true;
    };

    const handleMouseLeave = () => {
      isMouseOver = false;
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    canvas.parentElement?.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Futuristic micro grid matrix layer
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.025)';
      ctx.lineWidth = 0.5;
      const gridSize = 70;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const time = Date.now() * 0.0016;

      // 2. Draw connections with animated neural flow packets
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = 200;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.16;
            
            // Render the synapse line
            if (nodes[i].type === 'core' || nodes[j].type === 'core') {
              ctx.strokeStyle = `rgba(197, 160, 89, ${alpha * 1.5})`;
              ctx.lineWidth = 0.65;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
              ctx.lineWidth = 0.4;
            }
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            // RAG Signal Flow Packets traveling across neural vectors
            if ((i + j) % 3 === 0) {
              const progress = (time + (i * 0.08)) % 1.0;
              const px = nodes[i].x + (nodes[j].x - nodes[i].x) * progress;
              const py = nodes[i].y + (nodes[j].y - nodes[i].y) * progress;
              
              ctx.beginPath();
              ctx.arc(px, py, 1.3, 0, Math.PI * 2);
              ctx.fillStyle = nodes[i].type === 'core' ? nodes[i].glowColor : '#C5A059';
              ctx.shadowBlur = 4;
              ctx.shadowColor = ctx.fillStyle;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      }

      // 3. Draw nodes and label HUD brackets
      nodes.forEach((node) => {
        // Soft inertia movement
        node.x += node.vx;
        node.y += node.vy;

        // Bounce boundary safeguards
        if (node.x < 10) { node.x = 10; node.vx = Math.abs(node.vx); }
        if (node.x > width - 10) { node.x = width - 10; node.vx = -Math.abs(node.vx); }
        if (node.y < 10) { node.y = 10; node.vy = Math.abs(node.vy); }
        if (node.y > height - 10) { node.y = height - 10; node.vy = -Math.abs(node.vy); }

        // Core responsive gravity from user cursor
        if (isMouseOver) {
          const mdx = mouseX - node.x;
          const mdy = mouseY - node.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 180) {
            // Draw interactive dynamic line to mouse for high sci-fi response
            if (node.type === 'core') {
              ctx.strokeStyle = `rgba(197, 160, 89, ${(1 - mdist/180) * 0.15})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(mouseX, mouseY);
              ctx.stroke();
            }

            const strength = (180 - mdist) / 180;
            node.vx += (mdx / mdist) * strength * 0.03;
            node.vy += (mdy / mdist) * strength * 0.03;
            
            // Clamp speed
            const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
            const maxSpeed = node.type === 'core' ? 0.9 : 0.6;
            if (speed > maxSpeed) {
              node.vx = (node.vx / speed) * maxSpeed;
              node.vy = (node.vy / speed) * maxSpeed;
            }
          }
        }

        // Draw node concentric pulsing rings representing database sync status
        if (node.type === 'core') {
          const pulseRadius = node.radius + Math.sin(Date.now() * 0.004 + node.x * 2) * 5 + 6;
          ctx.strokeStyle = node.glowColor + '20'; // ~12% Alpha Hex
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Outer secondary ring
          ctx.strokeStyle = node.glowColor + '0d'; // ~5% Alpha Hex
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseRadius * 1.5, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Render dot glow parameters
        ctx.shadowBlur = node.type === 'core' ? 14 : 6;
        ctx.shadowColor = node.glowColor;

        ctx.fillStyle = node.type === 'core' ? node.glowColor : '#E4E4E7';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Custom sci-fi HUD text brackets for clarity and high production values
        const isHovered = isMouseOver && (Math.pow(mouseX - node.x, 2) + Math.pow(mouseY - node.y, 2)) < 80 * 80;
        
        if (node.type === 'core') {
          ctx.fillStyle = '#C5A059';
          ctx.font = '700 9px "JetBrains Mono", "Fira Code", monospace';
          ctx.fillText(`[ ${node.label} ]`, node.x + 10, node.y + 3);
        } else if (node.type === 'data') {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.font = '500 8.5px "JetBrains Mono", "Fira Code", monospace';
          ctx.fillText(node.label, node.x + 8, node.y + 3);
        } else if (isHovered) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.font = '500 8px "JetBrains Mono", "Fira Code", monospace';
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
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* 1. Underlying high-definition technology visual video loop */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover scale-[1.01] opacity-45 mix-blend-screen"
        style={{ filter: 'brightness(0.7) contrast(1.15) saturate(0.85)' }}
      >
        <source 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_003132_8b7edcb6-c64d-4a52-a9ca-879942e122ad.mp4" 
          type="video/mp4" 
        />
        {/* Fallback pattern */}
        <div className="absolute inset-0 bg-neutral-950" />
      </video>

      {/* 2. Cyber matrix digital tint glasses gradient glassmorphism overlay masking */}
      <div 
        className="absolute inset-0 bg-[#020203]/75 bg-gradient-to-tr from-[#020203] via-transparent to-[#040406]/30" 
        style={{ backdropFilter: 'blur(1.5px)' }}
      />

      {/* 3. Responsive Web interactive local graph mapping canvas component */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ opacity: 0.95 }}
      />
    </div>
  );
}
