import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { useQueryClient } from '@tanstack/react-query';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNavBar, NavTab } from '../components/BottomNavBar';
import { createHaircut } from '../api/haircuts';
import { createPhoto } from '../api/photos';
import { uploadImage } from '../api/uploads';
import { haircutKeys, useHaircuts } from '../hooks/useHaircuts';
import { HairlogScreen } from './HairlogScreen';
import { ProfileScreen } from './ProfileScreen';

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
  const [isSaving, setIsSaving] = useState(false);
  const insets = useSafeAreaInsets();
  const { data: haircuts } = useHaircuts();
  const queryClient = useQueryClient();

  async function handleTakePhoto() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Camera permission needed',
          'Enable camera access in settings to take photos.',
        );
        return;
      }
    }

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

    const asset = result.assets?.[0];
    if (!asset?.uri) {
      return;
    }

    setIsSaving(true);

    try {
      const imageUrl = await uploadImage({
        uri: asset.uri,
        name: asset.fileName,
        type: asset.type,
      });

      const haircut = await createHaircut({
        title: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        date_taken: new Date().toISOString().slice(0, 10),
      });

      await createPhoto(haircut.id, { image_url: imageUrl, is_cover: true });

      queryClient.invalidateQueries({ queryKey: haircutKeys.all });
    } catch (error) {
      Alert.alert(
        'Could not save photo',
        error instanceof Error ? error.message : 'Something went wrong.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View className="flex-1 bg-white">
      {activeTab === 'memories' ? (
        <HairlogScreen />
      ) : activeTab === 'inbox' ? (
        <ProfileScreen />
      ) : (
        <>
          <View
            className="items-center px-6 pb-4"
            style={{ paddingTop: insets.top + 12 }}
          >
            <Text
              className="text-3xl font-bold text-black"
              style={styles.headerTitle}
            >
              VLOGS
            </Text>
          </View>

          <View className="flex-1 px-6 pt-20">
            <View className="items-center">
              <Pressable
                onPress={handleTakePhoto}
                disabled={isSaving}
                className="relative h-80 w-72 items-center justify-center overflow-hidden rounded-3xl bg-gray-100"
              >
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

                {isSaving && (
                  <View className="absolute inset-0 items-center justify-center bg-black/30">
                    <ActivityIndicator color="#fff" />
                  </View>
                )}
              </Pressable>
            </View>

            <View className="mt-14">
              <EmptyStatePill text="Recents" />
            </View>

            {!haircuts || haircuts.length === 0 ? (
              <View className="mt-10 items-center gap-1">
                <Text className="text-center text-xl font-bold text-black"></Text>
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
        </>
      )}

      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}
