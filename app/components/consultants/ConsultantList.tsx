"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Search, MapPin, CheckCircle, Shield } from "lucide-react";
import { mockConsultants } from "../../data/mockData";
import { ImageWithFallback } from "../ui/ImageWithFallback";
import { AddConsultantModal } from "./AddConsultantModal";

interface ConsultantListProps {
  initialLocationFilter?: string;
}

export function ConsultantList({ initialLocationFilter = "all" }: ConsultantListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState(initialLocationFilter);

  const filteredConsultants = mockConsultants.filter(consultant => {
    const matchesSearch = consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          consultant.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          consultant.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || consultant.status === statusFilter;
    const matchesLocation = locationFilter === "all" || consultant.location.includes(locationFilter);
    return matchesSearch && matchesStatus && matchesLocation;
  });

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Consultant Database</h2>
        <AddConsultantModal />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Consultants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Name, role, or skills..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Committed">Committed</SelectItem>
                  <SelectItem value="Former">Former</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger id="location">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Manila">Manila</SelectItem>
                  <SelectItem value="Singapore">Singapore</SelectItem>
                  <SelectItem value="Bangkok">Bangkok</SelectItem>
                  <SelectItem value="Kuala Lumpur">Kuala Lumpur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consultant Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredConsultants.map((consultant) => (
          <Card key={consultant.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <ImageWithFallback
                  src={consultant.photo}
                  alt={consultant.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{consultant.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{consultant.role}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{consultant.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex flex-wrap gap-1">
                  {consultant.skills.slice(0, 3).map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <Badge
                  variant={
                    consultant.status === 'Available' ? 'default' :
                    consultant.status === 'Committed' ? 'secondary' :
                    'outline'
                  }
                >
                  {consultant.status}
                </Badge>
                {consultant.status !== 'Former' && (
                  <span className="text-xs text-muted-foreground">
                    Until {new Date(consultant.contractExpiry).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {consultant.profileCompleted && (
                  <Badge variant="outline" className="text-xs border-green-500 text-green-700 bg-green-50">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Profile Completed
                  </Badge>
                )}
                {consultant.orientationCompleted && (
                  <Badge variant="outline" className="text-xs border-blue-500 text-blue-700 bg-blue-50">
                    <Shield className="h-3 w-3 mr-1" />
                    Orientation Completed
                  </Badge>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  asChild
                >
                  <Link href={`/admin/consultants/${consultant.id}`}>
                    View Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
