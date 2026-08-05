"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  Linkedin,
  Star,
  TrendingUp,
  Upload,
  FileText,
  Award,
  Plus,
  UserPlus,
  CheckCircle,
  Shield
} from "lucide-react";
import { mockConsultants, Consultant } from "../data/mockData";
import { ImageWithFallback } from "./ui/ImageWithFallback";

interface ConsultantDatabaseProps {
  initialLocationFilter?: string;
}

interface ConsultantsProps {
  countries?: Array<{
    country: string;
    countryId: string;
    code: string;
    consultants: unknown[];
  }>;
  overalls?: {
    activeContracts: number;
    totalConsultants: number;
    expiringContracts: number;
  };
  contractRenewals?: Array<{
    contractId: string;
    consultantId: string;
    consultantName: string;
    endDate: Date;
  }>;
  contractExpiration?: Array<{
    month: string;
    count: number;
  }>;
}

export function Consultants(_props: ConsultantsProps) {
  return <ConsultantDatabase />;
}

export function ConsultantDatabase({ initialLocationFilter = 'all' }: ConsultantDatabaseProps) {
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState(initialLocationFilter);
  const [showAddConsultant, setShowAddConsultant] = useState(false);

  const filteredConsultants = mockConsultants.filter(consultant => {
    const matchesSearch = consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          consultant.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          consultant.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || consultant.status === statusFilter;
    const matchesLocation = locationFilter === "all" || consultant.location.includes(locationFilter);
    return matchesSearch && matchesStatus && matchesLocation;
  });

  if (selectedConsultant) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedConsultant(null)}>
            ← Back to List
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">Edit Profile</Button>
          </div>
        </div>

        {/* Hero Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-6">
              <ImageWithFallback 
                src={selectedConsultant.photo} 
                alt={selectedConsultant.name}
                className="w-32 h-32 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">{selectedConsultant.name}</h1>
                    <p className="text-xl text-muted-foreground mt-1">{selectedConsultant.role}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge 
                      variant={
                        selectedConsultant.status === 'Available' ? 'default' : 
                        selectedConsultant.status === 'Committed' ? 'secondary' : 
                        'outline'
                      }
                    >
                      {selectedConsultant.status}
                    </Badge>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {selectedConsultant.profileCompleted && (
                        <Badge variant="outline" className="text-xs border-green-500 text-green-700 bg-green-50">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Profile Completed
                        </Badge>
                      )}
                      {selectedConsultant.orientationCompleted && (
                        <Badge variant="outline" className="text-xs border-blue-500 text-blue-700 bg-blue-50">
                          <Shield className="h-3 w-3 mr-1" />
                          Orientation Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">{selectedConsultant.bio}</p>
                <div className="flex gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {selectedConsultant.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {selectedConsultant.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {selectedConsultant.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                    <a href={`https://${selectedConsultant.linkedIn}`} className="text-blue-500 hover:underline">
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Work History</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedConsultant.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Industries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedConsultant.industry.map((ind, idx) => (
                      <Badge key={idx} variant="outline">{ind}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedConsultant.languages.map((lang, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{lang.language}</span>
                        <Badge variant="secondary">{lang.proficiency}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedConsultant.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedConsultant.yearsOfExperience} years</div>
                <p className="text-sm text-muted-foreground mt-1">Total professional experience</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-2 border-blue-500 pl-4 py-2">
                    <div className="font-medium">Senior Business Analyst</div>
                    <div className="text-sm text-muted-foreground">ABC Bank • 24 months</div>
                    <div className="text-sm text-muted-foreground">2024 - Present</div>
                    <p className="text-sm mt-2">Led digital transformation initiatives and process optimization projects.</p>
                  </div>
                  <div className="border-l-2 border-gray-300 pl-4 py-2">
                    <div className="font-medium">Business Analyst</div>
                    <div className="text-sm text-muted-foreground">Healthcare Corp • 18 months</div>
                    <div className="text-sm text-muted-foreground">2022 - 2024</div>
                    <p className="text-sm mt-2">Implemented data analytics solutions for patient care optimization.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Semi-Annual Review - 2025</div>
                      <div className="text-sm text-muted-foreground">Client Rating: 4.5/5.0</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">4.5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Annual Review - 2024</div>
                      <div className="text-sm text-muted-foreground">Client Rating: 4.3/5.0</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">4.3</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts">
            <Card>
              <CardHeader>
                <CardTitle>Contract History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">ABC Bank</div>
                      <Badge>Active</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="ml-2 font-medium">24 months</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Renewal:</span>
                        <span className="ml-2 font-medium">2nd renewal</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Start:</span>
                        <span className="ml-2 font-medium">Aug 15, 2024</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">End:</span>
                        <span className="ml-2 font-medium">Aug 15, 2026</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Current Salary:</span>
                        <span className="ml-2 font-medium">$95,000</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Increase:</span>
                        <span className="ml-2 font-medium text-green-600">+9.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>Availability Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-8 border rounded-lg text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="font-medium">Next Available</div>
                  <div className="text-2xl font-bold mt-2">{selectedConsultant.availability}</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Current contract expires on {selectedConsultant.contractExpiry}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents & References</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Resume/CV</div>
                        <div className="text-xs text-muted-foreground">Updated Jan 2026</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-yellow-500" />
                      <div>
                        <div className="font-medium">Certifications</div>
                        <div className="text-xs text-muted-foreground">CBAP, PSM I, Tableau</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Consultant Database</h2>
        <Dialog open={showAddConsultant} onOpenChange={setShowAddConsultant}>
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
                <Button variant="outline" onClick={() => setShowAddConsultant(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowAddConsultant(false)}>
                  Add Consultant
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                  onClick={() => setSelectedConsultant(consultant)}
                >
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}