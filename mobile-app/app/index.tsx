import { useAuth } from "@/context/auth";
import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { ReactElement, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index(): ReactElement {
  const { isInitialized, isLoggedIn } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!isInitialized || !navigationState?.key) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)'
    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/(auth)/login')
    } else if (isLoggedIn) {
      router.replace('/(main)/home')
    }
  }, [segments, navigationState?.key, isInitialized]);

  return (
    <View>
      {!navigationState?.key ? <ActivityIndicator /> : <></>}
    </View>
  )
}


