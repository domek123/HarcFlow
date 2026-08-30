import { View, Text } from "react-native";

import { BaseToast, ErrorToast, ToastConfig } from "react-native-toast-message";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const SuccessToastContent = (props: any) => {
  const { styles } = useStyles(stylesheet);

  return (
    <BaseToast
      {...props}
      style={styles.successToast}
      contentContainerStyle={styles.toastContent}
      text1Style={styles.toastText1}
      text2Style={styles.toastText2}
    />
  );
};

const ErrorToastContent = (props: any) => {
  const { styles } = useStyles(stylesheet);

  return (
    <ErrorToast
      {...props}
      style={styles.errorToast}
      text1Style={styles.toastText1}
      text2Style={styles.toastText2}
    />
  );
};

const CustomToastContent = ({
  text1,
  text2,
}: {
  text1?: string;
  text2?: string;
}) => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.customContainer}>
      <Text style={styles.customTitle}>{text1}</Text>
      {text2 ? <Text style={styles.customSubtitle}>{text2}</Text> : null}
    </View>
  );
};

export const toastConfig: ToastConfig = {
  success: (props) => <SuccessToastContent {...props} />,
  error: (props) => <ErrorToastContent {...props} />,
  customToast: ({ text1, text2 }) => (
    <CustomToastContent text1={text1} text2={text2} />
  ),
};

const stylesheet = createStyleSheet((theme) => ({
  successToast: {
    borderLeftColor: theme.colors.primary,
    backgroundColor: theme.colors.card,
  },
  errorToast: {
    borderLeftColor: theme.colors.destructive,
    backgroundColor: theme.colors.card,
  },
  toastContent: {
    paddingHorizontal: 15,
  },
  toastText1: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.foreground,
  },
  toastText2: {
    fontSize: 13,
    color: theme.colors.mutedForeground,
  },
  customContainer: {
    height: 60,
    width: "90%",
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 12,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.foreground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 4,
  },
  customTitle: {
    color: theme.colors.foreground,
    fontSize: 14,
    fontWeight: "bold",
  },
  customSubtitle: {
    color: theme.colors.mutedForeground,
    fontSize: 12,
  },
}));
