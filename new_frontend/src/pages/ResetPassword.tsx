import { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, EyeOff, Eye, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/form";
import { Heading, Text } from "@/components/ui/primitives";
import { PageHeader, Panel, Notice } from "@/src/app/kit";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsSuccess(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <>
      <PageHeader
        eyebrow="Account Security"
        title="Reset Password"
        subtitle="Set a new secure password for your Sagri account"
      />

      <div className="mt-12 max-w-md mx-auto">
        <Panel className="p-8">
          {isSuccess ? (
            <div className="text-center py-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf/15 text-leaf mb-4 border border-leaf/30">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <Heading as="h3" family="serif" size="title" className="text-2xl">
                Password Updated!
              </Heading>
              <Text size="sm" tone="muted" className="mt-2">
                Your credentials have been securely refreshed. Redirecting you to your dashboard...
              </Text>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Field label="New Password (min 6 characters)" htmlFor="new-pass">
                <div className="relative">
                  <TextInput
                    id="new-pass"
                    type={showPass ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>

              <Field label="Confirm New Password" htmlFor="confirm-pass">
                <TextInput
                  id="confirm-pass"
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="••••••••"
                />
              </Field>

              {error && (
                <Notice tone="warn">
                  {error}
                </Notice>
              )}

              <Button type="submit" className="w-full rounded-full bg-wheat text-primary-foreground hover:bg-wheat/90 font-semibold py-3 text-sm">
                <span>Update Password</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          )}
        </Panel>
      </div>
    </>
  );
}
