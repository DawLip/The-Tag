import { TextInput, View, Text } from 'react-native';

export default function Input(
  {label, placeholder, value, setValue, isPassword=false}:{
    label:string, 
    placeholder:string, 
    value:string, 
    setValue: (arg0: string)=>void
    isPassword?:boolean
  }) {
  return (
    <View className="p-4">
      <Text>
        {label}
      </Text>
      <TextInput
        value={value}
        placeholder={placeholder}
        onChangeText={setValue}
        secureTextEntry={isPassword}
      />
    </View>
  );
}