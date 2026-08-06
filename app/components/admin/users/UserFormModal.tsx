"use client";

import { useRef, useState } from "react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../ui/dialog";
import { Upload, CheckCircle2 } from "lucide-react";
import type { Country, ManagedUser, Role } from "@/lib/usersManageData";

function countryFlag(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

const emptyFormData = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "admin" as Role,
  countryIds: [] as string[],
  image: null as string | null,
};

function formDataFromUser(user: ManagedUser) {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    password: "",
    confirmPassword: "",
    role: user.role,
    countryIds: user.countriesHandled.map((c) => c.id),
    image: user.image,
  };
}

interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: ManagedUser | null;
  countries: Country[];
  onSaved: (user: ManagedUser, action: "created" | "updated") => void;
}

export function UserFormModal({ open, onOpenChange, editingUser, countries, onSaved }: UserFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingUser ? "Edit User" : "Add New User"}
          </DialogTitle>
          <DialogDescription>
            {editingUser
              ? "Update user information and permissions"
              : "Create a new user account with role and country assignment"}
          </DialogDescription>
        </DialogHeader>

        {/* Remounted fresh on every open so form state always starts from editingUser/emptyFormData */}
        {open && (
          <UserFormBody
            key={editingUser?.id ?? "new"}
            editingUser={editingUser}
            countries={countries}
            onCancel={() => onOpenChange(false)}
            onSaved={(user, action) => {
              onOpenChange(false);
              onSaved(user, action);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface UserFormBodyProps {
  editingUser: ManagedUser | null;
  countries: Country[];
  onCancel: () => void;
  onSaved: (user: ManagedUser, action: "created" | "updated") => void;
}

function UserFormBody({ editingUser, countries, onCancel, onSaved }: UserFormBodyProps) {
  const [formData, setFormData] = useState(() => (editingUser ? formDataFromUser(editingUser) : emptyFormData));
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

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

  const handleSave = async () => {
    setFormError(null);

    if (formData.role !== "superadmin" && formData.countryIds.length === 0) {
      setFormError("Please assign at least one country");
      return;
    }

    if (editingUser) {
      setIsSaving(true);
      try {
        const res = await fetch(`/api/users/${editingUser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            image: formData.image,
            role: formData.role,
            countryIds: formData.role === "superadmin"
              ? countries.map((c) => c.id)
              : formData.countryIds,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setFormError(data.error ?? "Failed to update user");
          return;
        }

        onSaved({ ...editingUser, ...data }, "updated");
      } catch {
        setFormError("Failed to update user");
      } finally {
        setIsSaving(false);
      }
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || null,
          image: formData.image,
          role: formData.role,
          countryIds: formData.role === "superadmin"
            ? countries.map((c) => c.id)
            : formData.countryIds,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Failed to create user");
        return;
      }

      onSaved(data as ManagedUser, "created");
    } catch {
      setFormError("Failed to create user");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-6 pt-4">
        {/* Section 1 - Basic Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Basic Information</h3>

          {/* Profile Photo */}
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

          {/* Name */}
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              className="mt-1"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="user@geco.asia"
              className="mt-1"
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+65 9123 4567"
              className="mt-1"
            />
          </div>

          {/* Password (create only) */}
          {!editingUser && (
            <>
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 8 characters"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  className="mt-1"
                />
              </div>
            </>
          )}
        </div>

        {/* Section 2 - Role */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold text-sm">Role & Permissions</h3>

          <div>
            <Label htmlFor="role">Role *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({
                ...formData,
                role: value as Role,
                countryIds: value === "superadmin" ? countries.map((c) => c.id) : formData.countryIds,
              })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="superadmin">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    Super Admin
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    Admin
                  </div>
                </SelectItem>
                <SelectItem value="user">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Talent
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Section 3 - Country Assignment */}
        {formData.role !== "superadmin" && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-sm">Country Assignment</h3>

            <div>
              <Label>Assign Countries * (Multiple Selection)</Label>
              <p className="text-xs text-muted-foreground mb-3">
                Select one or more countries the user can access
              </p>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {countries.map((country) => {
                  const isSelected = formData.countryIds.includes(country.id);
                  return (
                    <button
                      key={country.id}
                      type="button"
                      onClick={() => {
                        const newCountryIds = isSelected
                          ? formData.countryIds.filter((id) => id !== country.id)
                          : [...formData.countryIds, country.id];
                        setFormData({ ...formData, countryIds: newCountryIds });
                      }}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"
                      }`}>
                        {isSelected && (
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium">
                          {countryFlag(country.countryCode)} {country.name}
                        </div>
                        <div className="text-xs text-muted-foreground">{country.countryCode}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {formData.countryIds.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-medium text-blue-900 mb-1">
                    Selected: {formData.countryIds.length} {formData.countryIds.length === 1 ? "country" : "countries"}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {formData.countryIds.map((id) => {
                      const country = countries.find((c) => c.id === id);
                      return country ? (
                        <Badge key={id} variant="secondary" className="text-xs">
                          {country.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {formError && (
        <p className="text-sm text-red-600 pt-2">{formError}</p>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-6 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={
            isSaving ||
            isUploadingPhoto ||
            !formData.name ||
            !formData.email ||
            (!editingUser && (!formData.password || !formData.confirmPassword))
          }
        >
          {isSaving
            ? (editingUser ? "Saving..." : "Creating...")
            : (editingUser ? "Save Changes" : "Create User")}
        </Button>
      </div>
    </>
  );
}
