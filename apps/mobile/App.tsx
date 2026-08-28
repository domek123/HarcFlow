import "./src/styles/unistyles";
import { Text, View, StyleSheet as RNStyleSheet } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function App() {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>React Native z Unistyles v2!</Text>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: theme.colors.text,
    fontSize: 18,
  },
}));
