"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Upload, UserPlus, CheckCircle2 } from "lucide-react";
import type { ConsultantProfileData } from "@/lib/consultantsData";

type ConsultantStatus = "Available" | "Committed" | "Former";

interface ConsultantFormModalProps {
  countries: { id: string; name: string; code: string }[];
  consultant?: ConsultantProfileData;
}

const emptyFormData = {
  name: "",
  email: "",
  phone: "",
  jobTitle: "",
  yearsOfExperience: "",
  city: "",
  countryId: "",
  status: "Available" as ConsultantStatus,
  bio: "",
  skills: "",
  industries: "",
  availableFrom: "",
  availableTo: "",
  linkedin: "",
  image: null as string | null,
};

function toDateInputValue(iso: string) {
  return iso.slice(0, 10);
}

function formDataFromConsultant(consultant: ConsultantProfileData) {
  return {
    name: consultant.name,
    email: consultant.email,
    phone: consultant.phone ?? "",
    jobTitle: consultant.role,
    yearsOfExperience: consultant.yearsOfExperience != null ? String(consultant.yearsOfExperience) : "",
    city: consultant.city,
    countryId: consultant.countryId,
    status: consultant.status,
    bio: consultant.bio ?? "",
    skills: consultant.skills.join(", "),
    industries: consultant.industries.join(", "),
    availableFrom: toDateInputValue(consultant.availableFrom),
    availableTo: toDateInputValue(consultant.availableTo),
    linkedin: consultant.linkedin ?? "",
    image: consultant.photo,
  };
}

export function ConsultantFormModal({ countries, consultant }: ConsultantFormModalProps) {
  const isEdit = !!consultant;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(() => (consultant ? formDataFromConsultant(consultant) : emptyFormData));
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const openWithFreshData = () => {
    setFormData(consultant ? formDataFromConsultant(consultant) : emptyFormData);
    setFormError(null);
    setOpen(true);
  };

  const resetAndClose = () => {
    setFormData(consultant ? formDataFromConsultant(consultant) : emptyFormData);
    setFormError(null);
    setOpen(false);
  };

  const handlePhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setFormError(null);
    setIsUploadingPhoto(true);
    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/uploads", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Failed to upload photo");
        return;
      }

      setFormData((prev) => ({ ...prev, image: data.url }));
    } catch {
      setFormError("Failed to upload photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (!formData.name || !formData.email) {
      setFormError("Name and email are required");
      return;
    }
    if (!formData.jobTitle) {
      setFormError("Role/Position is required");
      return;
    }
    if (!formData.city || !formData.countryId) {
      setFormError("City and country are required");
      return;
    }
    if (!formData.availableFrom || !formData.availableTo) {
      setFormError("Available From and Contract Expiry dates are required");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(isEdit ? `/api/consultants/${consultant.id}` : "/api/consultants", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          image: formData.image,
          status: formData.status,
          jobTitle: formData.jobTitle,
          yearsOfExperience: formData.yearsOfExperience || null,
          city: formData.city,
          countryId: formData.countryId,
          bio: formData.bio || null,
          skills: formData.skills,
          industries: formData.industries,
          availableFrom: formData.availableFrom,
          availableTo: formData.availableTo,
          linkedin: formData.linkedin || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? `Failed to ${isEdit ? "update" : "create"} consultant`);
        return;
      }

      setOpen(false);
      setShowSuccess(true);
      router.refresh();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch {
      setFormError(`Failed to ${isEdit ? "update" : "create"} consultant`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(next) => (next ? openWithFreshData() : resetAndClose())}>
        <DialogTrigger asChild>
          {isEdit ? (
            <Button variant="outline">Edit Profile</Button>
          ) : (
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Consultant
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Consultant" : "Add New Consultant"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">

              <div>
                <Label>Profile Photo</Label>
                <div className="mt-2 flex items-center gap-4">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    onChange={handlePhotoSelected}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploadingPhoto}
                    onClick={() => photoInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploadingPhoto ? "Uploading..." : "Upload Photo"}
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+XX XXX XXX XXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="role">Role/Position *</Label>
                <Input
                  id="role"
                  placeholder="e.g., Senior Business Analyst"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="years-exp">Years of Experience</Label>
                <Input
                  id="years-exp"
                  type="number"
                  placeholder="5"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="e.g., Bangkok"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
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
              <div className="md:col-span-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as ConsultantStatus })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Committed">Committed</SelectItem>
                    <SelectItem value="Former">Former</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Brief professional summary..."
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  placeholder="e.g., Python, SQL, Data Analysis, Tableau"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="industry">Industries (comma-separated)</Label>
                <Input
                  id="industry"
                  placeholder="e.g., Finance, Healthcare, Technology"
                  value={formData.industries}
                  onChange={(e) => setFormData({ ...formData, industries: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="availability">Available From *</Label>
                <Input
                  id="availability"
                  type="date"
                  value={formData.availableFrom}
                  onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="contract-expiry">Contract Expiry *</Label>
                <Input
                  id="contract-expiry"
                  type="date"
                  value={formData.availableTo}
                  onChange={(e) => setFormData({ ...formData, availableTo: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  placeholder="linkedin.com/in/..."
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                />
              </div>
            </div>

            {formError && (
              <p className="text-sm text-red-600">{formError}</p>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={resetAndClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSaving || isUploadingPhoto}>
                {isSaving ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Add Consultant")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              {isEdit ? "Consultant Updated Successfully!" : "Consultant Created Successfully!"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {isEdit
                ? "The consultant's profile has been updated"
                : "The new consultant has been added to the database"}
            </p>
            <Button onClick={() => setShowSuccess(false)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
