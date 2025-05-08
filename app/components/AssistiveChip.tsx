import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type AssistiveChipProps = {
  label: string;
  onPress: () => void;
  variant?: 'DEFAULT' | 'OUTLINE-WHITE';
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const AssistiveChip = ({
  label,
  onPress,
  variant = 'DEFAULT',
  style,
  textStyle,
}: AssistiveChipProps) => {
  const isWhite = variant?.toUpperCase() === 'OUTLINE-WHITE';

  return (
    <TouchableOpacity
      style={[styles.chip, isWhite && styles.outlineWhite, style]}
      onPress={onPress}
    >
      <Text style={[styles.label, isWhite && styles.outlineWhiteText, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    width: 297,
    borderWidth: 1,
    borderColor: '#CAC4D0',
    borderRadius: 40,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 14,
    color: '#000000',
  },
  outlineWhite: {
    borderColor: '#FFFFFF',
  },
  outlineWhiteText: {
    color: '#FFFFFF',
  },
});

export default AssistiveChip;
