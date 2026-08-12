import { Pressable, View } from 'react-native';
import Svg, { Path, Polyline } from 'react-native-svg';

export type NavTab = 'memories' | 'home' | 'inbox';

interface BottomNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

function CloudIcon({ active }: { active: boolean }) {
  return (
    <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.5 19H9a7 7 0 1 1 6.71-9h.79a4.5 4.5 0 1 1 0 9z"
        stroke={active ? '#000' : '#B0B0B0'}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <Svg width={32} height={32} viewBox="0 0 24 24">
        <Path d="M12 2.1L1 12h3v9h6v-6h4v6h6v-9h3L12 2.1z" fill="#000" />
      </Svg>
    );
  }
  return (
    <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        stroke="#B0B0B0"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function InboxIcon({ active }: { active: boolean }) {
  const color = active ? '#000' : '#B0B0B0';
  return (
    <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
      <Polyline
        points="22 12 16 12 14 15 10 15 8 12 2 12"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BottomNavBar({ activeTab, onTabChange }: BottomNavBarProps) {
  return (
    <View className="flex-row items-center justify-center gap-14 border-t border-gray-100 pt-3 pb-6">
      <Pressable onPress={() => onTabChange('memories')} hitSlop={12}>
        <CloudIcon active={activeTab === 'memories'} />
      </Pressable>
      <Pressable onPress={() => onTabChange('home')} hitSlop={12}>
        <HomeIcon active={activeTab === 'home'} />
      </Pressable>
      <Pressable onPress={() => onTabChange('inbox')} hitSlop={12}>
        <InboxIcon active={activeTab === 'inbox'} />
      </Pressable>
    </View>
  );
}
