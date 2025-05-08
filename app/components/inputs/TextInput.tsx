import { TextInput, View, Text, StyleSheet } from 'react-native';

export default function Input(
  {
    label,
    placeholder,
    value,
    setValue,
    isPassword = false,
  }: {
    label: string;
    placeholder: string;
    value: string;
    setValue: (arg0: string) => void;
    isPassword?: boolean;
  }
) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        {label}
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#A0A0A0"
        onChangeText={setValue}
        secureTextEntry={isPassword}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    alignSelf: 'stretch',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: 297,
    minWidth: 240,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderColor: '#D9D9D9',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 14,
    color: '#000000',
  },
});
