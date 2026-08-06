"use client";

import { useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Copy, Check, Link, Mail } from "lucide-react";

interface LinkGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'orientation' | 'performance-review' | 'exit-interview';
  recipientEmail?: string;
  recipientName?: string;
}

export function LinkGeneratorDialog({ 
  open, 
  onOpenChange, 
  type, 
  recipientEmail,
  recipientName 
}: LinkGeneratorDialogProps) {
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const generateLink = () => {
    const baseUrl = window.location.origin;
    const token = Math.random().toString(36).substring(2, 15);
    
    switch (type) {
      case 'orientation':
        return `${baseUrl}/onboarding/orientation/${token}`;
      case 'performance-review':
        return `${baseUrl}/performance/review/${token}`;
      case 'exit-interview':
        return `${baseUrl}/offboarding/exit-interview/${token}`;
      default:
        return '';
    }
  };

  const link = generateLink();

  const getTitle = () => {
    switch (type) {
      case 'orientation':
        return 'HR Orientation Link';
      case 'performance-review':
        return 'Performance Review Link';
      case 'exit-interview':
        return 'Exit Interview Link';
      default:
        return 'Shareable Link';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'orientation':
        return 'Share this link with the new consultant to access their HR orientation materials, videos, and acknowledgment forms. The link will be valid for 30 days.';
      case 'performance-review':
        return 'Share this link with the consultant/client to complete their performance review form. They can access it without logging into the system.';
      case 'exit-interview':
        return 'Share this link with the departing consultant to complete their exit interview. All responses will be recorded and analyzed.';
      default:
        return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    // Simulate sending email
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            {getTitle()}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            {getDescription()}
          </p>

          {recipientName && (
            <div>
              <Label>Recipient</Label>
              <div className="mt-1 text-sm font-medium">{recipientName}</div>
              {recipientEmail && (
                <div className="text-sm text-muted-foreground">{recipientEmail}</div>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="generated-link">Generated Link</Label>
            <div className="flex gap-2 mt-2">
              <Input 
                id="generated-link"
                value={link} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-xs text-green-600 mt-1">✓ Link copied to clipboard</p>
            )}
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="text-sm space-y-2">
                <p className="font-medium text-blue-900">What the recipient can do:</p>
                <ul className="list-disc list-inside text-blue-800 space-y-1">
                  {type === 'orientation' && (
                    <>
                      <li>Watch orientation videos</li>
                      <li>Download policy documents</li>
                      <li>Complete acknowledgment forms</li>
                      <li>Request live Q&A with HR</li>
                    </>
                  )}
                  {type === 'performance-review' && (
                    <>
                      <li>Complete self-assessment ratings</li>
                      <li>Provide feedback on achievements</li>
                      <li>Set development goals</li>
                      <li>Submit the form securely</li>
                    </>
                  )}
                  {type === 'exit-interview' && (
                    <>
                      <li>Answer exit interview questions</li>
                      <li>Provide feedback on experience</li>
                      <li>Share improvement suggestions</li>
                      <li>Submit responses anonymously</li>
                    </>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            {recipientEmail && (
              <Button 
                className="flex-1"
                onClick={handleSendEmail}
                disabled={emailSent}
              >
                {emailSent ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Email Sent!
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send via Email
                  </>
                )}
              </Button>
            )}
          </div>

          {emailSent && (
            <p className="text-xs text-green-600 text-center">
              ✓ Email sent successfully to {recipientEmail}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
