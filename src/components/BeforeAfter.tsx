'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './BeforeAfter.module.css';

interface BeforeAfterProps {
  beforeImage?: string;
  afterImage?: string;
  title?: string;
}

export default function BeforeAfter({
  beforeImage = '/images/smile_before.png', // fallback image
  afterImage = '/images/smile_after.png', // fallback image
  title = 'Smile Transformation'
}: BeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{title}</h3>
      <div 
        ref={containerRef} 
        className={styles.container}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* After Image (Full width background) */}
        <div 
          className={styles.afterImage} 
          style={{ backgroundImage: `url(${afterImage})` }}
        />

        {/* Before Image (Clipping width based on slider) */}
        <div 
          className={styles.beforeImage} 
          style={{ 
            backgroundImage: `url(${beforeImage})`,
            width: `${sliderPosition}%` 
          }}
        />

        {/* Labels */}
        <span className={`${styles.label} ${styles.labelBefore}`}>Before</span>
        <span className={`${styles.label} ${styles.labelAfter}`}>After</span>

        {/* Divider Slider Handle */}
        <div 
          className={styles.sliderLine} 
          style={{ left: `${sliderPosition}%` }}
        >
          <div className={styles.sliderButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="8 17 3 12 8 7" />
              <polyline points="16 17 21 12 16 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
