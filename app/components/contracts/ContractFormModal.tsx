"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Plus } from "lucide-react";
import type { ContractFormOptions, ContractListItem } from "@/lib/contractsData";

type AllowanceFrequency = "monthly" | "quarterly" | "yearly";

interface AllowanceFormRow {
  name: string;
  amountUsd: string;
  frequency: AllowanceFrequency;
}

const emptyFormData = {
  countryId: "",
  city: "",
  clientId: "",
  consultantId: "",
  contractTypeId: "",
  monthlySalary: "",
  gecoJoinDate: "",
  deploymentDate: "",
  contractstartDate: "",
  contractendDate: "",
  renewalDate: "",
  deploymentNote: "",
  allowances: [] as AllowanceFormRow[],
};

function toDateInputValue(iso: string) {
  return iso.slice(0, 10);
}

function formDataFromContract(contract: ContractListItem) {
  return {
    countryId: contract.countryId,
    city: contract.city,
    clientId: contract.clientId,
    consultantId: contract.consultantId,
    contractTypeId: contract.contractTypeId,
    monthlySalary: String(contract.monthlySalary),
    gecoJoinDate: toDateInputValue(contract.gecoJoinDate),
    deploymentDate: toDateInputValue(contract.deploymentDate),
    contractstartDate: toDateInputValue(contract.contractstartDate),
    contractendDate: toDateInputValue(contract.contractendDate),
    renewalDate: contract.renewalDate ? toDateInputValue(contract.renewalDate) : "",
    deploymentNote: contract.deploymentNote ?? "",
    allowances: contract.allowances.map((allowance) => ({
      name: allowance.name,
      amountUsd: String(allowance.amountUsd),
      frequency: allowance.frequency,
    })),
  };
}

interface ContractFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingContract: ContractListItem | null;
  options: ContractFormOptions;
  onSaved: (contract: ContractListItem, action: "created" | "updated") => void;
}

export function ContractFormModal({ open, onOpenChange, editingContract, options, onSaved }: ContractFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="contract-form-dialog max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingContract ? "Edit Contract" : "Add New Contract"}</DialogTitle>
        </DialogHeader>

        {open && (
          <ContractFormBody
            key={editingContract?.id ?? "new"}
            editingContract={editingContract}
            options={options}
            onCancel={() => onOpenChange(false)}
            onSaved={(contract, action) => {
              onOpenChange(false);
              onSaved(contract, action);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface ContractFormBodyProps {
  editingContract: ContractListItem | null;
  options: ContractFormOptions;
  onCancel: () => void;
  onSaved: (contract: ContractListItem, action: "created" | "updated") => void;
}

function ContractFormBody({ editingContract, options, onCancel, onSaved }: ContractFormBodyProps) {
  const [formData, setFormData] = useState(() =>
    editingContract ? formDataFromContract(editingContract) : emptyFormData
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddAllowance = () => {
    setFormData({
      ...formData,
      allowances: [...formData.allowances, { name: "", amountUsd: "", frequency: "monthly" }],
    });
  };

  const handleRemoveAllowance = (index: number) => {
    setFormData({
      ...formData,
      allowances: formData.allowances.filter((_, i) => i !== index),
    });
  };

  const handleAllowanceChange = (index: number, field: keyof AllowanceFormRow, value: string) => {
    const allowances = [...formData.allowances];
    allowances[index] = { ...allowances[index], [field]: value };
    setFormData({ ...formData, allowances });
  };

  const handleSave = async () => {
    setFormError(null);

    if (!formData.countryId || !formData.city || !formData.clientId || !formData.consultantId || !formData.contractTypeId) {
      setFormError("Country, city, client, consultant and contract type are required");
      return;
    }
    if (!formData.monthlySalary || Number(formData.monthlySalary) <= 0) {
      setFormError("Monthly salary must be greater than 0");
      return;
    }
    if (!formData.gecoJoinDate || !formData.deploymentDate || !formData.contractstartDate || !formData.contractendDate) {
      setFormError("Joining, deployment, start and end dates are required");
      return;
    }
    if (new Date(formData.contractendDate) <= new Date(formData.contractstartDate)) {
      setFormError("Contract end date must be after the start date");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(editingContract ? `/api/contracts/${editingContract.id}` : "/api/contracts", {
        method: editingContract ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryId: formData.countryId,
          city: formData.city,
          clientId: formData.clientId,
          consultantId: formData.consultantId,
          contractTypeId: formData.contractTypeId,
          monthlySalary: formData.monthlySalary,
          gecoJoinDate: formData.gecoJoinDate,
          deploymentDate: formData.deploymentDate,
          contractstartDate: formData.contractstartDate,
          contractendDate: formData.contractendDate,
          renewalDate: formData.renewalDate || null,
          deploymentNote: formData.deploymentNote || null,
          allowances: formData.allowances,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? `Failed to ${editingContract ? "update" : "create"} contract`);
        return;
      }

      onSaved(data as ContractListItem, editingContract ? "updated" : "created");
    } catch {
      setFormError(`Failed to ${editingContract ? "update" : "create"} contract`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 py-2">
      {/* Location and Client Selection */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="country">Country *</Label>
            <Select value={formData.countryId} onValueChange={(value) => setFormData({ ...formData, countryId: value })}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {options.countries.map((country) => (
                  <SelectItem key={country.id} value={country.id}>{country.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="e.g., Singapore"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client">Client *</Label>
            <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {options.clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="consultant">Consultant *</Label>
            <Select value={formData.consultantId} onValueChange={(value) => setFormData({ ...formData, consultantId: value })}>
              <SelectTrigger id="consultant">
                <SelectValue placeholder="Select consultant" />
              </SelectTrigger>
              <SelectContent>
                {options.consultants.map((consultant) => (
                  <SelectItem key={consultant.id} value={consultant.id}>
                    {consultant.name} - {consultant.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Contract Details */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold">Contract Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contractType">Contract Type *</Label>
            <Select value={formData.contractTypeId} onValueChange={(value) => setFormData({ ...formData, contractTypeId: value })}>
              <SelectTrigger id="contractType">
                <SelectValue placeholder="Select contract type" />
              </SelectTrigger>
              <SelectContent>
                {options.contractTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="salary">Monthly Salary (USD) *</Label>
            <Input
              id="salary"
              type="number"
              value={formData.monthlySalary}
              onChange={(e) => setFormData({ ...formData, monthlySalary: e.target.value })}
              placeholder="e.g., 5000"
            />
          </div>
        </div>
      </div>

      {/* Important Dates */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold">Important Dates</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="joiningDate">Joining Date with GECO *</Label>
            <Input
              id="joiningDate"
              type="date"
              value={formData.gecoJoinDate}
              onChange={(e) => setFormData({ ...formData, gecoJoinDate: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="deploymentDate">Deployment Date *</Label>
            <Input
              id="deploymentDate"
              type="date"
              value={formData.deploymentDate}
              onChange={(e) => setFormData({ ...formData, deploymentDate: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="renewalDate">Renewal Date</Label>
            <Input
              id="renewalDate"
              type="date"
              value={formData.renewalDate}
              onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Contract Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.contractstartDate}
              onChange={(e) => setFormData({ ...formData, contractstartDate: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="endDate">Contract End Date *</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.contractendDate}
              onChange={(e) => setFormData({ ...formData, contractendDate: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="deploymentNotes">Deployment Notes (Optional)</Label>
          <Textarea
            id="deploymentNotes"
            value={formData.deploymentNote}
            onChange={(e) => setFormData({ ...formData, deploymentNote: e.target.value })}
            placeholder="e.g., Delayed deployment due to client onboarding requirements"
            rows={2}
          />
        </div>
      </div>

      {/* Allowances */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Allowances</h3>
          <Button type="button" variant="outline" size="sm" onClick={handleAddAllowance}>
            <Plus className="h-3 w-3 mr-1" />
            Add Allowance
          </Button>
        </div>
        {formData.allowances.map((allowance, index) => (
          <div key={index} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-3 items-end">
            <div>
              <Label className={index === 0 ? "" : "sr-only"}>Type</Label>
              <Input
                placeholder="e.g., Transport, Housing, Meal"
                value={allowance.name}
                onChange={(e) => handleAllowanceChange(index, "name", e.target.value)}
              />
            </div>
            <div>
              <Label className={index === 0 ? "" : "sr-only"}>Amount (USD)</Label>
              <Input
                type="number"
                placeholder="Amount"
                value={allowance.amountUsd}
                onChange={(e) => handleAllowanceChange(index, "amountUsd", e.target.value)}
              />
            </div>
            <div>
              <Label className={index === 0 ? "" : "sr-only"}>Frequency</Label>
              <Select
                value={allowance.frequency}
                onValueChange={(value) => handleAllowanceChange(index, "frequency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveAllowance(index)}>
                ×
              </Button>
            </div>
          </div>
        ))}
      </div>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving
            ? (editingContract ? "Saving..." : "Creating...")
            : (editingContract ? "Save Changes" : "Create Contract")}
        </Button>
      </div>
    </div>
  );
}
