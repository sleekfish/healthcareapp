import { useEffect, useRef } from 'react';

export function DNABackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // DNA strand parameters
    const strands = 3;
    const amplitude = 80;
    const frequency = 0.01;
    let offset = 0;

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw multiple DNA strands
      for (let s = 0; s < strands; s++) {
        const strandOffset = (s * canvas.width) / strands;

        // Draw connecting lines
        for (let i = 0; i < canvas.height; i += 20) {
          const x1 =
            strandOffset +
            Math.sin((i + offset) * frequency) * amplitude +
            canvas.width / (strands * 2);
          const x2 =
            strandOffset +
            Math.cos((i + offset) * frequency) * amplitude +
            canvas.width / (strands * 2);
          const y = i;

          // Gradient for glow effect
          const gradient = ctx.createRadialGradient(x1, y, 0, x1, y, 30);
          gradient.addColorStop(0, 'rgba(0, 255, 136, 0.3)');
          gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.stroke();

          // Draw nodes
          ctx.fillStyle = '#00ff88';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00ff88';
          ctx.beginPath();
          ctx.arc(x1, y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x2, y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Draw spiral strands
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < canvas.height; i += 2) {
          const x =
            strandOffset +
            Math.sin((i + offset) * frequency) * amplitude +
            canvas.width / (strands * 2);
          const y = i;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        ctx.beginPath();
        for (let i = 0; i < canvas.height; i += 2) {
          const x =
            strandOffset +
            Math.cos((i + offset) * frequency) * amplitude +
            canvas.width / (strands * 2);
          const y = i;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      offset += 0.5;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-30 z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
