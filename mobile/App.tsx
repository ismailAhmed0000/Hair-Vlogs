import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient } from './src/lib/queryClient';
import { useAuthStore } from './src/store/authStore';
import { SplashScreen } from './src/screens/SplashScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';

import './global.css';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const hasHydrated = useAuthStore(state => state.hasHydrated);
  const token = useAuthStore(state => state.token);
  const [hasEnteredApp, setHasEnteredApp] = useState(false);

  if (!hasHydrated || !hasEnteredApp) {
    return <SplashScreen onContinue={() => setHasEnteredApp(true)} />;
  }

  if (!token) {
    return <LoginScreen onNavigateToRegister={() => {}} />;
  }

  return <HomeScreen />;
}

export default App;
