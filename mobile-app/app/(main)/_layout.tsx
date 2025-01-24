import { Tabs } from "expo-router";

export default function HomeLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{
        title: 'Home'
      }} />
      <Tabs.Screen name="profile" options={{
        title: 'Profile'
      }} />
    </Tabs>
  )
}
