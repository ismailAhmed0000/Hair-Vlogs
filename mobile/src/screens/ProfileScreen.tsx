import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHaircuts } from '../hooks/useHaircuts';
import { useMe } from '../hooks/useUsers';
import { useAuthStore } from '../store/authStore';

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');
}

function formatMemberSince(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const cachedUser = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const { data: me } = useMe();
  const { data: haircuts } = useHaircuts();

  const user = me ?? cachedUser;

  return (
    <View className="flex-1 bg-white">
      <View
        className="items-center px-6 pb-4"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Text className="text-3xl font-bold text-black" style={styles.headerTitle}>
          PROFILE
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={styles.scrollContent}
      >
        {user && (
          <View className="mt-6 items-center">
            <View
              className="h-24 w-24 items-center justify-center rounded-full bg-black"
              style={styles.shadow}
            >
              <Text className="text-2xl font-bold text-white">
                {getInitials(user.name)}
              </Text>
            </View>

            <Text className="mt-4 text-2xl font-bold text-black">
              {user.name}
            </Text>
            <Text className="mt-1 text-base text-gray-400">{user.email}</Text>
            <Text className="mt-1 text-sm text-gray-400">
              Member since {formatMemberSince(user.created_at)}
            </Text>
          </View>
        )}

        <View
          className="mt-8 w-full flex-row items-center justify-center rounded-2xl bg-gray-100 py-5"
          style={styles.shadow}
        >
          <Text className="text-xl font-bold text-black">
            {haircuts?.length ?? 0}
          </Text>
          <Text className="ml-2 text-base text-gray-400">vlogs logged</Text>
        </View>

        <Pressable
          onPress={logout}
          className="mt-10 items-center rounded-2xl border border-gray-200 py-4"
        >
          <Text className="text-base font-semibold text-black">Log Out</Text>
        </Pressable>
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
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
});
