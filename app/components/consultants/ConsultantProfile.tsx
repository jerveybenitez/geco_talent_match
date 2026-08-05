import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  MapPin,
  Calendar,
  Mail,
  Phone,
  Linkedin,
  Star,
  FileText,
  Award,
  CheckCircle,
  Shield
} from "lucide-react";
import { Consultant } from "../../data/mockData";
import { ImageWithFallback } from "../ui/ImageWithFallback";

interface ConsultantProfileProps {
  consultant: Consultant;
}

export function ConsultantProfile({ consultant }: ConsultantProfileProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/admin/consultants">← Back to List</Link>
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
              src={consultant.photo}
              alt={consultant.name}
              className="w-32 h-32 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{consultant.name}</h1>
                  <p className="text-xl text-muted-foreground mt-1">{consultant.role}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Badge
                    variant={
                      consultant.status === 'Available' ? 'default' :
                      consultant.status === 'Committed' ? 'secondary' :
                      'outline'
                    }
                  >
                    {consultant.status}
                  </Badge>
                  <div className="flex flex-wrap gap-2 justify-end">
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
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">{consultant.bio}</p>
              <div className="flex gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {consultant.location}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {consultant.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {consultant.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                  <a href={`https://${consultant.linkedIn}`} className="text-blue-500 hover:underline">
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
                  {consultant.skills.map((skill, idx) => (
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
                  {consultant.industry.map((ind, idx) => (
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
                  {consultant.languages.map((lang, idx) => (
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
                  {consultant.certifications.map((cert, idx) => (
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
              <div className="text-2xl font-bold">{consultant.yearsOfExperience} years</div>
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
                <div className="text-2xl font-bold mt-2">{consultant.availability}</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Current contract expires on {consultant.contractExpiry}
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
