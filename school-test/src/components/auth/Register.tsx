import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Link } from "react-router-dom";
import { registerUser } from "../../api/user/register-user";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const initState = {
  name: "",
  email: "",
  password: "",
};

const Register = () => {
  const [form, setForm] = useState(initState);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // <-- Loading state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      await registerUser(form);
      setSuccess(true);
      toast.success("Registered successfully!");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex justify-center items-center">
      <Card className="mx-auto max-w-sm min-w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center p-6">
              <p className="mb-2">Registration successful!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

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

              <div className="flex justify-end">
                <div className="text-right text-sm flex gap-2">
                  <p>Already have an account?</p>
                  <Link to="/login" className="text-blue-600 hover:underline">
                    Login
                  </Link>
                </div>
              </div>

              <Button
                variant={"outline"}
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
