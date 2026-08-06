"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Slider } from "../../ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Calendar, ArrowLeft, Send, FileSignature, Star, Link as LinkIcon } from "lucide-react";
import { mockPerformanceReviews, PerformanceReview } from "../../../data/mockData";
import { PerformanceReviewFormDialog } from "./PerformanceReviewFormDialog";
import { LinkGeneratorDialog } from "./LinkGeneratorDialog";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

export function Performance() {
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const [clientRating, setClientRating] = useState(4);
  const [consultantRating, setConsultantRating] = useState(4);
  const [showCreateReview, setShowCreateReview] = useState(false);
  const [showLinkGenerator, setShowLinkGenerator] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const performanceHistoryData = [
    { period: 'Q1 2024', score: 4.1 },
    { period: 'Q2 2024', score: 4.3 },
    { period: 'Q3 2024', score: 4.2 },
    { period: 'Q4 2024', score: 4.5 },
    { period: 'Q1 2025', score: 4.4 },
    { period: 'Q2 2025', score: 4.6 }
  ];

  const filteredReviews = mockPerformanceReviews.filter(review => {
    if (statusFilter === "all") return true;
    return review.status === statusFilter;
  });

  if (selectedReview) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedReview(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reviews
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <Send className="mr-2 h-4 w-4" />
              Send Reminder
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedReview.consultantName}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedReview.reviewType} Review • Due {new Date(selectedReview.dueDate).toLocaleDateString()}
                </p>
              </div>
              <Badge 
                variant={
                  selectedReview.status === 'Completed' ? 'default' :
                  selectedReview.status === 'Draft' ? 'secondary' :
                  'outline'
                }
              >
                {selectedReview.status}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Dual-Sided Evaluation Form */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Client Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Client/Manager Feedback</CardTitle>
              {selectedReview.status !== 'Completed' && (
                <Button variant="outline" size="sm" className="mt-2">
                  <Send className="mr-2 h-4 w-4" />
                  Send Reminder to Client
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Overall Performance Rating</Label>
                <div className="mt-2">
                  <Slider 
                    value={[selectedReview.clientRating || clientRating]} 
                    onValueChange={(val) => setClientRating(val[0])}
                    max={5} 
                    step={0.1}
                    disabled={selectedReview.status === 'Completed'}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">1.0</span>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold">
                        {selectedReview.clientRating || clientRating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">5.0</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="client-strengths">Key Strengths</Label>
                <Textarea 
                  id="client-strengths"
                  placeholder="What did the consultant do exceptionally well?"
                  className="mt-2 min-h-[100px]"
                  value={selectedReview.strengths || ''}
                  disabled={selectedReview.status === 'Completed'}
                />
              </div>

              <div>
                <Label htmlFor="client-improvements">Areas for Improvement</Label>
                <Textarea 
                  id="client-improvements"
                  placeholder="What could be improved or developed further?"
                  className="mt-2 min-h-[100px]"
                  value={selectedReview.improvements || ''}
                  disabled={selectedReview.status === 'Completed'}
                />
              </div>

              <div>
                <Label>Technical Competency</Label>
                <Slider defaultValue={[4]} max={5} step={0.1} className="mt-2" disabled={selectedReview.status === 'Completed'} />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Needs Improvement</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div>
                <Label>Communication Skills</Label>
                <Slider defaultValue={[4.5]} max={5} step={0.1} className="mt-2" disabled={selectedReview.status === 'Completed'} />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Needs Improvement</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div>
                <Label>Problem Solving</Label>
                <Slider defaultValue={[4.2]} max={5} step={0.1} className="mt-2" disabled={selectedReview.status === 'Completed'} />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Needs Improvement</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div>
                <Label htmlFor="client-specific">Project-Specific Feedback</Label>
                <Textarea 
                  id="client-specific"
                  placeholder="Feedback on specific projects or deliverables..."
                  className="mt-2 min-h-[80px]"
                  disabled={selectedReview.status === 'Completed'}
                />
              </div>

              {selectedReview.status === 'Completed' && (
                <Badge variant="default" className="w-full justify-center py-2">
                  Client Feedback Received
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Consultant Self-Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consultant Self-Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Self-Rating</Label>
                <div className="mt-2">
                  <Slider 
                    value={[selectedReview.consultantSelfRating || consultantRating]} 
                    onValueChange={(val) => setConsultantRating(val[0])}
                    max={5} 
                    step={0.1}
                    disabled={selectedReview.status === 'Completed'}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">1.0</span>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-blue-400 text-blue-400" />
                      <span className="text-2xl font-bold">
                        {selectedReview.consultantSelfRating || consultantRating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">5.0</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="consultant-achievements">Key Achievements</Label>
                <Textarea 
                  id="consultant-achievements"
                  placeholder="What are you most proud of this period?"
                  className="mt-2 min-h-[100px]"
                  disabled={selectedReview.status === 'Completed'}
                />
              </div>

              <div>
                <Label htmlFor="consultant-challenges">Challenges Faced</Label>
                <Textarea 
                  id="consultant-challenges"
                  placeholder="What obstacles did you encounter?"
                  className="mt-2 min-h-[100px]"
                  disabled={selectedReview.status === 'Completed'}
                />
              </div>

              <div>
                <Label>Technical Skills Development</Label>
                <Slider defaultValue={[4.3]} max={5} step={0.1} className="mt-2" disabled={selectedReview.status === 'Completed'} />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Needs Focus</span>
                  <span>Strong Growth</span>
                </div>
              </div>

              <div>
                <Label>Collaboration & Teamwork</Label>
                <Slider defaultValue={[4.6]} max={5} step={0.1} className="mt-2" disabled={selectedReview.status === 'Completed'} />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Needs Focus</span>
                  <span>Strong Growth</span>
                </div>
              </div>

              <div>
                <Label>Goal Achievement</Label>
                <Slider defaultValue={[4.0]} max={5} step={0.1} className="mt-2" disabled={selectedReview.status === 'Completed'} />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Needs Focus</span>
                  <span>Strong Growth</span>
                </div>
              </div>

              <div>
                <Label htmlFor="consultant-goals">Development Goals & Career Aspirations</Label>
                <Textarea 
                  id="consultant-goals"
                  placeholder="What skills or roles would you like to develop?"
                  className="mt-2 min-h-[80px]"
                  disabled={selectedReview.status === 'Completed'}
                />
              </div>

              {selectedReview.status === 'Completed' && (
                <Badge variant="default" className="w-full justify-center py-2">
                  Self-Assessment Received
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {selectedReview.status === 'Completed' ? (
                  'Review completed and archived'
                ) : (
                  'Complete both sections to finalize the review'
                )}
              </div>
              <div className="flex gap-2">
                {selectedReview.status !== 'Completed' && (
                  <>
                    <Button variant="outline">Save Draft</Button>
                    <Button variant="outline">
                      <FileSignature className="mr-2 h-4 w-4" />
                      Generate Summary Report
                    </Button>
                    <Button>Submit for E-signature</Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance History */}
        {selectedReview.status === 'Completed' && (
          <Card>
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Performance Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Performance Reviews</h2>
        <Button onClick={() => setShowCreateReview(true)}>
          <Calendar className="mr-2 h-4 w-4" />
          Create New Review
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Scheduled Reviews</CardTitle>
            <div className="w-48">
              <Label htmlFor="status-filter" className="sr-only">Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Consultant</TableHead>
                <TableHead>Review Type</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Client Rating</TableHead>
                <TableHead>Self Rating</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => {
                const isOverdue = new Date(review.dueDate) < new Date() && review.status !== 'Completed';
                return (
                  <TableRow key={review.id} className={isOverdue ? 'bg-red-50' : ''}>
                    <TableCell className="font-medium">{review.consultantName}</TableCell>
                    <TableCell>{review.reviewType}</TableCell>
                    <TableCell>
                      {new Date(review.dueDate).toLocaleDateString()}
                      {isOverdue && (
                        <Badge variant="destructive" className="ml-2 text-xs">Overdue</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          review.status === 'Completed' ? 'default' :
                          review.status === 'Draft' ? 'secondary' :
                          'outline'
                        }
                      >
                        {review.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {review.clientRating ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{review.clientRating}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Pending</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {review.consultantSelfRating ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-blue-400 text-blue-400" />
                          <span>{review.consultantSelfRating}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Pending</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedReview(review)}
                      >
                        {review.status === 'Completed' ? 'View' : 'Continue'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Review Dialog */}
      <PerformanceReviewFormDialog 
        open={showCreateReview} 
        onOpenChange={setShowCreateReview} 
      />
    </div>
  );
}