"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import type { ConfigField, ConfigRow } from "./types";

interface ConfigFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRow: ConfigRow | null;
  singularLabel: string;
  apiPath: string;
  fields: ConfigField[];
  onSaved: (row: ConfigRow, action: "created" | "updated") => void;
}

export function ConfigFormModal({ open, onOpenChange, editingRow, singularLabel, apiPath, fields, onSaved }: ConfigFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingRow ? `Edit ${singularLabel}` : `Add New ${singularLabel}`}
          </DialogTitle>
        </DialogHeader>

        {open && (
          <ConfigFormBody
            key={editingRow?.id ?? "new"}
            editingRow={editingRow}
            singularLabel={singularLabel}
            apiPath={apiPath}
            fields={fields}
            onCancel={() => onOpenChange(false)}
            onSaved={(row, action) => {
              onOpenChange(false);
              onSaved(row, action);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface ConfigFormBodyProps {
  editingRow: ConfigRow | null;
  singularLabel: string;
  apiPath: string;
  fields: ConfigField[];
  onCancel: () => void;
  onSaved: (row: ConfigRow, action: "created" | "updated") => void;
}

function ConfigFormBody({ editingRow, singularLabel, apiPath, fields, onCancel, onSaved }: ConfigFormBodyProps) {
  const [formData, setFormData] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.key, editingRow ? String(editingRow[field.key] ?? "") : ""]))
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const missingRequired = fields.some((field) => field.required !== false && !formData[field.key]?.trim());

  const handleSave = async () => {
    setFormError(null);

    if (missingRequired) {
      setFormError("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(editingRow ? `${apiPath}/${editingRow.id}` : apiPath, {
        method: editingRow ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? `Failed to ${editingRow ? "update" : "create"} ${singularLabel.toLowerCase()}`);
        return;
      }

      onSaved(editingRow ? { ...editingRow, ...data } : (data as ConfigRow), editingRow ? "updated" : "created");
    } catch {
      setFormError(`Failed to ${editingRow ? "update" : "create"} ${singularLabel.toLowerCase()}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-4 py-2">
        {fields.map((field) => (
          <div key={field.key}>
            <Label htmlFor={field.key}>
              {field.label}
              {field.required !== false && " *"}
            </Label>
            {field.type === "textarea" ? (
              <Textarea
                id={field.key}
                value={formData[field.key]}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="mt-1"
              />
            ) : (
              <Input
                id={field.key}
                value={formData[field.key]}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="mt-1"
              />
            )}
          </div>
        ))}
      </div>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving || missingRequired}>
          {isSaving
            ? (editingRow ? "Saving..." : "Creating...")
            : (editingRow ? "Save Changes" : `Create ${singularLabel}`)}
        </Button>
      </div>
    </>
  );
}
