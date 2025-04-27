import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, G, Polygon } from 'react-native-svg';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');
const RADAR_SIZE = width * 0.8;
const RADAR_RADIUS = RADAR_SIZE / 2;
const MAX_DISTANCE = 600; // metry

interface Player {
  latitude: number;
  longitude: number;
}

interface RadarScreenProps {
  players: Player[];
}

export const RadarScreen: React.FC<RadarScreenProps> = ({ players }) => {
  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [heading, setHeading] = useState(0);
  const [smoothHeading, setSmoothHeading] = useState(0);

  let lastHeading = 0;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 1 },
        (location) => {
          setUserLocation(location.coords);
        }
      );

      const alpha = 0.3;

      Location.watchHeadingAsync((data) => {
        if (data.trueHeading != null) {
          const newHeading = data.trueHeading;
          lastHeading = lastHeading * (1 - alpha) + newHeading * alpha;
          setSmoothHeading(lastHeading);
        }
      });
    })();
  }, []);

  if (!userLocation) {
    return <View style={styles.container} />;
  }

  const toRad = (value: number) => (value * Math.PI) / 180;

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371000; // metry
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a = Math.sin(Δφ / 2) ** 2 +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const λ1 = toRad(lon1);
    const λ2 = toRad(lon2);
    const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  };



  const renderPlayers = () => {
    return players.map((player, index) => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        player.latitude,
        player.longitude
      );

      const bearing = calculateBearing(
        userLocation.latitude,
        userLocation.longitude,
        player.latitude,
        player.longitude
      );

      
      const angleRad = toRad(bearing);

      const clampedDistance = Math.min(distance, MAX_DISTANCE);
      const r = (clampedDistance / MAX_DISTANCE) * RADAR_RADIUS;

      const x = RADAR_RADIUS + r * Math.sin(angleRad);
      const y = RADAR_RADIUS - r * Math.cos(angleRad);

      if (distance <= MAX_DISTANCE) {
        return (
          <Circle
            key={index}
            cx={x}
            cy={y}
            r={5}
            fill="orange"
          />
        );
      } else {
        const size = 10;
        const cx = x;
        const cy = y + size / 6; 
      
        return (
          <Polygon
            key={index}
            points={`
              ${x},${y - size}
              ${x - size / 2},${y + size / 2}
              ${x + size / 2},${y + size / 2}
            `}
            fill="orange"
            transform={`rotate(${bearing}, ${cx}, ${cy})`}
          />
        );
      }
    });
  };

  return (
    <View style={styles.container}>
      <Svg width={RADAR_SIZE} height={RADAR_SIZE}>
        <G rotation={-smoothHeading} originX={RADAR_RADIUS} originY={RADAR_RADIUS}>
          <Circle
            cx={RADAR_RADIUS}
            cy={RADAR_RADIUS}
            r={RADAR_RADIUS}
            stroke="gray"
            strokeWidth={2}
            fill="black"
          />
          <Line
            x1={RADAR_RADIUS}
            y1={8}
            x2={RADAR_RADIUS}
            y2={0}
            stroke="red"
            strokeWidth={2}
          />  
          {renderPlayers()}
        </G>

        return (
  <View style={styles.container}>
    <Svg width={RADAR_SIZE} height={RADAR_SIZE}>
      <G rotation={-smoothHeading} originX={RADAR_RADIUS} originY={RADAR_RADIUS}>
        <Circle
          cx={RADAR_RADIUS}
          cy={RADAR_RADIUS}
          r={RADAR_RADIUS}
          stroke="gray"
          strokeWidth={2}
          fill="black"
        />
        <Line
          x1={RADAR_RADIUS}
          y1={8}
          x2={RADAR_RADIUS}
          y2={0}
          stroke="red"
          strokeWidth={2}
        />
        {renderPlayers()}
      </G>
      <Polygon
        points={`
          ${RADAR_RADIUS},${RADAR_RADIUS - 10}
          ${RADAR_RADIUS - 5},${RADAR_RADIUS + 5}
          ${RADAR_RADIUS + 5},${RADAR_RADIUS + 5}
        `}
        fill="#ccc"
        stroke="none"
      />
    </Svg>
  </View>
);
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    alignSelf: 'center',
    marginTop: 20,
  },
});
