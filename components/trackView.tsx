import { Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

export default function TrackView(props: {trackName: string, distanceTraveled: number, scale: number}) {
    
  const tracks = {
    ShellTrackFixed: {shape: 'm226.99,419.04l0,-14.96l-0.45,-26.31l0,-7.7l-0.46,-17.24l0,-0.9l0,-14.52l-0.45,-12.69l0,-3.63l0,-19.5l-0.45,-27.21l-0.46,-20.86l0,-21.77l-0.45,-2.27l0,-14.06l0,-18.59l-0.45,-5.9l-0.46,-2.26l-0.45,-3.18l-0.45,-25.85l-0.46,-3.17l0,-21.32l0,-0.45l0.46,-15.87l0.45,-18.14l10.88,-0.46l15.42,0l4.08,-0.45l3.63,-0.45l2.72,-0.46l2.72,-1.36l0.46,0l2.26,-1.36l2.27,-1.81l1.82,-1.36l1.36,-1.36l1.81,-2.72l0.91,-2.27l0.45,-2.27l0,-4.53l0,-3.63l-2.27,-17.69l0.91,-1.81l0.45,-1.36l0.91,-3.63l1.36,-3.63l0.91,-2.72l1.36,-3.63l2.27,-3.17l1.81,-2.72l1.36,-1.82l2.72,-2.72l3.18,-3.17l2.72,-2.27l2.72,-1.81l3.17,-2.27l3.18,-1.81l3.17,-1.37l4.08,-1.81l2.72,-0.91l7.26,-2.72l15.87,-5.89l4.08,-1.36l1.82,-0.46l2.27,-0.45l1.81,0l1.81,0l3.63,0.45l3.63,1.36l4.08,1.36l2.27,1.36l1.81,1.37l2.27,1.36l1.36,1.36l2.72,2.26l1.82,2.27l1.81,2.27l1.36,3.63l1.36,3.17l0.45,4.08l0.46,37.19l0,6.8l0,1.36l-0.46,1.36l-0.45,1.82l-0.45,1.36l-0.46,1.36l-1.81,2.72l12.24,4.99l3.18,1.81l3.17,2.27l2.72,2.27l2.72,3.17l0.91,0.45l3.63,4.09l0.91,34.92l0.9,52.15l0,4.53l0.46,16.78l0,15.87l1.36,40.82l0,0.91l0.9,78l0,2.72l0.46,33.1l-0.46,16.33l3.18,3.63l2.27,1.81l2.26,1.82l4.54,2.26l3.63,1.36l4.53,0.91l3.18,0.45l4.08,0.46l15.42,-0.91l14.06,0l2.26,0l1.82,0l3.62,0.91l4.09,1.36l4.53,1.81l2.72,1.82l2.27,1.81l2.72,2.72l1.36,1.82l1.36,2.26l0.91,2.72l0.91,2.27l1.81,3.18l1.81,1.81l2.72,2.27l2.27,1.81l2.72,1.36l3.18,1.36l3.17,0.91l3.63,0.45l3.63,0l0.91,0l37.18,-2.27l3.63,0l2.72,0l1.36,0l2.72,0.91l2.27,1.36l1.36,0.91l1.36,1.36l1.36,1.36l1.82,3.17l1.81,3.63l2.27,4.99l0.9,4.08l1.36,5.44l0.46,5.9l-0.46,6.8l-0.9,4.54l-1.82,8.61l-1.36,6.81l-1.81,9.07l-1.36,7.71l-1.82,9.97l-2.72,10.89l-0.45,2.26l-0.45,0.91l-1.36,3.63l-1.82,4.08l-0.45,0l-2.27,4.08l-6.35,9.07l-5.89,7.71l-0.46,0.46l-6.8,3.62l-8.62,4.99l-4.98,2.27l-5.45,2.27l-2.26,0.9l-4.09,1.36l-4.53,1.36l-6.35,1.37l-5.44,0.9l-0.45,0l-8.17,1.36l-9.52,0.91l-6.35,0.45l-17.69,0l-31.74,0.46l-21.32,0l-4.08,0l-4.53,0.45l-5.9,-0.45l-4.99,-0.46l-3.62,0l0.45,-16.32l0.45,-22.22l0.91,-3.63l0.45,-1.36l0,-1.36l0,-0.91l0,-1.36l-0.9,-2.72l-0.91,-1.82l-0.91,-1.81l-0.9,-1.36l-1.37,-1.36l-1.36,-1.81l-1.81,-1.37l-1.81,-2.26l-1.82,-0.91l-17.68,5.44l-33.56,10.43l-4.99,1.36l-5.9,0.91l-4.53,0.45l-4.54,0.46l-4.99,-0.46l-4.98,-0.45l-6.81,-0.91l-2.72,-0.45l-3.17,-0.91l-4.54,-1.36l-2.26,-0.9l-1.36,-0.46l-4.09,-2.27l-4.53,-2.26l-4.54,-2.72l-2.26,-2.27l-2.27,-1.82l-3.18,-2.72l-3.17,-4.53l-2.72,-3.63l-0.45,-0.45l-1.82,-2.72l-2.27,-4.99l-2.72,-5.44l-5.44,-12.25l0,-6.8l0,-1.36l-0.45,-27.67l0,-0.9l-0.46,-27.21l-0.45,-13.61z',
      length: 2.39072566 * 5280},
    EnduranceFixed: {shape: 'm473.44003,262.68008l19.03,16.58l49.83,43.63l29.04,6.29l59.15,31.63l10.62,12.66l19.82,23.29l27.2,32.09l19.28,39.87l82.12,68.68l75.4,-44.41l6.07,-14.74l-9.27,-9.16l-23.01,-20.31l-29.91,-21.66l-11.91,-3.69l-39,-16.68l-19.51,-13l-13,-15.6l-11.05,-18.42l-5.85,-14.08l-11.91,-16.47l-15.17,-11.49l-38.14,-22.1l-26.93,-21.21l-26.82,-21.73l-45.48,-36.36l-27.95,-10.4l-24.92,-11.7l-17.55,-15.17l-32.81,-35.12l-18.31,-18.27l-38.63,-38.35l-28.71,-27.56l-48.51,-46.17l-54.69,-51.85l-17.77,-9.1l-33.15,13l-89.92,49.4l-30.12,20.58l30.44,24.25l45.48,36.21l41.32,33.13l34.09,27.3l14.64,13.45l45.72,-20.15l29.04,17.55l58.93,14.3l92.78,81.06z', 
      length: 1 * 5280}
  };

  const trackTransition = {duration: 0.5, yoyo: Infinity};
  const pathRef = useRef<SVGPathElement>(null);
  const trackLength = tracks[props.trackName as keyof typeof tracks].length;
  const progress = props.distanceTraveled % trackLength / trackLength;
  
  // Calculate the position of the arrow based on progress
  const [arrowX, setArrowX] = useState(0);
  const [arrowY, setArrowY] = useState(0);
  const [arrowAngle, setArrowAngle] = useState(0);
  
  // Update arrow position when progress changes
  useEffect(() => {
    if (!pathRef.current) return;
    
    // Get the point at the specified progress along the path
    const path = pathRef.current;
    const pathLength = path.getTotalLength();
    const point = path.getPointAtLength(pathLength * progress);
    
    // Set the arrow position
    setArrowX(point.x);
    setArrowY(point.y);
    
    // Calculate the angle for rotation (tangent to the path)
    // We need to look a bit ahead on the path to get the direction
    const lookAhead = 0.01;
    const aheadPoint = path.getPointAtLength(
      Math.min(pathLength * (progress + lookAhead), pathLength)
    );
    const angle = Math.atan2(
      aheadPoint.y - point.y, 
      aheadPoint.x - point.x
    ) * (180 / Math.PI);
    
    setArrowAngle(angle);
  }, [progress]);

  return (
    <div>
      <svg id='map' viewBox="0 0 710 485" width={props.scale + '%'} height={props.scale + '%'} xmlns="http://www.w3.org/2000/svg" baseProfile="tiny" version="1.1">
        <g transform="rotate(90, 400, 300)">
          <title>Layer 1</title>
          
          {/* Reference path (invisible) */}
          <path
            ref={pathRef}
            d={tracks[props.trackName as keyof typeof tracks].shape}
            fill="none"
            stroke="none"
            style={{ visibility: 'hidden' }}
          />
          
          {/* Visible track */}
          <motion.path 
            id="svg_3" 
            d={tracks[props.trackName as keyof typeof tracks].shape}
            fill="lightgray"
            strokeWidth="12"
            stroke="Gold"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={trackTransition}
          />

          {/* Arrow marker */}
          <polygon
            points="-22,-15 22,0 -22,15"
            fill="red"
            transform={`translate(${arrowX}, ${arrowY}) rotate(${arrowAngle})`}
          />
        </g>
      </svg>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', left: '5em', bottom: '4.5em', position: 'relative'}}>
        <Typography sx={{ margin: 0, marginTop: '-0.5em', fontSize: '2em' }}>Lap</Typography>
        <Typography sx={{ margin: 0, marginTop: '-0.5em', fontSize: '2em', fontWeight: 'bold' }}>{props.distanceTraveled < trackLength ? 1 : Math.trunc(props.distanceTraveled/trackLength + 1)}</Typography>
      </div>
    </div>
  );
}