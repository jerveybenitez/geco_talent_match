"use client";

import { Button } from "../../ui/button";
import { Dialog, DialogContent } from "../../ui/dialog";
import { CheckCircle2 } from "lucide-react";

interface PerformanceReviewSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PerformanceReviewSuccessModal({ open, onOpenChange }: PerformanceReviewSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Draft Saved Successfully!</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Your changes have been saved as a draft
          </p>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
