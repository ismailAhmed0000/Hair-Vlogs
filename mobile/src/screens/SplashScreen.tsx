import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScissorsIcon } from '../components/ScissorsIcon';

interface SplashScreenProps {
  onContinue: () => void;
}

export function SplashScreen({ onContinue }: SplashScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 items-center bg-black"
      style={{ paddingTop: insets.top + 96, paddingBottom: insets.bottom + 40 }}
    >
      <View
        className="h-28 w-28 items-center justify-center rounded-full bg-white"
        style={styles.shadow}
      >
        <ScissorsIcon size={36} color="#000" />
      </View>

      <Text className="mt-8 text-3xl font-bold text-white" style={styles.title}>
        HAIRLOG
      </Text>
      <Text className="mt-2 text-xs font-medium text-gray-400" style={styles.subtitle}>
        YOUR CUTS, REMEMBERED
      </Text>

      <View className="flex-1" />

      <Pressable onPress={onContinue} className="rounded-full bg-white px-10 py-4">
        <Text className="text-base font-semibold text-black">Get Started</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    letterSpacing: 6,
  },
  subtitle: {
    letterSpacing: 2,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
});
