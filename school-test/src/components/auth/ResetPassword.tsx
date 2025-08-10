import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { resetPassword } from "../../api/user/reset-password";

const ResetPassword = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [loading, setLoading] = useState(false); // loading state

  useEffect(() => {
    if (success) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      if (countdown === 0) {
        clearInterval(timer);
        navigate("/login");
      }

      return () => clearInterval(timer);
    }
  }, [success, countdown, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!tokenId) {
      setMessage("Invalid or missing token.");
      return;
    }

    setLoading(true); // start loading

    try {
      await resetPassword(tokenId, { newPassword: password });
      setMessage("Password reset successfully. Redirecting to login...");
      setSuccess(true);
    } catch (error: any) {
      setMessage(error.message || "Failed to reset password. Try again later.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  if (success) {
    return (
      <div className="h-[calc(100vh-200px)] flex justify-center items-center">
        <Card className="mx-auto max-w-sm min-w-[400px] text-center p-6">
          <CardTitle className="text-2xl mb-4">Success!</CardTitle>
          <p>{message}</p>
          <p className="mt-2">Redirecting in {countdown} seconds...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] flex justify-center items-center">
      <Card className="mx-auto max-w-sm min-w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="New password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          {message && <p className="mt-4 text-center">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
