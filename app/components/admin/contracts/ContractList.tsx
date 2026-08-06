"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Search, Plus } from "lucide-react";
import { ContractFormModal } from "./ContractFormModal";
import { ContractSuccessModal } from "./ContractSuccessModal";
import type { ContractFormOptions, ContractListItem, ContractStatus } from "@/lib/contractsData";

const statusBadgeVariant: Record<ContractStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Active: "default",
  "Pending Renewal": "secondary",
  Expired: "destructive",
  Inactive: "outline",
};

interface ContractListProps {
  contracts: ContractListItem[];
  options: ContractFormOptions;
}

export function ContractList({ contracts: initialContracts, options }: ContractListProps) {
  const [contracts, setContracts] = useState<ContractListItem[]>(initialContracts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successAction, setSuccessAction] = useState<"created" | "updated">("created");

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.consultantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;
    const matchesCountry = countryFilter === "all" || contract.countryId === countryFilter;
    return matchesSearch && matchesStatus && matchesCountry;
  });

  const handleSaved = (saved: ContractListItem, action: "created" | "updated") => {
    setContracts((prev) =>
      action === "updated" ? prev.map((c) => (c.id === saved.id ? saved : c)) : [saved, ...prev]
    );
    setSuccessAction(action);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contract Management</h2>
          <p className="text-muted-foreground">Manage consultant contracts and track renewals</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Contract
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Consultant or client..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending Renewal">Pending Renewal</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger id="country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {options.countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>{country.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Consultant</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Contract Type</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Renewal Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.consultantName}</TableCell>
                  <TableCell>{contract.client}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{contract.contractType}</Badge>
                  </TableCell>
                  <TableCell>{contract.positionName}</TableCell>
                  <TableCell>{new Date(contract.contractstartDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(contract.contractendDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {contract.renewalDate ? new Date(contract.renewalDate).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant[contract.status]}>{contract.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/contracts/${contract.id}`}>View Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filteredContracts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    No contracts found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ContractFormModal
        open={showForm}
        onOpenChange={setShowForm}
        editingContract={null}
        options={options}
        onSaved={handleSaved}
      />

      <ContractSuccessModal open={showSuccess} onOpenChange={setShowSuccess} action={successAction} />
    </div>
  );
}
