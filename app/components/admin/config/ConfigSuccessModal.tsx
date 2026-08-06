"use client";

import { Button } from "../../ui/button";
import { Dialog, DialogContent } from "../../ui/dialog";
import { CheckCircle2 } from "lucide-react";

interface ConfigSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "created" | "updated";
  label: string;
}

export function ConfigSuccessModal({ open, onOpenChange, action, label }: ConfigSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">
            {action === "updated" ? `${label} Updated Successfully!` : `${label} Created Successfully!`}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {action === "updated"
              ? `The ${label.toLowerCase()} has been updated`
              : `The new ${label.toLowerCase()} has been added`}
          </p>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
