import React, { useRef, useEffect, useState } from "react";

const VerticalMarquee = ({ text, speed }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const posRef = useRef(0);
  const rafRef = useRef(null);

  const items = Array(20).fill(text);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const halfHeight = track.scrollHeight / 2;
    posRef.current = -halfHeight;

    const animate = () => {
      posRef.current += speed * 0.5;

      if (posRef.current >= 0) {
        posRef.current = -halfHeight;
      }

      track.style.transform = `translateY(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed]);

  return (
    <div className="vertical-marquee-container" ref={containerRef}>
      <div className="marquee-track" ref={trackRef}>
        {items.map((item, index) => (
          <div key={index} className="marquee-item">{item}</div>
        ))}
        {items.map((item, index) => (
          <div key={`dup-${index}`} className="marquee-item">{item}</div>
        ))}
      </div>
    </div>
  );
};


export default VerticalMarquee;