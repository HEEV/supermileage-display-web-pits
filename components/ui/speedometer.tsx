'use client'

import { JSX, useEffect, useState } from 'react';

export default function Speedometer(props: {
  value: number;
  min: number;
  max: number;
  unit: string;
  animate?: boolean;
  coastCountdownTime?: number;
  burnCountdownTime?: number;
}): JSX.Element {

  const defaultSegmentsL = {
    l0: '--color-gray', l1: '--color-gray', l2: '--color-gray', l3: '--color-gray', l4: '--color-gray',
    l5: '--color-gray', l6: '--color-gray', l7: '--color-gray', l8: '--color-gray', l9: '--color-gray',
  };

  const defaultSegmentsR = {
    r0: '--color-gray', r1: '--color-gray', r2: '--color-gray', r3: '--color-gray', r4: '--color-gray',
    r5: '--color-gray', r6: '--color-gray', r7: '--color-gray', r8: '--color-gray', r9: '--color-gray',
  };

  const [lSegments , setLSegments] = useState(defaultSegmentsL);
  const [rSegments , setRSegments] = useState(defaultSegmentsR);
  const [isAnimating, setIsAnimating] = useState(false);
  const [burn, setBurn] = useState<boolean | undefined>(undefined);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    if (props.animate) {
      animateSegments();
    }
  }, [props.animate]);

  const animateSegments = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const burnSegmentTime = (props.burnCountdownTime || 4500) / 9;
    const coastSegmentTime = (props.coastCountdownTime || 4500) / 9;

    // Burn countdown
    for (let i = 9; i >= 0; i--) {
      setLSegments(prev => ({ ...prev, [`l${i}`]: '--color-green-highlight' }));
      setRSegments(prev => ({ ...prev, [`r${i}`]: '--color-green-highlight' }));
      await sleep(burnSegmentTime);
    }

    setBurn(true);
    await sleep(5000);
    setBurn(undefined);

    // Coast countdown
    for (let i = 0; i <= 9; i++) {
      setLSegments(prev => ({ ...prev, [`l${i}`]: '--color-alert' }));
      setRSegments(prev => ({ ...prev, [`r${i}`]: '--color-alert' }));
      await sleep(coastSegmentTime);
    }

    setBurn(false);
    await sleep(5000);

    setLSegments(defaultSegmentsL);
    setRSegments(defaultSegmentsR);
    setBurn(undefined);
    setIsAnimating(false);
  };

  const ringStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    position: 'relative',
    background: `conic-gradient(
      from 0deg,
      transparent 0deg 45deg,
      ${`var(${rSegments.r0})`} 45deg 50deg,
      transparent 50deg 54deg,
      ${`var(${rSegments.r1})`} 54deg 59deg,
      transparent 59deg 63deg,
      ${`var(${rSegments.r2})`} 63deg 68deg,
      transparent 68deg 72deg,
      ${`var(${rSegments.r3})`} 72deg 77deg,
      transparent 77deg 81deg,
      ${`var(${rSegments.r4})`} 81deg 86deg,
      transparent 86deg 90deg,
      ${`var(${rSegments.r5})`} 90deg 95deg,
      transparent 95deg 99deg,
      ${`var(${rSegments.r6})`} 99deg 104deg,
      transparent 104deg 108deg,
      ${`var(${rSegments.r7})`} 108deg 113deg,
      transparent 113deg 117deg,
      ${`var(${rSegments.r8})`} 117deg 122deg,
      transparent 122deg 126deg,
      ${`var(${rSegments.r9})`} 126deg 131deg,
      transparent 131deg 225deg,
      ${`var(${lSegments.l9})`} 225deg 230deg,
      transparent 230deg 234deg,
      ${`var(${lSegments.l8})`} 234deg 239deg,
      transparent 239deg 243deg,
      ${`var(${lSegments.l7})`} 243deg 248deg,
      transparent 248deg 252deg,
      ${`var(${lSegments.l6})`} 252deg 257deg,
      transparent 257deg 261deg,
      ${`var(${lSegments.l5})`} 261deg 266deg,
      transparent 266deg 270deg,
      ${`var(${lSegments.l4})`} 270deg 275deg,
      transparent 275deg 279deg,
      ${`var(${lSegments.l3})`} 279deg 284deg,
      transparent 284deg 288deg,
      ${`var(${lSegments.l2})`} 288deg 293deg,
      transparent 293deg 297deg,
      ${`var(${lSegments.l1})`} 297deg 302deg,
      transparent 302deg 306deg,
      ${`var(${lSegments.l0})`} 306deg 311deg,
      transparent 311deg 360deg
    )`,
  } as React.CSSProperties;

  const burnRingStyle = {
    ...ringStyle,
    background: 'var(--color-green-highlight)',
  };

  const coastRingStyle = {
    ...ringStyle,
    background: 'var(--color-alert)',
  };

  return (
    <div className="relative grid place-items-center w-[450px] h-[450px]">

      {/* Ring */}
      <div
        style={
          burn === undefined
            ? ringStyle
            : burn
            ? burnRingStyle
            : coastRingStyle
        }
      />
      <div className="absolute w-[80%] h-[80%] rounded-full bg-black z-10" />

      {/* Center */}
      <div className="absolute grid place-items-center text-center z-10">

        <div className="text-[14em] font-bold leading-none text-[var(--color-text)]">
          {Math.round(props.value)}
        </div>

        <div className="mt-[-0.5em] text-[1.5em] tracking-[2px] text-[var(--color-text)]">
          {props.unit}
        </div>

        {burn !== undefined && (
          <div
            className={`absolute translate-y-[-120px] text-[2.5em] font-bold ${
              burn
                ? 'text-[var(--color-green-highlight)]'
                : 'text-[var(--color-alert)]'
            }`}
          >
            {burn ? 'ENGINE ON' : 'ENGINE OFF'}
          </div>
        )}

      </div>
    </div>
  );
}