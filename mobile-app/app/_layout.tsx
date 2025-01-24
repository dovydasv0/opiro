import { Stack } from "expo-router";
import "../global.css"
import { PocketBaseProvider } from "@/context/pocketbase";
import { AuthProvider } from "@/context/auth";

export default function RootLayout() {
  return (
    <PocketBaseProvider>
      <AuthProvider>
        <Stack screenOptions={{
          headerShown: false
        }} />
      </AuthProvider>
    </PocketBaseProvider>);
}
