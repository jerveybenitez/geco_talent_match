"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { LogIn, AlertCircle } from "lucide-react";

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    const success = await onLogin(email.toLowerCase().trim(), password);
    setLoading(false);

    if (!success) {
      setError("Incorrect email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFFFF] via-[#1D2033] to-[#2a2f5b] flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardHeader className="space-y-4 pb-8 bg-[#1D2033] rounded-t-xl">
          <div className="flex justify-center">
            <img src="/logos/geco-logo.png" alt="GECO Asia" className="h-20 w-auto" />
          </div>
          <div className="text-center">
            <CardTitle className="text-2xl font-bold text-white">HR Business Partner Portal</CardTitle>
            <p className="text-white/80 mt-2">Southeast Asia Operations</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.name@geco.asia"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              <LogIn className="mr-2 h-5 w-5" />
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}