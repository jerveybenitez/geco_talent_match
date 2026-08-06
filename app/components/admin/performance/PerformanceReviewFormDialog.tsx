"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { mockConsultants } from "../../../data/mockData";
import { LinkGeneratorDialog } from "./LinkGeneratorDialog";

// Mock client list (same as in ContractManagement)
const mockClients = [
  "ABC Bank",
  "Tech Innovations Pte Ltd",
  "RetailCorp",
  "DesignHub Korea",
  "FinTech Solutions",
  "Healthcare Corp",
  "E-Commerce Global",
  "Manufacturing Inc",
  "Consulting Partners",
  "Digital Marketing Agency",
];

interface PerformanceReviewFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PerformanceReviewFormDialog({
  open,
  onOpenChange,
}: PerformanceReviewFormDialogProps) {
  const [showLinkGenerator, setShowLinkGenerator] =
    useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<string>("");
  const [selectedClient, setSelectedClient] =
    useState<string>("");
  const [selectedConsultant, setSelectedConsultant] =
    useState<string>("");
  const [reviewType, setReviewType] = useState<string>("");

  const consultant = mockConsultants.find(
    (c) => c.id === selectedConsultant,
  );

  const handleCreateReview = () => {
    // After creating review, show link generator
    setShowLinkGenerator(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Create New Performance Review
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manila, Philippines">
                      Manila, Philippines
                    </SelectItem>
                    <SelectItem value="Singapore">
                      Singapore
                    </SelectItem>
                    <SelectItem value="Bangkok, Thailand">
                      Bangkok, Thailand
                    </SelectItem>
                    <SelectItem value="Kuala Lumpur, Malaysia">
                      Kuala Lumpur, Malaysia
                    </SelectItem>
                    <SelectItem value="Jakarta, Indonesia">
                      Jakarta, Indonesia
                    </SelectItem>
                    <SelectItem value="Ho Chi Minh, Vietnam">
                      Ho Chi Minh, Vietnam
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                <Select
                  value={selectedClient}
                  onValueChange={setSelectedClient}
                >
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClients.map((client, idx) => (
                      <SelectItem key={idx} value={client}>
                        {client}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultant">
                  Select Consultant *
                </Label>
                <Select
                  value={selectedConsultant}
                  onValueChange={setSelectedConsultant}
                >
                  <SelectTrigger id="consultant">
                    <SelectValue placeholder="Choose consultant" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockConsultants.map((consultant) => (
                      <SelectItem
                        key={consultant.id}
                        value={consultant.id}
                      >
                        {consultant.name} - {consultant.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-type">
                  Review Type *
                </Label>
                <Select
                  value={reviewType}
                  onValueChange={setReviewType}
                >
                  <SelectTrigger id="review-type">
                    <SelectValue placeholder="Choose review type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quarterly">
                      Quarterly Review
                    </SelectItem>
                    <SelectItem value="Semi-Annual">
                      Semi-Annual Review
                    </SelectItem>
                    <SelectItem value="Probation">
                      Probation Review
                    </SelectItem>
                    <SelectItem value="Annual">
                      Annual Review
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date *</Label>
                <Input id="due-date" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-email">
                  Client/Manager Email
                </Label>
                <Input
                  id="client-email"
                  type="email"
                  placeholder="client@company.com"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  A secure link will be sent to this email for
                  completing the review
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateReview}
                disabled={
                  !selectedLocation ||
                  !selectedClient ||
                  !selectedConsultant ||
                  !reviewType
                }
              >
                Create & Generate Links
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {consultant && (
        <LinkGeneratorDialog
          open={showLinkGenerator}
          onOpenChange={(open) => {
            setShowLinkGenerator(open);
            if (!open) {
              onOpenChange(false);
            }
          }}
          type="performance-review"
          recipientName={consultant.name}
          recipientEmail={consultant.email}
        />
      )}
    </>
  );
}