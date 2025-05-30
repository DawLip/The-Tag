export const calculateTransparency = (index : number, total : number) => {
    return index === 0
        ? 1
        : 0.9 * (1 - index / (total - 1)) + 0.3 * (index / (total - 1));
  }
  
  export const toRad = (value: number) => (value * Math.PI) / 180;
  
  export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371000;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);
    const a = Math.sin(Δφ / 2) ** 2 +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  export const formatDistanceLabel = (distanceMeters: number): string => {
    if (distanceMeters < 1000) {
      const value = distanceMeters.toFixed(0);
      return `NEAREST:\n${value}\nm`;
    } else {
      const km = distanceMeters / 1000;
      let formatted = km.toFixed(3); 
      let rightFixedPoint = 8 - formatted.length;
      if (rightFixedPoint < 3) {
        if(rightFixedPoint < 0)
        {
            formatted = km.toFixed(0);
        }
        else
        {
            formatted = km.toFixed(rightFixedPoint); 
        }
      }
      return `NEAREST:\n${formatted}\nkm`;
    }
  };
  
  
  export const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const λ1 = toRad(lon1);
    const λ2 = toRad(lon2);
    const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  };
  
  export const interpolateColor = (start: string, end: string, t: number) => {
    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex.replace("#", ''), 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
      };
    };
    const s = hexToRgb(start);
    const e = hexToRgb(end);
    const r = Math.round(s.r + (e.r - s.r) * t);
    const g = Math.round(s.g + (e.g - s.g) * t);
    const b = Math.round(s.b + (e.b - s.b) * t);
    return `rgba(${r},${g},${b},0.4)`;
  };
  

  export const convertPointsToCoordinates = (
    points: number[]
  ): { latitude: number; longitude: number }[] => {
    const coordinates: { latitude: number; longitude: number }[] = [];
    for (let i = 0; i < points.length; i += 2) {
      coordinates.push({
        latitude: points[i],
        longitude: points[i + 1],
      });
    }
    return coordinates;
  };
  
  export function generateCirclePolygon(
    center: { latitude: number; longitude: number },
    radius: number,
    points = 32
  ): { latitude: number; longitude: number }[] {
    const coords: { latitude: number; longitude: number }[] = [];
    const earthRadius = 6371000; // in meters
  
    for (let i = 0; i < points; i++) {
      const angle = (i * 2 * Math.PI) / points;
      const dx = radius * Math.cos(angle);
      const dy = radius * Math.sin(angle);
  
      const deltaLat = dy / earthRadius;
      const deltaLon = dx / (earthRadius * Math.cos((Math.PI * center.latitude) / 180));
  
      const lat = center.latitude + (deltaLat * 180) / Math.PI;
      const lon = center.longitude + (deltaLon * 180) / Math.PI;
  
      coords.push({ latitude: lat, longitude: lon });
    }
  
    return coords;
  }
  
 export function calculateOffsetPosition(origin: [number, number], distanceMeters: number, bearingDegrees: number): [number, number] {
  const R = 6378137;
  const d = distanceMeters;

  const lat = origin[0] * Math.PI / 180;
  const lon = origin[1] * Math.PI / 180;
  const bearing = bearingDegrees * Math.PI / 180;

  const newLat = Math.asin(Math.sin(lat) * Math.cos(d / R) + Math.cos(lat) * Math.sin(d / R) * Math.cos(bearing));
  const newLon = lon + Math.atan2(
    Math.sin(bearing) * Math.sin(d / R) * Math.cos(lat),
    Math.cos(d / R) - Math.sin(lat) * Math.sin(newLat)
  );

  return [newLat * 180 / Math.PI, newLon * 180 / Math.PI];
}