"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Badge } from "../../ui/badge";
import { Progress } from "../../ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Upload, X, User, Briefcase, Award, LanguagesIcon, Plus } from "lucide-react";
import { FluencyLevel } from "@/app/generated/prisma/enums";
import { parseUniqueTitleCaseNames } from "@/lib/textUtils";
import { computeProfileCompleteness } from "@/lib/profileCompleteness";
import type { TalentProfileData } from "@/lib/talentProfileData";
import { TalentProfileSuccessModal } from "./TalentProfileSuccessModal";

interface Country {
  id: string;
  name: string;
}

interface TalentProfileProps {
  profile: TalentProfileData;
  countries: Country[];
}

const FLUENCY_LABELS: Record<FluencyLevel, string> = {
  basic: "Basic",
  conversational: "Conversational",
  fluent: "Fluent",
  native: "Native",
};

interface LanguageRow {
  key: string;
  name: string;
  fluency: FluencyLevel | "";
}

interface FormState {
  name: string;
  phone: string;
  city: string;
  countryId: string;
  roleTitle: string;
  yearsOfExperience: string;
  linkedin: string;
  skills: string[];
  industries: string[];
  languages: LanguageRow[];
}

function formStateFromProfile(profile: TalentProfileData): FormState {
  return {
    name: profile.name,
    phone: profile.phone ?? "",
    city: profile.city,
    countryId: profile.countryId,
    roleTitle: profile.roleTitle,
    yearsOfExperience: profile.yearsOfExperience != null ? String(profile.yearsOfExperience) : "",
    linkedin: profile.linkedin ?? "",
    skills: profile.skills,
    industries: profile.industries,
    languages: profile.languages.map((language) => ({
      key: language.id,
      name: language.name,
      fluency: language.fluency,
    })),
  };
}

function newLanguageKey() {
  return `new-${Math.random().toString(36).slice(2)}`;
}

export function TalentProfile({ profile, countries }: TalentProfileProps) {
  const router = useRouter();
  const [savedProfile, setSavedProfile] = useState(profile);
  const [formData, setFormData] = useState<FormState>(() => formStateFromProfile(profile));
  const [newIndustry, setNewIndustry] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const resetForm = () => {
    setFormData(formStateFromProfile(savedProfile));
    setFormError(null);
    setNewIndustry("");
    setNewSkill("");
  };

  const addIndustry = () => {
    if (!newIndustry.trim()) return;
    setFormData((prev) => ({
      ...prev,
      industries: parseUniqueTitleCaseNames([...prev.industries, ...newIndustry.split(",")]),
    }));
    setNewIndustry("");
  };

  const removeIndustry = (industry: string) => {
    setFormData((prev) => ({ ...prev, industries: prev.industries.filter((i) => i !== industry) }));
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setFormData((prev) => ({
      ...prev,
      skills: parseUniqueTitleCaseNames([...prev.skills, ...newSkill.split(",")]),
    }));
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  const addLanguageRow = () => {
    setFormData((prev) => ({
      ...prev,
      languages: [...prev.languages, { key: newLanguageKey(), name: "", fluency: "" }],
    }));
  };

  const updateLanguageRow = (key: string, changes: Partial<Omit<LanguageRow, "key">>) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.map((row) => (row.key === key ? { ...row, ...changes } : row)),
    }));
  };

  const removeLanguageRow = (key: string) => {
    setFormData((prev) => ({ ...prev, languages: prev.languages.filter((row) => row.key !== key) }));
  };

  const completeness = useMemo(
    () =>
      computeProfileCompleteness({
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        countryId: formData.countryId,
        hasLanguage: formData.languages.some((language) => language.name.trim() && language.fluency),
        roleTitle: formData.roleTitle,
        linkedin: formData.linkedin,
        hasSkill: formData.skills.length > 0,
        hasIndustry: formData.industries.length > 0,
        yearsOfExperience: formData.yearsOfExperience,
      }),
    [formData]
  );

  const handleSubmit = async () => {
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError("Full name is required");
      return;
    }
    if (!formData.city.trim()) {
      setFormError("City is required");
      return;
    }
    if (!formData.countryId) {
      setFormError("Country is required");
      return;
    }
    if (!formData.roleTitle.trim()) {
      setFormError("Role / Title is required");
      return;
    }

    const languagesToSave = formData.languages.filter((language) => language.name.trim());
    if (languagesToSave.some((language) => !language.fluency)) {
      setFormError("Please select a fluency level for each language you've added");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/talent/profile/${savedProfile.consultantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone || null,
          city: formData.city,
          countryId: formData.countryId,
          roleTitle: formData.roleTitle,
          yearsOfExperience: formData.yearsOfExperience || null,
          linkedin: formData.linkedin || null,
          skills: formData.skills,
          industries: formData.industries,
          languages: languagesToSave.map((language) => ({ name: language.name, fluency: language.fluency })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Failed to update profile");
        return;
      }

      setSavedProfile(data);
      setFormData(formStateFromProfile(data));
      setShowSuccess(true);
      router.refresh();
    } catch {
      setFormError("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal and professional information</p>
      </div>

      {/* Profile Completeness Widget */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-blue-900">Profile Completeness</h3>
            <span className="text-2xl font-bold text-blue-600">{completeness.percentage}%</span>
          </div>
          <Progress value={completeness.percentage} className="h-2 mb-2" />
          <p className="text-sm text-blue-800">
            {completeness.completed}/{completeness.total} fields completed. Complete your profile to help us match
            you with the best opportunities.
          </p>
        </CardContent>
      </Card>

      {/* Personal Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" value={savedProfile.email} readOnly className="bg-gray-50" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+65 9123 4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Singapore"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="country">Country *</Label>
              <Select
                value={formData.countryId}
                onValueChange={(value) => setFormData({ ...formData, countryId: value })}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-green-600" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role / Title *</Label>
              <Input
                id="role"
                placeholder="e.g. Senior Software Engineer"
                value={formData.roleTitle}
                onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                placeholder="e.g. 5"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/in/yourprofile"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              />
            </div>
          </div>

          {/* Industries Section */}
          <div className="space-y-2">
            <Label>Industries</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.industries.map((industry) => (
                <Badge key={industry} variant="secondary" className="px-3 py-1">
                  {industry}
                  <button type="button" onClick={() => removeIndustry(industry)} className="ml-2 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add an industry (comma-separated for multiple)"
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addIndustry();
                  }
                }}
              />
              <Button type="button" onClick={addIndustry}>
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill (comma-separated for multiple)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button type="button" onClick={addSkill}>

                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Languages Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LanguagesIcon className="h-5 w-5 text-indigo-600" />
            Languages
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.languages.length === 0 && (
            <p className="text-sm text-muted-foreground">No languages added yet.</p>
          )}
          {formData.languages.map((row) => (
            <div key={row.key} className="flex gap-2 items-start">
              <Input
                placeholder="e.g. English"
                value={row.name}
                onChange={(e) => updateLanguageRow(row.key, { name: e.target.value })}
                className="flex-1"
              />
              <Select
                value={row.fluency}
                onValueChange={(value) => updateLanguageRow(row.key, { fluency: value as FluencyLevel })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Fluency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(FluencyLevel).map((level) => (
                    <SelectItem key={level} value={level}>
                      {FLUENCY_LABELS[level]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLanguageRow(row.key)}
                className="text-muted-foreground hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex justify-end">
            <Button type="button" onClick={addLanguageRow}>
              <Plus className="mr-2 h-4 w-4" />
              Add Language
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            Documents & Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Resume / CV</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground">
              <Upload className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Document uploads are coming soon</p>
              <p className="text-xs mt-1">You&apos;ll be able to upload your resume/CV here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={resetForm} disabled={isSaving}>
          Cancel
        </Button>
        <Button variant="default" onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

      <TalentProfileSuccessModal open={showSuccess} onOpenChange={setShowSuccess} />
    </div>
  );
}
