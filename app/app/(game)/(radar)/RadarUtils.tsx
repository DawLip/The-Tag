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
  