import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#5B8DEF" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          // React Navigation's tabBarIcon color can be a wider ColorValue (string | number |
          // PlatformColor | null) after the RN 0.88 bump; @expo/vector-icons only accepts
          // string | undefined. It's always a real string at runtime here.
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="check-circle" color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: "Habits",
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="list" color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="line-chart" color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          title: "Coach",
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="comments" color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="th-large" color={color as string} />,
        }}
      />
    </Tabs>
  );
}
