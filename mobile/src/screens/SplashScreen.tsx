import { Pressable, Text, View } from 'react-native';

interface SplashScreenProps {
  onContinue: () => void;
}

export function SplashScreen({ onContinue }: SplashScreenProps) {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="mb-8 text-2xl font-bold text-black dark:text-white">
        Hair Vlogs
      </Text>
      <Pressable
        onPress={onContinue}
        className="rounded-full bg-black px-8 py-3 dark:bg-white"
      >
        <Text className="text-base font-semibold text-white dark:text-black">
          Get Started
        </Text>
      </Pressable>
    </View>
  );
}
