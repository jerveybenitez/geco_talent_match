"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ArrowRight, CheckCircle2, Clock, User } from "lucide-react";

interface TalentDashboardProps {
  talentName: string;
}

export function TalentDashboard({ talentName }: TalentDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-[#1D2033] to-[#2a2f5b] border-none">
        <CardContent className="pt-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome, {talentName}! 👋
          </h1>
          <p className="text-white/80">
            Here&apos;s an overview of your profile and onboarding progress.
          </p>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Completion Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Profile Completion
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold text-blue-600">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground">
              Complete your profile to unlock all features
            </p>
            <Button
              className="w-full"
              disabled
            >
              Complete Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Onboarding Progress Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Onboarding Progress
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Videos Completed</span>
                <span className="font-semibold text-orange-600">4/10</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground">
              6 videos remaining to complete onboarding
            </p>
            <Button
              variant="outline"
              className="w-full"
              disabled
            >
              View Onboarding
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Performance Review Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Performance Review
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-medium px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                  1 Pending
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Due: March 31, 2026
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              You have a pending performance questionnaire
            </p>
            <Button
              variant="outline"
              className="w-full"
              disabled
            >
              Open Reviews
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" disabled>
              Update Profile
            </Button>
            <Button variant="outline" disabled>
              Continue Onboarding
            </Button>
            <Button variant="outline" disabled>
              View Performance Reviews
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
