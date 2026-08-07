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
import { LinkGeneratorDialog } from "./LinkGeneratorDialog";
import { REVIEW_TYPE_LABELS } from "@/lib/performanceTypes";
import type { PerformanceReviewFormOptions, PerformanceReviewItem } from "@/lib/performanceTypes";

interface PerformanceReviewFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: PerformanceReviewFormOptions;
  onCreated: (review: PerformanceReviewItem) => void;
}

export function PerformanceReviewFormDialog({
  open,
  onOpenChange,
  options,
  onCreated,
}: PerformanceReviewFormDialogProps) {
  const [showLinkGenerator, setShowLinkGenerator] = useState(false);
  const [createdReview, setCreatedReview] = useState<PerformanceReviewItem | null>(null);
  const [countryId, setCountryId] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");
  const [consultantId, setConsultantId] = useState<string>("");
  const [reviewType, setReviewType] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const consultant = options.consultants.find((c) => c.id === consultantId);

  const resetForm = () => {
    setCountryId("");
    setClientId("");
    setConsultantId("");
    setReviewType("");
    setDueDate("");
    setClientEmail("");
    setError(null);
  };

  const handleCreateReview = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/performance-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewType, consultantId, clientId, countryId, dueDate, clientEmail }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to create the review");
      }
      const created = (await res.json()) as PerformanceReviewItem;

      const link = `${window.location.origin}/performance/review/${created.id}`;
      const linkRes = await fetch(`/api/performance-reviews/${created.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkGenerate: link }),
      });
      const withLink = linkRes.ok ? ((await linkRes.json()) as PerformanceReviewItem) : { ...created, linkGenerate: link };

      onCreated(withLink);
      setCreatedReview(withLink);
      setShowLinkGenerator(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create the review");
    } finally {
      setSubmitting(false);
    }
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
                  value={countryId}
                  onValueChange={setCountryId}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.countries.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                <Select
                  value={clientId}
                  onValueChange={setClientId}
                >
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
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
                  value={consultantId}
                  onValueChange={setConsultantId}
                >
                  <SelectTrigger id="consultant">
                    <SelectValue placeholder="Choose consultant" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.consultants.map((consultant) => (
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
                    {Object.entries(REVIEW_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label} Review
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date *</Label>
                <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-email">
                  Client/Manager Email *
                </Label>
                <Input
                  id="client-email"
                  type="email"
                  placeholder="client@company.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  A secure link will be sent to this email for
                  completing the review
                </p>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

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
                  submitting ||
                  !countryId ||
                  !clientId ||
                  !consultantId ||
                  !reviewType ||
                  !dueDate ||
                  !clientEmail
                }
              >
                Create & Generate Links
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {consultant && createdReview && (
        <LinkGeneratorDialog
          open={showLinkGenerator}
          onOpenChange={(open) => {
            setShowLinkGenerator(open);
            if (!open) {
              onOpenChange(false);
              resetForm();
              setCreatedReview(null);
            }
          }}
          type="performance-review"
          link={createdReview.linkGenerate ?? undefined}
          recipientName={consultant.name}
          recipientEmail={consultant.email}
        />
      )}
    </>
  );
}
