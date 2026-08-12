import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNavBar, NavTab } from '../components/BottomNavBar';
import { useHaircuts } from '../hooks/useHaircuts';

function PlusIcon({
  size = 18,
  color = '#fff',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 5v14M5 12h14"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ViewfinderCorner({ className }: { className: string }) {
  return <View className={`absolute h-8 w-8 border-black ${className}`} />;
}

function EmptyStatePill({ text }: { text: string }) {
  return (
    <View
      className="w-full items-center rounded-full bg-gray-100 px-6 py-5"
      style={styles.pillShadow}
    >
      <Text className="text-xl font-semibold text-gray-800">{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pillShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  headerTitle: {
    letterSpacing: 6,
  },
});

export function HomeScreen() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const { data: haircuts } = useHaircuts();

  async function handleTakePhoto() {
    const result = await launchCamera({
      mediaType: 'photo',
      saveToPhotos: true,
    });

    if (result.errorCode) {
      if (result.errorCode !== 'camera_unavailable') {
        Alert.alert(
          'Camera unavailable',
          result.errorMessage ?? 'Could not open the camera.',
        );
      }
      return;
    }

    const uri = result.assets?.[0]?.uri;
    if (uri) {
      setCapturedPhotoUri(uri);
    }
  }

  return (
    <View className="flex-1 bg-white">
      <View
        className="items-center px-6 pb-4"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Text className="text-3xl font-bold text-black" style={styles.headerTitle}>
          VLOGS
        </Text>
      </View>

      <View className="flex-1 px-6 pt-20">
        <View className="items-center">
          <Pressable
            onPress={handleTakePhoto}
            className="relative h-80 w-72 items-center justify-center overflow-hidden rounded-3xl bg-gray-100"
          >
            {capturedPhotoUri ? (
              <Image
                source={{ uri: capturedPhotoUri }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <>
                <ViewfinderCorner className="left-3 top-3 border-l-[3px] border-t-[3px] rounded-tl-lg" />
                <ViewfinderCorner className="right-3 top-3 border-r-[3px] border-t-[3px] rounded-tr-lg" />
                <ViewfinderCorner className="bottom-3 left-3 border-b-[3px] border-l-[3px] rounded-bl-lg" />
                <ViewfinderCorner className="bottom-3 right-3 border-b-[3px] border-r-[3px] rounded-br-lg" />
                <View
                  className="h-20 w-20 items-center justify-center rounded-full bg-black"
                  style={styles.pillShadow}
                >
                  <PlusIcon size={28} color="#fff" />
                </View>
              </>
            )}
          </Pressable>
        </View>

        <View className="mt-14">
          <EmptyStatePill text="Recents" />
        </View>

        {!haircuts || haircuts.length === 0 ? (
          <View className="mt-10 items-center gap-1">
            <Text className="text-center text-xl font-bold text-black">
              No Vlogs Yet
            </Text>
            <Text className="text-center text-base text-gray-400">
              Tap + above to record your first one
            </Text>
          </View>
        ) : (
          <View className="mt-10 gap-3">
            {haircuts.map(haircut => (
              <View
                key={haircut.id}
                className="rounded-2xl border border-gray-100 px-4 py-3"
              >
                <Text className="text-base font-medium text-black">
                  {haircut.title}
                </Text>
                <Text className="text-sm text-gray-400">
                  {haircut.date_taken}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}
