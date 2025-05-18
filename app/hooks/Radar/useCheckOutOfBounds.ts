import { useEffect } from 'react';
import { calculateDistance } from '@c/Radar/RadarUtils'

export function useCheckOutOfBounds(
  myPosition: [number, number] | null,
  center: [number, number] | null,
  radiusMeters: number,
  onOutOfBounds: () => void
) {
  useEffect(() => {
    if (!myPosition || !center) return;

    const distance = calculateDistance(
      myPosition[0], 
      myPosition[1], 
      center[0],
      center[1]
    );

    if (distance > radiusMeters) {
      onOutOfBounds();
    }
  }, [myPosition, center, radiusMeters, onOutOfBounds]);
}
