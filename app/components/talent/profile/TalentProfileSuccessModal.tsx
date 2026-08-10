"use client";

import { Button } from "../../ui/button";
import { Dialog, DialogContent } from "../../ui/dialog";
import { CheckCircle2 } from "lucide-react";

interface TalentProfileSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TalentProfileSuccessModal({ open, onOpenChange }: TalentProfileSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Profile Updated Successfully!</h3>
          <p className="text-sm text-muted-foreground mb-6">Your profile information has been saved.</p>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
