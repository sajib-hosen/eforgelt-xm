import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { forgotPassword } from "../../api/user/forgot-password";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      if (countdown === 0) {
        clearInterval(timer);
        navigate("/");
      }

      return () => clearInterval(timer);
    }
  }, [success, countdown, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await forgotPassword({ email });
      setMessage(
        "If this email exists, you will receive a reset link shortly."
      );
      setSuccess(true);
    } catch (error: any) {
      setMessage(
        error.message || "Failed to send reset link. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="h-[calc(100vh-200px)] flex justify-center items-center">
        <Card className="mx-auto max-w-sm min-w-[370px] text-center p-6">
          <CardTitle className="text-2xl mb-4">Success!</CardTitle>
          <p>{message}</p>
          <p className="mt-2">
            Redirecting to home in {countdown} second{countdown !== 1 && "s"}
            ...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] flex justify-center items-center">
      <Card className="mx-auto max-w-sm min-w-[370px]">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your-email@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button
              variant={"outline"}
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
          {message && <p className="mt-4 text-center">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
