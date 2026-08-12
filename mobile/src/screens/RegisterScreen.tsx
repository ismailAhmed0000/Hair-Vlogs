import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LabeledInput } from '../components/LabeledInput';
import { ScissorsIcon } from '../components/ScissorsIcon';
import { useRegister } from '../hooks/useAuth';
import { ApiError } from '../lib/apiClient';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export function RegisterScreen({ onNavigateToLogin }: RegisterScreenProps) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const register = useRegister();

  const errorMessage =
    register.error instanceof ApiError
      ? register.error.message
      : register.error
      ? 'Something went wrong'
      : null;

  const handleSubmit = () => {
    if (!name || !email || !password) return;
    register.mutate({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
  };

  return (
    <View
      className="flex-1 bg-white px-6"
      style={{
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 24,
      }}
    >
      <View className="h-16 w-16 items-center justify-center rounded-full bg-black">
        <ScissorsIcon size={24} color="#fff" />
      </View>

      <Text className="mt-6 text-3xl font-bold text-black">
        Create account
      </Text>
      <Text className="mt-1 text-base text-gray-400">
        Start saving your haircut references
      </Text>

      <View className="mt-8 gap-4">
        <LabeledInput
          label="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <LabeledInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
        <LabeledInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {errorMessage && (
        <Text className="mt-3 text-sm text-red-500">{errorMessage}</Text>
      )}

      <Pressable
        onPress={handleSubmit}
        disabled={register.isPending}
        className="mt-4 items-center rounded-full bg-black py-4"
      >
        {register.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-base font-semibold text-white">
            Create Account
          </Text>
        )}
      </Pressable>

      <Text className="mt-3 text-center text-xs text-gray-400">
        By continuing you agree to our Terms & Privacy Policy
      </Text>

      <View className="flex-1" />

      <Pressable onPress={onNavigateToLogin} className="items-center">
        <Text className="text-sm text-gray-400">
          Already have an account?{' '}
          <Text className="font-semibold text-black">Log in</Text>
        </Text>
      </Pressable>
    </View>
  );
}
