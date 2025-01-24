import { Link, router } from "expo-router";
import { ReactElement, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/auth";

export default function Login(): ReactElement {

  const { logIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const onSubmit = async () => {
    if (logIn) {
      const resp = await logIn(email, password);
      console.log(resp);
      if (resp?.user) {
        router.replace("/home")
      } else {
        console.error(resp.error);
        Alert.alert('Login Error', resp.error?.message as string)
      }
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="h-full">
        <View className="h-full flex flex-col gap-3 justify-center items-center bg-gray-500">
          <View className="flex flex-col gap-3">
            <View className="flex flex-col gap-2">
              <Text>Email</Text>
              <TextInput className="bg-white px-2 py-1 rounded"
                value={email}
                onChangeText={(text => setEmail(text))}
                placeholder="example@email.com"
                textContentType="emailAddress">
              </TextInput>
            </View>
            <View className="flex flex-col gap-2">
              <Text>Password</Text>
              <TextInput className="bg-white px-2 py-1 rounded"
                value={password}
                onChangeText={(text => setPassword(text))}
                placeholder="********"
                textContentType="password"
                secureTextEntry={true}
              >
              </TextInput>
            </View>
            <View className="flex flex-row items-center justify-between">
              <Link href={'/signup'} asChild>
                <Pressable>
                  <Text className="text-blue-800">Sign up</Text>
                </Pressable>
              </Link>
              <Pressable className="bg-gray-300 rounded-xl p-2" onPress={() => onSubmit()}
                disabled={!email || !password}>
                <Text>Log in</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );

}
