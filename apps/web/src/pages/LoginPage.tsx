import { useTranslation } from "react-i18next";

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
import { useLogin } from "@/hooks/useLogin";

export const LoginPage = () => {
  const { t } = useTranslation();

  const {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    error,
    loading,
  } = useLogin();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("login.title")}</CardTitle>
          <CardDescription>{t("login.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("login.email.label")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("login.email.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("login.password.label")}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t("login.password.placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="text-red-500 text-center mb-4">
              {t("login.error")}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button className="w-full" onClick={handleLogin} disabled={loading}>
            {loading ? t("login.loading") : t("login.button")}
          </Button>
          <div className="flex w-full justify-between text-sm">
            <a
              href="#"
              className="text-muted-foreground hover:text-primary hover:underline"
            >
              {t("login.forgotPassword")}
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
