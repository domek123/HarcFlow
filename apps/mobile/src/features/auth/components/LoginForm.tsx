import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { useLoginForm } from "../hooks/useLoginForm";

interface LoginFormProps {
  onNavigateToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onNavigateToRegister,
}) => {
  const { t } = useTranslation();
  const { styles, theme } = useStyles(stylesheet);

  const {
    control,
    errors,
    isLoading,
    authError,
    isPasswordVisible,
    togglePasswordVisibility,
    onSubmit,
  } = useLoginForm();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>APP</Text>
            </View>
            <Text style={styles.title}>{t("auth.welcomeTitle")}</Text>
            <Text style={styles.subtitle}>{t("auth.welcomeSubtitle")}</Text>
          </View>

          {authError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{authError}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("auth.emailLabel")}</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder={t("auth.emailPlaceholder")}
                    placeholderTextColor={theme.colors.mutedForeground}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.email ? (
                <Text style={styles.fieldError}>{errors.email?.message}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("auth.passwordLabel")}</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.passwordWrapper}>
                    <TextInput
                      style={[
                        styles.input,
                        styles.passwordInput,
                        errors.password && styles.inputError,
                      ]}
                      placeholder={t("auth.passwordPlaceholder")}
                      placeholderTextColor={theme.colors.mutedForeground}
                      secureTextEntry={!isPasswordVisible}
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                    <Pressable
                      onPress={togglePasswordVisibility}
                      style={styles.eyeButton}
                    >
                      <Text style={styles.eyeButtonText}>
                        {isPasswordVisible
                          ? t("auth.hidePassword")
                          : t("auth.showPassword")}
                      </Text>
                    </Pressable>
                  </View>
                )}
              />
              {errors.password ? (
                <Text style={styles.fieldError}>
                  {errors.password?.message}
                </Text>
              ) : null}
            </View>

            <Pressable
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={onSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>{t("auth.loginButton")}</Text>
              )}
            </Pressable>

            <Pressable
              onPress={onNavigateToRegister}
              style={styles.registerLink}
            >
              <Text style={styles.registerText}>
                {t("auth.registerPrompt")}{" "}
                <Text style={styles.registerTextBold}>
                  {t("auth.registerAction")}
                </Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoText: {
    color: theme.colors.primaryForeground,
    fontSize: 22,
    fontWeight: "700",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.foreground,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.mutedForeground,
  },
  errorBanner: {
    backgroundColor: "rgba(166, 48, 48, 0.08)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.destructive,
  },
  errorBannerText: {
    color: theme.colors.destructive,
    fontSize: 14,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.foreground,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: theme.colors.foreground,
    backgroundColor: theme.colors.card,
  },
  inputError: {
    borderColor: theme.colors.destructive,
  },
  passwordWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  passwordInput: {
    paddingRight: 64,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    height: "100%",
    justifyContent: "center",
  },
  eyeButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  fieldError: {
    color: theme.colors.destructive,
    fontSize: 12,
    marginTop: 2,
  },
  button: {
    height: 52,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.colors.primaryForeground,
    fontSize: 16,
    fontWeight: "700",
  },
  registerLink: {
    marginTop: 8,
    alignItems: "center",
  },
  registerText: {
    color: theme.colors.mutedForeground,
    fontSize: 14,
  },
  registerTextBold: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
}));
