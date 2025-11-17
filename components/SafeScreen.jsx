import { View,StyleSheet } from "react-native";
import COLORS from "../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function SafeScreen({children}) {
  const insets = useSafeAreaInsets();
//   useSafeAreaInsets Yeh hook safe area ke margins ki values return karta hai
//  (top, bottom, left, right) jo device ke hisaab se adjust hoti hain.
  return <View style={[styles.container,{
     paddingTop: Math.max(insets.top,8), // Ensure a minimum padding
  }]}>
    {children}
  </View>;
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: COLORS.background,
    }
}
)