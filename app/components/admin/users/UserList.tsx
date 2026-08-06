"use client";

import { useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Plus, Search, Edit, UserX, Lock } from "lucide-react";
import type { Country, ManagedUser, Role } from "@/lib/usersManageData";

const roleBadge: Record<Role, { label: string; className: string }> = {
  superadmin: { label: "Super Admin", className: "bg-red-500 hover:bg-red-600 text-white" },
  admin: { label: "Admin", className: "bg-blue-500 hover:bg-blue-600 text-white" },
  user: { label: "Talent", className: "bg-green-500 hover:bg-green-600 text-white" },
};

const rolePriority: Record<Role, number> = {
  superadmin: 0,
  admin: 1,
  user: 2,
};

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

interface UserListProps {
  users: ManagedUser[];
  countries: Country[];
  onAddUser: () => void;
  onEditUser: (user: ManagedUser) => void;
  onToggleStatus: (userId: string) => void;
}

export function UserList({ users, countries, onAddUser, onEditUser, onToggleStatus }: UserListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesCountry = countryFilter === "all" || user.countriesHandled.some((c) => c.id === countryFilter);
    const matchesStatus = statusFilter === "all" || (statusFilter === "Active" ? user.active : !user.active);

    return matchesSearch && matchesRole && matchesCountry && matchesStatus;
  }).sort((a, b) => rolePriority[a.role] - rolePriority[b.role]);

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
        <Button onClick={onAddUser}>
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
                    onClick={() => onToggleStatus(user.id)}
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
                    onClick={() => onEditUser(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onToggleStatus(user.id)}
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
    </div>
  );
}
