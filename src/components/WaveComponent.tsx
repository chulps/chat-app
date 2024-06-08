import React, { useEffect } from 'react';
import '../css/wave-component.css';

const WaveComponent: React.FC = () => {

  useEffect(() => {
    const buildWave = (w: number, h: number) => {
      const m = 0.512286623256592433;

      const pathData = [
        "M", 0, h * 0.625, "c",
        0.25 * h * m, 0, 0.25 * h * (1 - m), -0.25 * h, 0.25 * h, -0.25 * h, "s",
        0.25 * h * (1 - m), 0.25 * h, 0.25 * h, 0.25 * h, "s",
        0.25 * h * (1 - m), -0.25 * h, 0.25 * h, -0.25 * h, "s",
        0.25 * h * (1 - m), 0.25 * h, 0.25 * h, 0.25 * h, "s",
        0.25 * h * (1 - m), -0.25 * h, 0.25 * h, -0.25 * h, "s",
        0.25 * h * (1 - m), 0.25 * h, 0.25 * h, 0.25 * h, "s",
        0.25 * h * (1 - m), -0.25 * h, 0.25 * h, -0.25 * h, "s",
        0.25 * h * (1 - m), 0.25 * h, 0.25 * h, 0.25 * h, "s",
        0.25 * h * (1 - m), -0.25 * h, 0.25 * h, -0.25 * h, "s",
        0.25 * h * (1 - m), 0.25 * h, 0.25 * h, 0.25 * h, "s",
        0.25 * h * (1 - m), -0.25 * h, 0.25 * h, -0.25 * h, "s",
        0.25 * h * (1 - m), 0.25 * h, 0.25 * h, 0.25 * h, "s",
        0.25 * h * (1 - m), -0.25 * h, 0.25 * h, -0.25 * h
      ].join(" ");

      const wave = document.querySelector("#wave") as SVGPathElement;
      wave.setAttribute("d", pathData);
    };

    buildWave(90, 60);
  }, []);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="red" overflow="visible" viewBox="0 0 64.039 17" width="64px">
      <g transform="translate(0, -18) scale(0.9)" overflow="visible">
        <path id="wave" fill="none" stroke="var(--white)" strokeWidth="4" strokeLinecap="round"></path>
      </g>
    </svg>
  );
};

export default WaveComponent;
