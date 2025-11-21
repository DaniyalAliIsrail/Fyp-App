import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  // Always redirect to tabs
  useEffect(() => {
    router.replace("/(tabs)");
  }, []);

  return null;
}
