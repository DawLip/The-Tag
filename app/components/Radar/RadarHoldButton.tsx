import React, { useState, useRef } from 'react';
import { Pressable, Image, StyleSheet, GestureResponderEvent } from 'react-native';

type Props = {
  onZoomChange: (active: boolean) => void;
};

const RadarHoldButton: React.FC<Props> = ({ onZoomChange }) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isHeld, setIsHeld] = useState(false);

  const handlePressIn = (e: GestureResponderEvent) => {
    timeoutRef.current = setTimeout(() => {
      setIsHeld(true);
      onZoomChange(true); // przytrzymanie aktywuje zoom
    }, 250);
  };

  const handlePressOut = () => {
    if (!isHeld) {
      onZoomChange(true); // kliknięcie aktywuje zoom
      setTimeout(() => onZoomChange(false), 400);
    } else {
      onZoomChange(false); // puszczenie po przytrzymaniu
    }
    setIsHeld(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.button}>
      <Image
        source={require('@/assets/images/minimize-outline.png')}
        style={styles.icon}
        resizeMode="contain"
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    width: 45,
    height: 45,
    backgroundColor: '#343437',
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 4,
    },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
});

export default RadarHoldButton;
