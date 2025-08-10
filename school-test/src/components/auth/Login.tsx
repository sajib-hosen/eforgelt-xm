import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { loginUser } from "../../api/user/login-user";
import { loginSuccess } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";

const initData = { email: "", password: "" };

const Login = () => {
  const [form, setForm] = useState(initData);
  const [loading, setLoading] = useState(false); // <-- loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // start loading

    try {
      const data = await loginUser({
        email: form.email,
        password: form.password,
      });

      dispatch(
        loginSuccess({
          token: data.accessToken,
          user: data.user,
        })
      );

      toast.success("Logged in successfully");

      setForm(initData); // Clear form inputs

      const params = new URLSearchParams(location.search);
      const redirectPath = params.get("from") || "/";

      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex justify-center items-center">
      <Card className="mx-auto max-w-sm min-w-[370px]">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={form.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                required
                value={form.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              variant={"outline"}
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
