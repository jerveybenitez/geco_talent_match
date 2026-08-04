"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Plus,
  Search,
  Edit,
  UserX,
  Upload,
  CheckCircle2,
  Lock,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin";
  countries: ("SG" | "PH" | "MY" | "TH" | "ID" | "VN" | "ALL")[];
  status: "Active" | "Inactive";
  lastLogin: string;
  photo: string;
  phone?: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Tricia Almodiente",
    email: "tricia.almodiente@geco.asia",
    role: "Super Admin",
    countries: ["ALL"],
    status: "Active",
    lastLogin: "2026-02-11 09:30",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    phone: "+63 917 123 4567"
  },
  {
    id: "2",
    name: "Gareth Tan",
    email: "gareth.tan@geco.asia",
    role: "Admin",
    countries: ["SG", "MY"],
    status: "Active",
    lastLogin: "2026-02-11 08:15",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    phone: "+65 9123 4567"
  },
  {
    id: "3",
    name: "Maria Santos",
    email: "maria.santos@geco.asia",
    role: "Admin",
    countries: ["PH"],
    status: "Active",
    lastLogin: "2026-02-10 16:45",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    phone: "+63 917 234 5678"
  },
  {
    id: "4",
    name: "Ahmad Rahman",
    email: "ahmad.rahman@geco.asia",
    role: "Admin",
    countries: ["MY", "TH", "ID"],
    status: "Active",
    lastLogin: "2026-02-11 07:20",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    phone: "+60 12 345 6789"
  },
];

const countryNames: Record<string, string> = {
  SG: "Singapore",
  PH: "Philippines",
  MY: "Malaysia",
  TH: "Thailand",
  ID: "Indonesia",
  VN: "Vietnam",
  ALL: "All Countries"
};

export function UsersManage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Admin" as User["role"],
    countries: ["SG"] as User["countries"],
    photo: ""
  });

  const getRoleBadgeColor = (role: User["role"]) => {
    switch (role) {
      case "Super Admin":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "Admin":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      default:
        return "bg-gray-500";
    }
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" as "Active" | "Inactive" }
        : user
    ));
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      countries: user.countries,
      photo: user.photo
    });
    setShowAddUser(true);
  };

  const handleSave = () => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      ));
    } else {
      // Create new user
      const newUser: User = {
        id: (users.length + 1).toString(),
        ...formData,
        status: "Active",
        lastLogin: "Never",
      };
      setUsers([...users, newUser]);
    }
    
    setShowAddUser(false);
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "Admin",
      countries: ["SG"],
      photo: ""
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesCountry = countryFilter === "all" || user.countries.includes(countryFilter);
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
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
          setFormData({
            name: "",
            email: "",
            phone: "",
            role: "Admin",
            countries: ["SG"],
            photo: ""
          });
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
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>

              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="SG">Singapore</SelectItem>
                  <SelectItem value="PH">Philippines</SelectItem>
                  <SelectItem value="MY">Malaysia</SelectItem>
                  <SelectItem value="TH">Thailand</SelectItem>
                  <SelectItem value="ID">Indonesia</SelectItem>
                  <SelectItem value="VN">Vietnam</SelectItem>
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
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                {/* Role */}
                <div className="col-span-2">
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                </div>

                {/* Country */}
                <div className="col-span-2">
                  {user.countries.includes("ALL") ? (
                    <Badge variant="outline">All Countries</Badge>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {user.countries.map((code) => (
                        <Badge key={code} variant="outline" className="text-xs">
                          {code}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Last Login */}
                <div className="col-span-2 text-sm text-muted-foreground">
                  {user.lastLogin}
                </div>

                {/* Status Toggle */}
                <div className="col-span-1">
                  <button
                    onClick={() => handleToggleStatus(user.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      user.status === "Active" ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        user.status === "Active" ? "translate-x-6" : "translate-x-1"
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
                  {formData.photo ? (
                    <img
                      src={formData.photo}
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
                    role: value as User["role"],
                    countries: value === "Super Admin" ? ["ALL"] : formData.countries
                  })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Super Admin">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        Super Admin
                      </div>
                    </SelectItem>
                    <SelectItem value="Admin">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Admin
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Section 3 - Country Assignment */}
            {formData.role !== "Super Admin" && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-sm">Country Assignment</h3>
                
                <div>
                  <Label>Assign Countries * (Multiple Selection)</Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Select one or more countries the user can access
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {[
                      { code: "SG", name: "Singapore", flag: "🇸🇬" },
                      { code: "PH", name: "Philippines", flag: "🇵🇭" },
                      { code: "MY", name: "Malaysia", flag: "🇲🇾" },
                      { code: "TH", name: "Thailand", flag: "🇹🇭" },
                      { code: "ID", name: "Indonesia", flag: "🇮🇩" },
                      { code: "VN", name: "Vietnam", flag: "🇻🇳" },
                    ].map((country) => {
                      const isSelected = formData.countries.includes(country.code as any);
                      return (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            const newCountries = isSelected
                              ? formData.countries.filter(c => c !== country.code)
                              : [...formData.countries.filter(c => c !== "ALL"), country.code];
                            setFormData({ 
                              ...formData, 
                              countries: newCountries.length > 0 ? newCountries as User["countries"] : ["SG"]
                            });
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
                              {country.flag} {country.name}
                            </div>
                            <div className="text-xs text-muted-foreground">{country.code}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {formData.countries.length > 0 && !formData.countries.includes("ALL") && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs font-medium text-blue-900 mb-1">
                        Selected: {formData.countries.length} {formData.countries.length === 1 ? "country" : "countries"}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {formData.countries.map((code) => (
                          <Badge key={code} variant="secondary" className="text-xs">
                            {countryNames[code]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddUser(false);
                setEditingUser(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.name || !formData.email}
            >
              {editingUser ? "Save Changes" : "Create User"}
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
              {editingUser ? "User Updated Successfully!" : "User Created Successfully!"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {editingUser 
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