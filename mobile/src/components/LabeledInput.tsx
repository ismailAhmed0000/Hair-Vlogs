import { Text, TextInput, TextInputProps, View } from 'react-native';

interface LabeledInputProps extends TextInputProps {
  label: string;
}

export function LabeledInput({ label, ...inputProps }: LabeledInputProps) {
  return (
    <View className="rounded-2xl bg-gray-100 px-4 py-3">
      <Text className="text-xs text-gray-400">{label}</Text>
      <TextInput
        placeholderTextColor="#9CA3AF"
        underlineColorAndroid="transparent"
        className="mt-1 p-0 text-base text-black"
        {...inputProps}
      />
    </View>
  );
}
