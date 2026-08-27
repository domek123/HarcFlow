import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPassword } from "@/hooks/useResetPassword";

export const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const { email, setEmail, handleResetPassword, error, success, loading } =
    useResetPassword();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("resetPassword.title")}</CardTitle>
          <CardDescription>{t("resetPassword.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">
              {t("resetPassword.email.label")}
            </Label>
            <Input
              id="reset-email"
              type="email"
              placeholder={t("resetPassword.email.placeholder")}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          {error && (
            <p className="text-center text-red-500">
              {error === "passwordsDoNotMatch"
                ? t("resetPassword.passwordsDoNotMatch")
                : t("resetPassword.error")}
            </p>
          )}
          {success && (
            <p className="text-center text-green-600">
              {t("resetPassword.success")}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button
            className="w-full"
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? t("resetPassword.loading") : t("resetPassword.button")}
          </Button>
          <Link
            to="/login"
            className="text-sm text-muted-foreground hover:text-primary hover:underline"
          >
            {t("resetPassword.backToLogin")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
