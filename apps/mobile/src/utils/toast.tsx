import Toast from "react-native-toast-message";

export const showToast = {
  success: (title: string, message?: string) => {
    Toast.show({
      type: "success",
      text1: title,
      text2: message,
      position: "top",
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
    });
  },

  error: (title: string, message?: string) => {
    Toast.show({
      type: "error",
      text1: title,
      text2: message,
      position: "top",
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 50,
    });
  },

  info: (title: string, message?: string) => {
    Toast.show({
      type: "info",
      text1: title,
      text2: message,
      position: "bottom",
      bottomOffset: 40,
    });
  },

  custom: (title: string, message?: string) => {
    Toast.show({
      type: "customToast",
      text1: title,
      text2: message,
      position: "top",
    });
  },

  hide: () => {
    Toast.hide();
  },
};
