"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Plus, Search, Edit, UserX, Upload, CheckCircle2, Lock } from "lucide-react";

type Role = "superadmin" | "admin" | "user";

interface Country {
  id: string;
  name: string;
  countryCode: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  active: boolean;
  image: string | null;
  countriesHandled: Country[];
  lastLogin: string | Date | null;
}

interface UsersManageProps {
  users: User[];
  countries: Country[];
}

const roleBadge: Record<Role, { label: string; className: string }> = {
  superadmin: { label: "Super Admin", className: "bg-red-500 hover:bg-red-600 text-white" },
  admin: { label: "Admin", className: "bg-blue-500 hover:bg-blue-600 text-white" },
  user: { label: "Talent", className: "bg-green-500 hover:bg-green-600 text-white" },
};

function countryFlag(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

function formatLastLogin(lastLogin: string | Date | null) {
  if (!lastLogin) return "Never";
  return new Date(lastLogin).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

export function UsersManage({ users: initialUsers, countries }: UsersManageProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successAction, setSuccessAction] = useState<"created" | "updated">("created");
  const [formData, setFormData] = useState(emptyFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleStatus = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const nextActive = !user.active;
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: nextActive }),
      });
      if (!res.ok) return;

      setUsers(users.map((u) => (u.id === userId ? { ...u, active: nextActive } : u)));
    } catch {
      // leave status unchanged if the request fails
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormError(null);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      password: "",
      confirmPassword: "",
      role: user.role,
      countryIds: user.countriesHandled.map((c) => c.id),
      image: user.image,
    });
    setShowAddUser(true);
  };

  const handleSave = async () => {
    setFormError(null);

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

        setUsers(users.map((user) => (user.id === editingUser.id ? { ...user, ...data } : user)));
        setShowAddUser(false);
        setEditingUser(null);
        setFormData(emptyFormData);
        setSuccessAction("updated");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
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

      setUsers([...users, data as User]);
      setShowAddUser(false);
      setEditingUser(null);
      setFormData(emptyFormData);
      setSuccessAction("created");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch {
      setFormError("Failed to create user");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesCountry = countryFilter === "all" || user.countriesHandled.some((c) => c.id === countryFilter);
    const matchesStatus = statusFilter === "all" || (statusFilter === "Active" ? user.active : !user.active);

    return matchesSearch && matchesRole && matchesCountry && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage user roles and access across all regions
          </p>
        </div>
        <Button onClick={() => {
          setEditingUser(null);
          setFormData(emptyFormData);
          setFormError(null);
          setShowAddUser(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-none shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">Talent</SelectItem>
                </SelectContent>
              </Select>

              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Table */}
      <Card className="border-none shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 pb-3 border-b font-medium text-sm text-muted-foreground">
              <div className="col-span-3">User</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Country</div>
              <div className="col-span-2">Last Login</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Table Rows */}
            {filteredUsers.map((user) => (
              <div key={user.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                {/* User Info */}
                <div className="col-span-3 flex items-center gap-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-500">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                {/* Role */}
                <div className="col-span-2">
                  <Badge className={roleBadge[user.role].className}>
                    {roleBadge[user.role].label}
                  </Badge>
                </div>

                {/* Country */}
                <div className="col-span-2">
                  {countries.length > 0 && user.countriesHandled.length === countries.length ? (
                    <Badge variant="outline">All Countries</Badge>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {user.countriesHandled.map((country) => (
                        <Badge key={country.id} variant="outline" className="text-xs">
                          {country.countryCode}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Last Login */}
                <div className="col-span-2 text-sm text-muted-foreground">
                  {formatLastLogin(user.lastLogin)}
                </div>

                {/* Status Toggle */}
                <div className="col-span-1">
                  <button
                    onClick={() => handleToggleStatus(user.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      user.active ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        user.active ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleToggleStatus(user.id)}
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No users found matching your filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
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
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
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
            <Button
              variant="outline"
              onClick={() => {
                setShowAddUser(false);
                setEditingUser(null);
                setFormError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                isSaving ||
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
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              {successAction === "updated" ? "User Updated Successfully!" : "User Created Successfully!"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {successAction === "updated"
                ? "User information has been updated"
                : "The new user account has been created and they will receive a welcome email"}
            </p>
            <Button onClick={() => setShowSuccess(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
