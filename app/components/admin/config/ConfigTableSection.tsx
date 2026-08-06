"use client";

import { useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Edit, Plus } from "lucide-react";
import { ConfigFormModal } from "./ConfigFormModal";
import { ConfigSuccessModal } from "./ConfigSuccessModal";
import type { ConfigColumn, ConfigField, ConfigRow } from "./types";

interface ConfigTableSectionProps {
  title: string;
  singularLabel: string;
  apiPath: string;
  columns: ConfigColumn[];
  fields: ConfigField[];
  rows: ConfigRow[];
}

export function ConfigTableSection({ title, singularLabel, apiPath, columns, fields, rows: initialRows }: ConfigTableSectionProps) {
  const [rows, setRows] = useState<ConfigRow[]>(initialRows);
  const [showForm, setShowForm] = useState(false);
  const [editingRow, setEditingRow] = useState<ConfigRow | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successAction, setSuccessAction] = useState<"created" | "updated">("created");

  const gridTemplateColumns = `repeat(${columns.length}, minmax(0, 1fr)) 90px 96px`;

  const handleToggleActive = async (row: ConfigRow) => {
    const nextActive = !row.active;
    try {
      const res = await fetch(`${apiPath}/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: nextActive }),
      });
      if (!res.ok) return;

      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, active: nextActive } : r)));
    } catch {
      // leave status unchanged if the request fails
    }
  };

  const handleSaved = (savedRow: ConfigRow, action: "created" | "updated") => {
    setRows((prev) =>
      action === "updated"
        ? prev.map((r) => (r.id === savedRow.id ? { ...r, ...savedRow } : r))
        : [...prev, savedRow]
    );
    setEditingRow(null);
    setSuccessAction(action);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{title}</h2>
        <Button
          onClick={() => {
            setEditingRow(null);
            setShowForm(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add {singularLabel}
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div
              className="grid gap-4 pb-3 border-b font-medium text-sm text-muted-foreground"
              style={{ gridTemplateColumns }}
            >
              {columns.map((col) => (
                <div key={col.key}>{col.label}</div>
              ))}
              <div>Active</div>
              <div className="text-right">Actions</div>
            </div>

            {rows.map((row) => (
              <div
                key={row.id}
                className="grid gap-4 items-center py-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                style={{ gridTemplateColumns }}
              >
                {columns.map((col) => (
                  <div key={col.key} className="text-sm truncate">
                    {col.render ? col.render(row) : String(row[col.key] ?? "—")}
                  </div>
                ))}

                <div>
                  <button
                    onClick={() => handleToggleActive(row)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      row.active ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        row.active ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingRow(row);
                      setShowForm(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {rows.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No {title.toLowerCase()} found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfigFormModal
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingRow(null);
        }}
        editingRow={editingRow}
        singularLabel={singularLabel}
        apiPath={apiPath}
        fields={fields}
        onSaved={handleSaved}
      />

      <ConfigSuccessModal
        open={showSuccess}
        onOpenChange={setShowSuccess}
        action={successAction}
        label={singularLabel}
      />
    </div>
  );
}
