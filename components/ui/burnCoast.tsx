'use client'

import { JSX, useEffect, useMemo, useRef, useState } from 'react';
import { CURRENT_TRACK, TRACKS } from '../../constants';
import { RaceStrategy, Segment, SegmentType } from '@/types/simulationTypes';

function convertSimulationToProgress(simulation: RaceStrategy, trackLength: number): Array<Segment> {
  if (!simulation?.length) return [];

  const segments: Array<Segment> = [];
  let currentStatus = simulation[0].segmentType;
  let segmentStartDist = simulation[0].distance;

  for (let i = 1; i < simulation.length; i++) {
    if (simulation[i].segmentType !== currentStatus) {
      const end = simulation[i].distance;
      segments.push({
        progress_percent: ((end - segmentStartDist) / trackLength) * 100,
        status: currentStatus,
      });
      currentStatus = simulation[i].segmentType;
      segmentStartDist = end;
    }
  }

  const final = simulation[simulation.length - 1].distance;
  segments.push({
    progress_percent: ((final - segmentStartDist) / trackLength) * 100,
    status: currentStatus,
  });

  return segments;
}

export default function BurnCoast({
  simulationOutput,
  currentDistance,
  currentStatus,
  resetTriggered,
}: {
  simulationOutput?: RaceStrategy;
  currentDistance: number;
  currentStatus: SegmentType;
  resetTriggered?: boolean;
}): JSX.Element {

  const trackLength = TRACKS[CURRENT_TRACK].length;

  const simulatedProgress = useMemo(() => {
    return convertSimulationToProgress(simulationOutput ?? [], trackLength);
  }, [simulationOutput, trackLength]);

  const [liveProgress, setLiveProgress] = useState<Array<Array<Segment>>>([
    [{ progress_percent: 0, status: currentStatus }],
  ]);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [currentLap, setCurrentLap] = useState(1);
  const [prevDist, setPrevDist] = useState(0);
  const [offset, setOffset] = useState(0);

  const prevStatusRef = useRef(currentStatus);
  const prevReset = useRef(false);

  useEffect(() => {
    if (resetTriggered && !prevReset.current) {
      setOffset(currentDistance);
      setPrevDist(currentDistance);
      setLiveProgress([[{ progress_percent: 0, status: currentStatus }]]);
      setCurrentSegment(0);
      setCurrentLap(1);
      prevStatusRef.current = currentStatus;
    }

    prevReset.current = !!resetTriggered;
  }, [resetTriggered, currentDistance, currentStatus]);

  useEffect(() => {
    const adjusted = currentDistance - offset;
    const prevAdjusted = prevDist - offset;

    const delta = adjusted - prevAdjusted;
    const progress = (delta / trackLength) * 100;

    const lap = Math.trunc(Math.max(0, adjusted / trackLength)) + 1;

    setLiveProgress(prev => {
      const updated = [...prev];

      if (!updated[lap - 1]) {
        updated.push([{ progress_percent: 0, status: currentStatus }]);
      }

      let segmentIndex = currentSegment;

      if (prevStatusRef.current !== currentStatus) {
        updated[lap - 1].push({ progress_percent: 0, status: currentStatus });
        segmentIndex++;
        prevStatusRef.current = currentStatus;
      }

      updated[lap - 1][segmentIndex].progress_percent += progress;

      setCurrentSegment(segmentIndex);
      setCurrentLap(lap);
      setPrevDist(currentDistance);

      return updated;
    });
  }, [currentDistance, currentStatus]);

  return (
    <div className="flex flex-col gap-2">
      <div className="lap-single">
        {liveProgress[currentLap - 1]?.map((seg, i) => (
          <div
            key={i}
            className={seg.status === SegmentType.COAST ? 'actual-done' : 'actual-burn'}
            style={{ width: `${seg.progress_percent}%` }}
          />
        ))}
      </div>
      <div className="lap-single">
        {simulatedProgress.map((seg, i) => (
          <div
            key={i}
            className={seg.status === SegmentType.COAST ? 'simulated-done' : 'simulated-burn'}
            style={{ width: `${seg.progress_percent}%` }}
          />
        ))}
      </div>
    </div>
  );
}