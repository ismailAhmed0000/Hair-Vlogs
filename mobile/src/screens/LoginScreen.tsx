import { useState } from 'react';
import { useLogin } from '../hooks/useAuth';
import { ApiError } from '../lib/apiClient';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
}

export function LoginScreen({ onNavigateToRegister }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  const errorMessage =
    login.error instanceof ApiError
      ? login.error.message
      : login.error
      ? 'something went wrong'
      : null;

  const handleSubmit = () => {
    if (!email || !password) return;
    login.mutate({ email: email.trim().toLowerCase(), password });
  };

  return (
    <View className="flex-1 justify-center bg-white px-6 dark:bg-black">
      <Text className="mb-8 text-2xl font-bold text-black dark:text-white">
        Welcome back
      </Text>
      <Text className="mb-1 text-sm font-medium text-black dark:text-white">
        Email
      </Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        placeholder="your email"
        placeholderTextColor="#888"
        className="mb-4 rounded-lg border border-gray-300 px-4 py-3 text-black dark:border-gray-700 dark:text-white"
      />
      <Text className="mb-1 text-sm font-medium text-black dark:text-white">
        Password
      </Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="password"
        placeholderTextColor="#888"
        className="mb-2 rounded-lg border border-gray-300 px-4 py-3 text-black dark:border-gray-700 dark:text-white"
      />
      {errorMessage && (
        <Text className="mb-2 text-sm text-red-500">{errorMessage}</Text>
      )}
      <Pressable
        onPress={handleSubmit}
        disabled={login.isPending}
        className="mt-4 items-center rounded-full bg-black px-8 py-3 dark:bg-white"
      >
        {login.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-base font-semibold text-white dark:text-black">
            Log In
          </Text>
        )}
      </Pressable>
      <Pressable onPress={onNavigateToRegister} className="mt-6 items-center">
        <Text className="text-sm text-black dark:text-white">
          Don't have an account? <Text className="font-semibold">Sign up</Text>
        </Text>
      </Pressable>
    </View>
  );
}
