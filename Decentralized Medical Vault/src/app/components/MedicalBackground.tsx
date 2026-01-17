import { useEffect, useRef } from 'react';

export function MedicalBackground() {
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

    // Medical pattern parameters
    let offset = 0;

    // Draw subtle medical cross patterns
    const drawMedicalCross = (x: number, y: number, size: number, opacity: number) => {
      ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x, y + size);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(x - size, y);
      ctx.lineTo(x + size, y);
      ctx.stroke();
    };

    // Draw heartbeat line pattern
    const drawHeartbeatLine = (startX: number, startY: number, width: number, opacity: number) => {
      ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();

      const segments = 50;
      const segmentWidth = width / segments;

      for (let i = 0; i <= segments; i++) {
        const x = startX + i * segmentWidth;
        let y = startY;

        // Create heartbeat pattern
        if (i % 10 === 0) {
          y = startY - 20;
        } else if (i % 10 === 1) {
          y = startY + 15;
        } else if (i % 10 === 2) {
          y = startY - 10;
        }

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    };

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid of subtle medical crosses
      const spacing = 150;
      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          const pulseOpacity = 0.03 + Math.sin((offset + x + y) * 0.005) * 0.02;
          drawMedicalCross(x + 75, y + 75, 8, pulseOpacity);
        }
      }

      // Draw moving heartbeat lines
      const heartbeatSpacing = 200;
      for (let y = 0; y < canvas.height; y += heartbeatSpacing) {
        const xOffset = ((offset * 2) % canvas.width) - canvas.width;
        drawHeartbeatLine(xOffset, y + 100, canvas.width * 2, 0.04);
      }

      // Draw floating particles (representing molecules/cells)
      ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
      for (let i = 0; i < 30; i++) {
        const x = (i * 100 + offset * 0.3) % canvas.width;
        const y = (i * 67 + Math.sin(offset * 0.01 + i) * 50) % canvas.height;
        const size = 2 + Math.sin(offset * 0.02 + i) * 1;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect to some particles
        if (i % 3 === 0) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(16, 185, 129, 0.3)';
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
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
      className="fixed inset-0 pointer-events-none opacity-100 z-0"
    />
  );
}
