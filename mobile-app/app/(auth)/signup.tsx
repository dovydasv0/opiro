import { router } from "expo-router";
import { ReactElement, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/auth";

export default function Signup(): ReactElement {

  const { createAccount } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");


  const onSubmit = async () => {
    if (createAccount) {
      const resp = await createAccount(email, password, repeatPassword);
      console.log(resp);
      if (resp?.user) {
        router.replace("/login")
      } else {
        console.log(resp.error);
        Alert.alert('Sign Up error', JSON.stringify(email));
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
            <View className="flex flex-col gap-2">
              <Text>Repeat Password</Text>
              <TextInput className="bg-white px-2 py-1 rounded"
                value={repeatPassword}
                onChangeText={(text => setRepeatPassword(text))}
                placeholder="********"
                textContentType="password"
                secureTextEntry={true}
              >
              </TextInput>
            </View>
            <View className="flex items-end justify-end">
              <Pressable className="bg-gray-300 rounded-xl p-2"
                onPress={() => onSubmit()}
                disabled={!email || !password || !repeatPassword || password != repeatPassword}>
                <Text>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
