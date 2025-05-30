import React, { JSX, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polygon as MapPolygon, Circle as MapCircle } from 'react-native-maps';
import Svg, { Circle, Polygon, Line, G } from 'react-native-svg';
import * as Location from 'expo-location';

import {
  toRad,
  calculateDistance,
  calculateBearing,
  calculateTransparency,
  interpolateColor,
  formatDistanceLabel,
  generateCirclePolygon
} from './RadarUtils';

import RadarHoldButton from '@/components/Radar/RadarHoldButton';

const { width } = Dimensions.get('window');
const RADAR_SIZE = width * 0.9;
const RADAR_RADIUS = RADAR_SIZE / 2;
const MAX_DISTANCE = 600;

interface Player {
  latitude: number;
  longitude: number;
  type: number;
  invisible?:boolean;
}

interface Border {
  points: number[];
  radius: number;
  color: string;
}

interface Effector {
  latitude: number;
  longitude: number;
  radius: number;
  StartTime: number;
  time: number;
  startColor: string;
  endColor: string;
  type: string;
}

interface RadarMapProps {
  playerHP: number;
  playerType: number;
  maxZoomRadius: number;
  players: Player[];
  border?: Border;
  effectors?: Effector[];
  onPositionUpdate?: (lat: number, lon: number) => void;
  onHeadingUpdate?: (heading: number) => void;
}

export const RadarMap: React.FC<RadarMapProps> = ({ playerHP, maxZoomRadius, players, border, effectors, playerType, onPositionUpdate,onHeadingUpdate }) => {
  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [smoothHeading, setSmoothHeading] = useState(0);
  const [nearestDistance, setNearestDistance] = useState<number | null>(null);
  const [outOfRangeData, setOutOfRangeData] = useState<{ bearing: number; distance: number; player: Player }[]>([]);
  const [timeNow, setTimeNow] = useState(Date.now());
  const [zoomOut, setZoomOut] = useState(false);

  const lastHeading = useRef(0);
  const mapRef = useRef<MapView>(null);

  const calculateZoom = (latitude: number): number => {
    const metersPerPixel = (zoomOut ? maxZoomRadius : MAX_DISTANCE) / RADAR_RADIUS;
    const zoom = Math.log2(156543.03392 * Math.cos(latitude * Math.PI / 180) / metersPerPixel);
    return zoom;
  };

  useEffect(() => {
    const interval = setInterval(() => setTimeNow(Date.now()), 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 4 },
        (location) => {
          const coords = location.coords;
          setUserLocation(coords);
          onPositionUpdate?.(coords.latitude, coords.longitude);
          
        }
      );

      const alpha = 0.15;
      await Location.watchHeadingAsync((data) => {
        if (data.trueHeading != null) {
          const newHeading = data.trueHeading;
          const delta = ((newHeading - lastHeading.current + 540) % 360) - 180;
          lastHeading.current = (lastHeading.current + alpha * delta + 360) % 360;
          setSmoothHeading(lastHeading.current);
          onHeadingUpdate?.(lastHeading.current);

        }
      });
    })();
  }, []);

  useEffect(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.animateCamera({
        center: { latitude: userLocation.latitude, longitude: userLocation.longitude },
        heading: smoothHeading,
        pitch: 0,
        zoom: calculateZoom(userLocation.latitude)
      }, { duration: 200 });
    }
  }, [smoothHeading, userLocation, zoomOut]);

  const isPlayerVisible = (player: Player, currentPlayerType: number): boolean => {
    if (player.invisible) return false;
    if (currentPlayerType === 0) return true;
    if (currentPlayerType === 1) return player.type !== 0;
    return player.type !== 1;
  };

  const getPlayerColor = (player: Player, currentPlayerType: number): string => {
    const HiderColor = 'rgb(252, 172, 0)';
    const SeekerColor = 'rgb(252, 80, 0)';
    const Invisible = 'rgba(0, 0, 0, 0)';
    if (!isPlayerVisible(player, currentPlayerType)) return Invisible;
    return player.type === 1 ? SeekerColor : HiderColor;
  };

  useEffect(() => {
    if (userLocation && players.length > 0) {
      const newOutOfRange: { player: Player; distance: number; bearing: number }[] = [];

      const visiblePlayers = players.filter(player => isPlayerVisible(player, playerType));

      const allDistances = visiblePlayers.map((player) => {
        const distance = calculateDistance(userLocation.latitude, userLocation.longitude, player.latitude, player.longitude);
        const bearing = calculateBearing(userLocation.latitude, userLocation.longitude, player.latitude, player.longitude);
        if (distance > MAX_DISTANCE) newOutOfRange.push({ player, distance, bearing });
        return distance;
      });

      setNearestDistance(allDistances.length > 0 ? Math.min(...allDistances) : null);
      newOutOfRange.sort((a, b) => a.distance - b.distance);
      setOutOfRangeData(newOutOfRange);
    }
  }, [userLocation, players, playerType]);

  const renderPlayerMarkers = () => {
    return players.map((player, i) => {
      const distance = userLocation ? calculateDistance(userLocation.latitude, userLocation.longitude, player.latitude, player.longitude) : 0;
      if (distance <= MAX_DISTANCE) {
        return (
          <Marker key={`player-${i}`} coordinate={{ latitude: player.latitude, longitude: player.longitude }} anchor={{ x: 0.25, y: 0.25 }} flat={true}>
            <Svg height={20} width={20}><Circle cx={10} cy={10} r={3} fill={getPlayerColor(player, playerType)} /></Svg>
          </Marker>
        );
      }
      return null;
    });
  };

  const renderBoarders = () => {
    if (!border) return null;

    const delta = border.radius / 36000 + 0.001;

    const worldBounds = [
      { latitude: border.points[0] + delta, longitude: border.points[1] - delta },
      { latitude: border.points[0] + delta, longitude: border.points[1] + delta },
      { latitude: border.points[0] - delta, longitude: border.points[1] + delta },
      { latitude: border.points[0] - delta, longitude: border.points[1] - delta },
    ];
    const coordinates = generateCirclePolygon({ latitude: border.points[0], longitude: border.points[1] }, border.radius, 64);
    return (
      <MapPolygon
        key={`polygon-border`}
        coordinates={worldBounds}
        holes={[coordinates]}
        fillColor={`${border.color}40`}
        strokeColor={border.color}
        strokeWidth={1}
      />
    );
  };

const renderEffectors = () => {
  if (!effectors) return null;

  //wyłączenie obszarów inviz dla szukających
  return effectors
    .filter(eff => {
      const isVisibleByTime = timeNow - eff.StartTime < eff.time;
      const isVisibleToPlayer = !(playerType === 1 && eff.type === 'Inviz');
      return isVisibleByTime && isVisibleToPlayer;
    })
    .map((eff, index) => {
      const elapsed = timeNow - eff.StartTime;
      const t = elapsed / eff.time;

      const animatedColor = interpolateColor(eff.startColor, eff.endColor, t);

      return (
        <MapCircle
          key={`effector-${index}`}
          center={{ latitude: eff.latitude, longitude: eff.longitude }}
          radius={eff.radius}
          strokeColor={animatedColor}
          fillColor={animatedColor}
        />
      );
    });
};


  const renderRadarOverlay = () => {
    return (
      <Svg height={RADAR_SIZE} width={RADAR_SIZE} style={StyleSheet.absoluteFill}>
        <G transform={`rotate(${-smoothHeading}, ${RADAR_RADIUS}, ${RADAR_RADIUS})`}>
          <Line x1={RADAR_RADIUS} y1={10} x2={RADAR_RADIUS} y2={0} stroke="red" strokeWidth={2} />
          {!zoomOut &&
            outOfRangeData.map(({ bearing, player }, index) => {
              const angleRad = toRad(bearing);
              const x = RADAR_RADIUS + RADAR_RADIUS * Math.sin(angleRad);
              const y = RADAR_RADIUS - RADAR_RADIUS * Math.cos(angleRad);
              const transparency = calculateTransparency(index, outOfRangeData.length);
              const size = 20;
              const vx = (x - RADAR_RADIUS) / RADAR_RADIUS;
              const vy = (y - RADAR_RADIUS) / RADAR_RADIUS;
              const xShifted = x - vx * (size / 2);
              const yShifted = y - vy * (size / 2);
              const dx = RADAR_RADIUS - xShifted;
              const dy = RADAR_RADIUS - yShifted;
              const angleToCenter = (Math.atan2(dy, dx) * 180) / Math.PI + 270;
              const points = `0,${-size / 2} ${-size / 5},${size / 5} ${size / 5},${size / 5}`;
              return (
                <Polygon
                  key={`${player.latitude}-${player.longitude}-triangle`}
                  points={points}
                  fill={getPlayerColor(player, playerType)}
                  fillOpacity={transparency}
                  transform={`translate(${xShifted}, ${yShifted}) rotate(${angleToCenter})`}
                />
              );
            })}
        </G>
        <Polygon
          points={`
            ${RADAR_RADIUS},${RADAR_RADIUS - 8}
            ${RADAR_RADIUS - 3},${RADAR_RADIUS + 3}
            ${RADAR_RADIUS + 3},${RADAR_RADIUS + 3}
          `}
          fill="#cccccc88"
          stroke="none"
        />
      </Svg>
    );
  };

  if (!userLocation) return <View style={styles.mapContainer} />;

  const formattedDistance = nearestDistance != null ? formatDistanceLabel(nearestDistance) : ' ... ';

  return (
    <View style={styles.container}>
      <View style={styles.distanceBox}>
        <Text style={styles.distanceText}>{formattedDistance}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>{playerType === 1 ? 'Seeker' : playerType === 2 ? 'Runner' : 'Spectator'}</Text>
        <View style={{ width: 43 }}>
          {playerType !== 0 && (
            <Text style={styles.infoText}>HP: {playerHP}</Text>
          )}
        </View>
      </View>

      <View style={styles.mapShadow}>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            showsUserLocation={false}
            rotateEnabled
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            toolbarEnabled={false}
            customMapStyle={darkMapStyle}
          >
            {renderPlayerMarkers()}
            {renderBoarders()}
            {renderEffectors()}
          </MapView>
          {renderRadarOverlay()}
        </View>
      </View>

      <View style={styles.zoomOutBox}>
        <RadarHoldButton onZoomChange={setZoomOut} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: RADAR_SIZE + 4,
    height: RADAR_SIZE + 4,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  mapContainer: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    borderRadius: RADAR_RADIUS,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  mapShadow: {
    borderRadius: RADAR_RADIUS,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RADAR_RADIUS,
  },
  distanceBox: {
    position: 'absolute',
    top: 5,
    left: 0,
    zIndex: 10,
  },
  infoBox: {
    position: 'absolute',
    alignItems: 'flex-end',
    top: 5,
    right: 0,
    zIndex: 10,
  },
  infoText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Aboreto',
  },
  zoomOutBox: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    zIndex: 10,
  },
  distanceText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Aboreto',
  },
});

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'all',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

export default RadarMap;
