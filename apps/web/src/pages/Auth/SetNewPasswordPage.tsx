import { Input, Button } from "@base-ui/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { useSetNewPassword } from "../../hooks";

export function SetNewPasswordPage() {
  const { t } = useTranslation();
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    hasRecoverySession,
    checkingSession,
    handleSetNewPassword,
    error,
    success,
    loading,
  } = useSetNewPassword();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("setNewPassword.title")}</CardTitle>
          <CardDescription>{t("setNewPassword.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {checkingSession ? (
            <p className="text-center text-muted-foreground">
              {t("setNewPassword.checkingSession")}
            </p>
          ) : hasRecoverySession ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="new-password">
                  {t("setNewPassword.newPassword")}
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  {t("setNewPassword.confirmPassword")}
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </div>
            </>
          ) : (
            <p className="text-center text-red-500">
              {t("setNewPassword.invalidSession")}
            </p>
          )}
          {error && (
            <p className="text-center text-red-500">
              {error === "passwordsDoNotMatch"
                ? t("setNewPassword.passwordsDoNotMatch")
                : t("setNewPassword.error")}
            </p>
          )}
          {success && (
            <p className="text-center text-green-600">
              {t("setNewPassword.success")}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          {hasRecoverySession && (
            <Button
              className="w-full"
              onClick={handleSetNewPassword}
              disabled={loading || checkingSession}
            >
              {loading
                ? t("setNewPassword.loading")
                : t("setNewPassword.button")}
            </Button>
          )}
          <Link
            to="/login"
            className="text-sm text-muted-foreground hover:text-primary hover:underline"
          >
            {t("setNewPassword.backToLogin")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
