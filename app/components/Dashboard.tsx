"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Users, FileText, AlertCircle, ClipboardCheck, UserPlus, Upload, Calendar, LogOut, TrendingUp, Clock, MapPin } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { engagementTrendData, mockPerformanceReviews } from "../data/mockData";

interface DashboardCountry {
  countryId: string;
  country: string;
  code: string;
  consultants: unknown[];
}

interface DashboardOveralls {
  activeContracts: number;
  totalConsultants: number;
  expiringContracts: number;
}

interface DashboardContractRenewal {
  contractId: string;
  consultantId: string;
  consultantName: string;
  endDate: string | Date;
}

interface DashboardContractExpiration {
  month: string;
  count: number;
}

interface DashboardProps {
  onNavigate?: (view: string, filter?: { type: string; value: string }) => void;
  countries: DashboardCountry[];
  overalls: DashboardOveralls;
  contractRenewals: DashboardContractRenewal[];
  contractExpiration: DashboardContractExpiration[];
}

export function Dashboard({ onNavigate, countries, overalls, contractRenewals, contractExpiration }: DashboardProps) {
  const overdueReviews = mockPerformanceReviews
    .filter(r => r.status !== 'Completed' && new Date(r.dueDate) < new Date())
    .slice(0, 3);

  const handleViewConsultants = (country: string) => {
    if (onNavigate) {
      onNavigate('consultants', { type: 'location', value: country });
    }
  };

  return (
    <div className="space-y-4">
      {/* Headcount by Country - Compact Grid */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex 
                              items-center justify-center">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              Headcount by Country
            </CardTitle>
            <Badge variant="secondary" className="font-normal">
              {overalls.totalConsultants} Total
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {countries.map((item) => (
              <div key={item.countryId}
                   className="group relative overflow-hidden rounded-xl border bg-gradient-to-br 
                              from-white to-gray-50 p-4 hover:shadow-md transition-all duration-200 
                              hover:scale-[1.02]">
                {/* Country Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">{item.code}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{item.country}</h3>
                    </div>
                  </div>
                </div>
                
                {/* Total Count */}
                <div className="mb-3">
                  <div className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    {item.consultants.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Consultants</div>
                </div>

                {/* Locals/Foreigners */}
                {/* <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span className="text-muted-foreground">Locals</span>
                    </div>
                    <span className="font-medium">{item.locals}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                      <span className="text-muted-foreground">Foreigners</span>
                    </div>
                    <span className="font-medium">{item.foreigners}</span>
                  </div>
                </div> */}

                {/* View Button */}
                <Button variant="ghost" size="sm" className="w-full h-8 text-xs group-hover:bg-blue-50 group-hover:text-blue-600"
                        onClick={() => handleViewConsultants(item.country)}>
                  View Consultants →
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards - Compact */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Active Contracts</p>
                <p className="text-2xl font-bold">{overalls.activeContracts}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-orange-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Expiring in 30 Days</p>
                <p className="text-2xl font-bold text-orange-600">{overalls.expiringContracts}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Pending Reviews</p>
                <p className="text-2xl font-bold">{kpiData.pendingReviews}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <ClipboardCheck className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card> */}

        <Card className="border-none shadow-sm bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Headcount</p>
                <p className="text-2xl font-bold">{overalls.totalConsultants}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row - Compact */}
      <div className="grid gap-3 md:grid-cols-2">
        {/* <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Engagement Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={engagementTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#3b82f6" 
                  strokeWidth={2.5}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  name="Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              Contract Expiration
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={contractExpiration}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Expiring" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Quick Actions - Compact Side by Side */}
      <div className="grid gap-3 md:grid-cols-2">
        {/* Alerts */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center">
                <AlertCircle className="h-3.5 w-3.5 text-orange-600" />
              </div>
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {/* Contract Renewals */}
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-2">Contract Renewals</div>
              <div className="space-y-1.5">
                {contractRenewals.length === 0 && (
                  <p className="text-xs text-muted-foreground">No contracts renewing in the next 30 days.</p>
                )}
                {contractRenewals.map((contract) => (
                  <div key={contract.contractId} className="flex items-center justify-between text-sm p-2 rounded-lg bg-orange-50 border border-orange-100">
                    <span className="font-medium text-gray-700 truncate">{contract.consultantName}</span>
                    <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                      {new Date(contract.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Reviews */}
            {/* <div>
              <div className="text-xs font-medium text-muted-foreground mb-2">Pending Reviews</div>
              <div className="space-y-1.5">
                {overdueReviews.map((review) => (
                  <div key={review.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-blue-50 border border-blue-100">
                    <span className="font-medium text-gray-700 truncate">{review.consultantName}</span>
                    <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                      {review.reviewType}
                    </Badge>
                  </div>
                ))}
              </div>
            </div> */}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
              </div>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 pt-0">
            <Button variant="outline" className="justify-start h-9 border-none bg-gray-50 hover:bg-gray-100">
              <UserPlus className="mr-2 h-4 w-4 text-blue-600" />
              <span className="text-sm">Add New Consultant</span>
            </Button>
            <Button variant="outline" className="justify-start h-9 border-none bg-gray-50 hover:bg-gray-100">
              <Upload className="mr-2 h-4 w-4 text-purple-600" />
              <span className="text-sm">Upload Contracts (Bulk)</span>
            </Button>
            <Button variant="outline" className="justify-start h-9 border-none bg-gray-50 hover:bg-gray-100">
              <Calendar className="mr-2 h-4 w-4 text-green-600" />
              <span className="text-sm">Schedule Performance Review</span>
            </Button>
            <Button variant="outline" className="justify-start h-9 border-none bg-gray-50 hover:bg-gray-100">
              <LogOut className="mr-2 h-4 w-4 text-orange-600" />
              <span className="text-sm">View Offboarding Queue</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}