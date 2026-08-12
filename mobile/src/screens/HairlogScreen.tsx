import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHaircuts } from '../hooks/useHaircuts';
import type { Haircut } from '../types/api';

function formatRelativeTime(dateString: string): string {
  const diffDays = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays <= 0) {
    return 'Today';
  }
  if (diffDays === 1) {
    return '1 day ago';
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) {
    return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  }

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
}

function PhotoPlaceholder() {
  return (
    <View className="h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <Pattern
            id="diagonalStripes"
            width={8}
            height={8}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <Rect width={8} height={8} fill="#F3F4F6" />
            <Line x1={0} y1={0} x2={0} y2={8} stroke="#E5E7EB" strokeWidth={4} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#diagonalStripes)" />
      </Svg>
      <Text className="text-center text-[10px] leading-[13px] text-gray-400">
        cut{'\n'}photo
      </Text>
    </View>
  );
}

function HaircutRow({ haircut }: { haircut: Haircut }) {
  const coverPhoto =
    haircut.photos?.find(photo => photo.is_cover) ?? haircut.photos?.[0];
  const subtitle = [haircut.notes, formatRelativeTime(haircut.date_taken)]
    .filter(Boolean)
    .join(' · ');

  return (
    <View className="flex-row items-center gap-4 border-b border-gray-100 py-4">
      {coverPhoto ? (
        <Image
          source={{ uri: coverPhoto.image_url }}
          className="h-[72px] w-[72px] rounded-2xl"
          resizeMode="cover"
        />
      ) : (
        <PhotoPlaceholder />
      )}
      <View className="flex-1">
        <Text className="text-lg font-bold text-black">{haircut.title}</Text>
        {!!subtitle && (
          <Text className="mt-1 text-sm text-gray-400">{subtitle}</Text>
        )}
      </View>
    </View>
  );
}

export function HairlogScreen() {
  const insets = useSafeAreaInsets();
  const { data: haircuts } = useHaircuts();

  const sortedHaircuts = [...(haircuts ?? [])].sort(
    (a, b) =>
      new Date(b.date_taken).getTime() - new Date(a.date_taken).getTime(),
  );

  return (
    <View className="flex-1 bg-white">
      <View
        className="items-center px-6 pb-4"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Text className="text-3xl font-bold text-black" style={styles.headerTitle}>
          HAIRLOG
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={styles.scrollContent}
      >
        {sortedHaircuts.length === 0 ? (
          <View className="mt-10 items-center gap-1">
            <Text className="text-center text-xl font-bold text-black">
              No Vlogs Yet
            </Text>
            <Text className="text-center text-base text-gray-400">
              Take a photo to start your hairlog
            </Text>
          </View>
        ) : (
          sortedHaircuts.map(haircut => (
            <HaircutRow key={haircut.id} haircut={haircut} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    letterSpacing: 6,
  },
  scrollContent: {
    paddingBottom: 24,
  },
});
