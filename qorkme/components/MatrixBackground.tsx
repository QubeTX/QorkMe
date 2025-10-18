'use client';

import { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  update(): void;
  draw(): void;
}

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number;
    let height: number;
    const dots: Dot[] = [];
    const dotCount = 150;
    const maxDistance = 150;
    const colors = ['#c4724f', '#5f7d58', '#d08a3b']; // Using QorkMe's color palette

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    class DotClass implements Dot {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const initDots = () => {
      dots.length = 0;
      for (let i = 0; i < dotCount; i++) {
        dots.push(new DotClass());
      }
    };

    const drawConnections = () => {
      if (!ctx) return;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(196, 114, 79, ${0.15 * (1 - distance / maxDistance)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    let animationFrameId: number;

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      dots.forEach((dot) => {
        dot.update();
        dot.draw();
      });

      drawConnections();

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initDots();
    animate();

    const handleResize = () => {
      resizeCanvas();
      initDots();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 opacity-40"
      aria-hidden="true"
    />
  );
}
