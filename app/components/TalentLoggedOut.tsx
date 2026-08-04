"use client";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

interface TalentLoggedOutProps {
  onBackToLogin: () => void;
}

export function TalentLoggedOut({ onBackToLogin }: TalentLoggedOutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1D2033] via-[#1D2033] to-[#2a2f5b] flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardContent className="pt-12 pb-12 text-center">
          <img src="/logos/geco-logo.png" alt="GECO Asia" className="h-16 w-auto mx-auto mb-8"/>
          
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogOut className="h-10 w-10 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold mb-2">You are logged out</h2>
          <p className="text-muted-foreground mb-8">
            Thank you for using the GECO Asia Portal
          </p>

          <Button onClick={onBackToLogin} className="w-full" size="lg">
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
