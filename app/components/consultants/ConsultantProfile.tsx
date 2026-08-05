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
} from "lucide-react";
import type { ConsultantProfileData } from "@/lib/consultantsData";
import { ImageWithFallback } from "../ui/ImageWithFallback";
import { ConsultantFormModal } from "./ConsultantFormModal";

interface ConsultantProfileProps {
  consultant: ConsultantProfileData;
  countries: { id: string; name: string; code: string }[];
}

export function ConsultantProfile({ consultant, countries }: ConsultantProfileProps) {
  const linkedinHref = consultant.linkedin
    ? consultant.linkedin.startsWith("http")
      ? consultant.linkedin
      : `https://${consultant.linkedin}`
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/admin/consultants">← Back to List</Link>
        </Button>
        <div className="flex gap-2">
          <ConsultantFormModal countries={countries} consultant={consultant} />
        </div>
      </div>

      {/* Hero Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-6">
            {consultant.photo ? (
              <ImageWithFallback
                src={consultant.photo}
                alt={consultant.name}
                className="w-32 h-32 rounded-lg object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center text-4xl font-medium text-gray-500">
                {consultant.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{consultant.name}</h1>
                  <p className="text-xl text-muted-foreground mt-1">{consultant.role}</p>
                </div>
                <Badge
                  variant={
                    consultant.status === 'Available' ? 'default' :
                    consultant.status === 'Committed' ? 'secondary' :
                    'outline'
                  }
                >
                  {consultant.status}
                </Badge>
              </div>
              {consultant.bio && (
                <p className="mt-4 text-muted-foreground">{consultant.bio}</p>
              )}
              <div className="flex flex-wrap gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {consultant.city}, {consultant.country}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {consultant.email}
                </div>
                {consultant.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {consultant.phone}
                  </div>
                )}
                {linkedinHref && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                    <a href={linkedinHref} className="text-blue-500 hover:underline">
                      LinkedIn
                    </a>
                  </div>
                )}
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
                  {consultant.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
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
                  {consultant.industries.map((industry) => (
                    <Badge key={industry} variant="outline">{industry}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sample data - languages aren't collected on the consultant form yet */}
            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>English</span>
                    <Badge variant="secondary">Native</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Mandarin</span>
                    <Badge variant="secondary">Fluent</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sample data - certifications aren't tracked in the schema yet */}
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">PMP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">CSM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {consultant.yearsOfExperience != null ? `${consultant.yearsOfExperience} years` : "Not specified"}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Total professional experience</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sample data - work history entries aren't collected yet */}
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

        {/* Sample data - no performance review model exists yet */}
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

        {/* Sample data - contract salary/renewal details aren't tracked yet */}
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
                <div className="text-2xl font-bold mt-2">
                  {new Date(consultant.availableFrom).toLocaleDateString()}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Current contract expires on {new Date(consultant.contractExpiry).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sample data - document uploads aren't wired up yet */}
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
