import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNavBar, NavTab } from '../components/BottomNavBar';

function PlusIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        d="M12 5v14M5 12h14"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function HomeScreen() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <View
        className="flex-row items-center px-6 pb-4"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-1" />
        <Text className="flex-1 text-center text-3xl font-bold tracking-tight text-black">
          Cut
        </Text>
        <View className="flex-1 flex-row justify-end">
          <Pressable hitSlop={8}>
            <PlusIcon />
          </Pressable>
        </View>
      </View>

      <View className="flex-1" />

      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}
