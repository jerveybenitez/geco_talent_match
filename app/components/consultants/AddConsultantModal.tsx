"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Upload, UserPlus } from "lucide-react";

export function AddConsultantModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Consultant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Consultant</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <Label>Profile Photo</Label>
              <div className="mt-2 flex items-center gap-4">
                { false ? (
                  <img
                    src={""}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
              </div>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" placeholder="Enter full name" />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" placeholder="email@example.com" />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" placeholder="+XX XXX XXX XXXX" />
            </div>
            <div>
              <Label htmlFor="role">Role/Position *</Label>
              <Input id="role" placeholder="e.g., Senior Business Analyst" />
            </div>
            <div>
              <Label htmlFor="years-exp">Years of Experience *</Label>
              <Input id="years-exp" type="number" placeholder="5" />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="e.g., Bangkok" />
            </div>
            <div>
              <Label htmlFor="country">Country *</Label>
              <Select>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Philippines">Philippines</SelectItem>
                  <SelectItem value="Singapore">Singapore</SelectItem>
                  <SelectItem value="Thailand">Thailand</SelectItem>
                  <SelectItem value="Malaysia">Malaysia</SelectItem>
                  <SelectItem value="Indonesia">Indonesia</SelectItem>
                  <SelectItem value="Vietnam">Vietnam</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="status">Status *</Label>
              <Select>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Committed">Committed</SelectItem>
                  <SelectItem value="Former">Former</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea id="bio" placeholder="Brief professional summary..." rows={3} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input id="skills" placeholder="e.g., Python, SQL, Data Analysis, Tableau" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="industry">Industries (comma-separated)</Label>
              <Input id="industry" placeholder="e.g., Finance, Healthcare, Technology" />
            </div>
            <div>
              <Label htmlFor="availability">Available From</Label>
              <Input id="availability" type="date" />
            </div>
            <div>
              <Label htmlFor="contract-expiry">Contract Expiry (if applicable)</Label>
              <Input id="contract-expiry" type="date" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="linkedin">LinkedIn Profile</Label>
              <Input id="linkedin" placeholder="linkedin.com/in/..." />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>
              Add Consultant
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
