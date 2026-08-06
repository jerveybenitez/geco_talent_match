"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Edit, Calendar, DollarSign, Briefcase, Mail, Phone, MapPin, History, AlertCircle } from "lucide-react";
import type { ContractDetail as ContractDetailData, ContractFormOptions, ContractListItem, ContractStatus } from "@/lib/contractsData";
import { ContractFormModal } from "./ContractFormModal";

const statusBadgeVariant: Record<ContractStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Active: "default",
  "Pending Renewal": "secondary",
  Expired: "destructive",
  Inactive: "outline",
};

function monthsBetween(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.max(
    0,
    (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth())
  );
}

interface ContractDetailProps {
  contract: ContractDetailData;
  options: ContractFormOptions;
}

export function ContractDetail({ contract: initialContract, options }: ContractDetailProps) {
  const [contract, setContract] = useState<ContractDetailData>(initialContract);
  const [showForm, setShowForm] = useState(false);

  const handleSaved = (saved: ContractListItem) => {
    setContract((prev) => ({ ...prev, ...saved }));
  };

  const totalAllowances = contract.allowances.reduce((sum, allowance) => sum + allowance.amountUsd, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/admin/contracts">← Back to Contracts</Link>
        </Button>
        <Button onClick={() => setShowForm(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Contract
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                <Link href={`/admin/consultants/${contract.consultantId}`} className="hover:underline">
                  {contract.consultantName}
                </Link>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{contract.jobRole}</p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {contract.client}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {contract.city}, {contract.country}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {contract.consultantEmail}
                </span>
                {contract.consultantPhone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {contract.consultantPhone}
                  </span>
                )}
              </div>
            </div>
            <Badge variant={statusBadgeVariant[contract.status]}>{contract.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">Contract Type</p>
              <div className="mt-1">
                <Badge variant="outline" className="text-lg px-3 py-1">{contract.contractType}</Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Contract Duration
              </p>
              <div className="text-2xl font-bold mt-1">
                {monthsBetween(contract.contractstartDate, contract.contractendDate)} months
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Other Engagements</p>
              <div className="text-2xl font-bold mt-1">{contract.history.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Important Dates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Joining Date with GECO</p>
              <div className="text-lg font-semibold mt-1">{new Date(contract.gecoJoinDate).toLocaleDateString()}</div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Deployment Date</p>
              <div className="text-lg font-semibold mt-1">{new Date(contract.deploymentDate).toLocaleDateString()}</div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Renewal Date</p>
              <div className="text-lg font-semibold mt-1">
                {contract.renewalDate ? new Date(contract.renewalDate).toLocaleDateString() : "N/A"}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contract Start</p>
              <div className="text-lg font-semibold mt-1">{new Date(contract.contractstartDate).toLocaleDateString()}</div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contract End</p>
              <div className="text-lg font-semibold mt-1">{new Date(contract.contractendDate).toLocaleDateString()}</div>
            </div>
          </div>

          {contract.deploymentNote && (
            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mt-6">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-yellow-900">Deployment Notes</p>
                <p className="text-yellow-800">{contract.deploymentNote}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compensation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Compensation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Monthly Salary</p>
                <div className="text-2xl font-bold mt-1">${contract.monthlySalary.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Total Allowances</p>
                <div className="text-2xl font-bold mt-1">${totalAllowances.toLocaleString()}/mo</div>
                <p className="text-xs text-muted-foreground mt-1">{contract.allowances.length} allowance(s)</p>
              </CardContent>
            </Card>
          </div>

          {contract.allowances.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Allowances Breakdown</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Frequency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contract.allowances.map((allowance) => (
                    <TableRow key={allowance.id}>
                      <TableCell className="font-medium">{allowance.name}</TableCell>
                      <TableCell>${allowance.amountUsd.toLocaleString()}</TableCell>
                      <TableCell className="capitalize">{allowance.frequency}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Other contracts for this consultant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Other Contracts for {contract.consultantName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contract.history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No other contracts on record for this consultant.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Monthly Salary</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contract.history.map((past) => (
                  <TableRow key={past.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <Link href={`/admin/contracts/${past.id}`} className="hover:underline">
                        {past.client}
                      </Link>
                    </TableCell>
                    <TableCell>{new Date(past.contractstartDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(past.contractendDate).toLocaleDateString()}</TableCell>
                    <TableCell>${past.monthlySalary.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant[past.status]}>{past.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ContractFormModal
        open={showForm}
        onOpenChange={setShowForm}
        editingContract={contract}
        options={options}
        onSaved={handleSaved}
      />
    </div>
  );
}
