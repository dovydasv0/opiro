import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { PocketBaseProvider } from "@/context/pocketbase";
import { AuthProvider } from "@/context/auth";

export default function RootLayout() {
  return (
    <PocketBaseProvider>
      <AuthProvider>
        <GluestackUIProvider mode="light">
          <Stack screenOptions={{
            headerShown: false
          }} />
        </GluestackUIProvider>
      </AuthProvider>
    </PocketBaseProvider>
  );
}
