import { useEffect, useRef } from 'react';

export function DnaBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const drawDNA = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const amplitude = 100;
      const frequency = 0.02;
      const points = 200;

      ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
      ctx.lineWidth = 2;

      // Draw DNA double helix
      for (let strand = 0; strand < 2; strand++) {
        ctx.beginPath();
        
        for (let i = 0; i < points; i++) {
          const y = (i / points) * canvas.height;
          const angle = i * frequency + rotation + (strand * Math.PI);
          const x = centerX + Math.sin(angle) * amplitude;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          // Draw base pairs
          if (i % 10 === 0) {
            const oppositeAngle = i * frequency + rotation + ((1 - strand) * Math.PI);
            const oppositeX = centerX + Math.sin(oppositeAngle) * amplitude;
            
            ctx.save();
            ctx.strokeStyle = 'rgba(0, 255, 136, 0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(oppositeX, y);
            ctx.stroke();
            ctx.restore();

            // Draw nodes
            ctx.save();
            ctx.fillStyle = 'rgba(0, 255, 136, 0.4)';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        ctx.stroke();
      }

      rotation += 0.01;
      animationFrameId = requestAnimationFrame(drawDNA);
    };

    drawDNA();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-20 z-0"
    />
  );
}
