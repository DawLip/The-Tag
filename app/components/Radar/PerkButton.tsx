import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type AbilitiesButtonProps = {
  icon: React.ReactNode;
  usesLeft: number;
  activeDuration: number;
  cooldownDuration: number;
  onUse?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const STROKE_WIDTH = 4;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const PerkButton: React.FC<AbilitiesButtonProps> = ({
  icon,
  usesLeft,
  activeDuration,
  cooldownDuration,
  onUse,
  style,
  textStyle,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const [buttonSize, setButtonSize] = useState({ width: 0, height: 0 });

  const radius = Math.min(buttonSize.width, buttonSize.height) / 2 - STROKE_WIDTH + 1;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (isActive) {
      borderAnim.setValue(0);
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: activeDuration,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => {
        setIsActive(false);
        setIsCooldown(true);
      });
    }
  }, [isActive, activeDuration, borderAnim]);

  useEffect(() => {
    if (isCooldown) {
      borderAnim.setValue(0);
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: cooldownDuration,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => {
        setIsCooldown(false);
      });
    }
  }, [isCooldown, cooldownDuration, borderAnim]);

  const handlePress = () => {
    if (isActive || isCooldown || usesLeft <= 0) return;
    setIsActive(true);
    onUse?.();
  };

  const strokeDashoffset = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, circumference],
  });

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        disabled={isActive || isCooldown || usesLeft <= 0}
        style={[
          styles.button,
          isActive && styles.activeButton,
          isCooldown && styles.cooldownButton,
          usesLeft <= 0 && styles.cooldownButton,
        ]}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setButtonSize({ width, height });
        }}
      >
        {/* Kontener ikony z absolutnym pozycjonowaniem i centrowaniem */}
        <View style={[styles.iconWrapper, { width: buttonSize.height, height: buttonSize.height }]}>
          {icon}
          {(isActive || isCooldown) && buttonSize.height > 0 && (
            <View
              pointerEvents="none"
              style={[
                styles.svgOverlay,
                {
                  width: buttonSize.height,
                  height: buttonSize.height,
                  borderRadius: buttonSize.height / 2,
                },
              ]}
            >
              <Svg
                width={buttonSize.height}
                height={buttonSize.height}
                viewBox={`0 0 ${buttonSize.height} ${buttonSize.height}`}
              >
                <Circle
                  cx={buttonSize.height / 2}
                  cy={buttonSize.height / 2}
                  r={radius}
                  stroke="#000000"
                  strokeWidth={STROKE_WIDTH}
                  fill="transparent"
                />
                <AnimatedCircle
                  cx={buttonSize.height / 2}
                  cy={buttonSize.height / 2}
                  r={radius}
                  stroke={isActive ? 'rgb(59, 199, 255)' : '#AAAAAA'}
                  strokeWidth={STROKE_WIDTH}
                  strokeDasharray={`${circumference}, ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  rotation="-90"
                  origin={`${buttonSize.height / 2},${buttonSize.height / 2}`}
                />
              </Svg>
            </View>
          )}
        </View>

        {/* Liczba użyć */}
        <View style={styles.usesContainer}>
          <Text style={[styles.usesText, textStyle]}>{usesLeft}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 152,
    height: 80,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#343437',
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 40,
    height: '100%',
    position: 'relative',
  },
  activeButton: {
    backgroundColor: 'rgb(59, 199, 255)',
  },
  cooldownButton: {
    backgroundColor: '#222',
    borderColor: '#000',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
    zIndex: 2,
    top: 1.5,
    left: -2,
  },
  svgOverlay: {
    position: 'absolute',
    top: -1.5,
    left: -22,
    zIndex: 1,
  },
  usesContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 24,
  },
  usesText: {
    fontFamily: 'Aboreto',
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'right',
  },
});

export default PerkButton;
