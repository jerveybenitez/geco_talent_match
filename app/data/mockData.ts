// Mock data for HR Business Partner Application

export interface Consultant {
  id: string;
  name: string;
  role: string;
  location: string;
  photo: string;
  skills: string[];
  industry: string[];
  status: "Available" | "Committed" | "Former";
  contractExpiry: string;
  email: string;
  phone: string;
  languages: { language: string; proficiency: string }[];
  yearsOfExperience: number;
  availability: string;
  bio: string;
  certifications: string[];
  linkedIn: string;
  profileCompleted: boolean;
  orientationCompleted: boolean;
}

export interface Contract {
  id: string;
  consultantId: string;
  consultantName: string;
  client: string;
  startDate: string;
  endDate: string;
  duration: number; // in months
  renewalCount: number;
  renewalDate: string;
  salary: number;
  salaryHistory: {
    year: string;
    amount: number;
    increase: number;
    effectiveDate: string;
    reason: string; // e.g., "Initial", "Annual Increment", "Promotion", "Contract Renewal"
  }[];
  allowances: {
    type: string; // e.g., "Transport", "Housing", "Meal", "Mobile"
    amount: number;
    frequency: string; // e.g., "Monthly", "One-time"
  }[];
  contractType: "UST" | "BAU" | "CLT" | "ESG" | "Other";
  joiningDate: string; // Official joining with GECO
  deploymentDate: string; // Official deployment to client
  deploymentHistory: {
    client: string;
    deploymentDate: string;
    offboardingDate: string | null;
    status: "Active" | "Completed";
    notes: string;
  }[];
  jobRole: string;
  jobRoleHistory: {
    role: string;
    startDate: string;
    endDate: string | null;
    grade: string;
    promoted: boolean;
  }[];
  status: "Active" | "Pending Renewal" | "Expired";
  nextActionDate: string;
}

export interface PerformanceReview {
  id: string;
  consultantId: string;
  consultantName: string;
  reviewType: "Quarterly" | "Semi-Annual" | "Annual";
  dueDate: string;
  status:
    | "Draft"
    | "Sent to Client"
    | "Awaiting Consultant"
    | "Completed";
  clientRating?: number;
  consultantSelfRating?: number;
  strengths?: string;
  improvements?: string;
}

export interface OnboardingTask {
  id: string;
  consultantName: string;
  stage:
    | "Document Submission"
    | "Background Check"
    | "Medical Clearance"
    | "HR Orientation"
    | "Contract Signing";
  status: "Pending" | "In Progress" | "Completed";
  dueDate: string;
  notes: string;
}

export interface OffboardingCase {
  id: string;
  consultantName: string;
  separationType:
    | "Resignation"
    | "End of Contract"
    | "Project Layoff"
    | "Termination";
  exitDate: string;
  exitInterviewCompleted: boolean;
  equipmentReturned: boolean;
  accessRevoked: boolean;
  finalPayComputed: boolean;
  clearanceIssued: boolean;
  reason: string;
  sentiment: "Positive" | "Neutral" | "Negative";
}

export const mockConsultants: Consultant[] = [
  {
    id: "1",
    name: "Kyay Mon",
    role: "Senior Business Analyst",
    location: "Manila, Philippines",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    skills: ["Business Analysis", "SQL", "Tableau"],
    industry: ["Finance", "Healthcare"],
    status: "Committed",
    contractExpiry: "2026-08-15",
    email: "kyay.mon@geco.asia",
    phone: "+63 917 123 4567",
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "Tagalog", proficiency: "Native" },
    ],
    yearsOfExperience: 8,
    availability: "2026-08-16",
    bio: "Experienced business analyst with expertise in financial services and healthcare industries.",
    certifications: [
      "CBAP",
      "PSM I",
      "Tableau Desktop Specialist",
    ],
    linkedIn: "linkedin.com/in/mariasantos",
    profileCompleted: true,
    orientationCompleted: true,
  },
  {
    id: "2",
    name: "Gareth Tan",
    role: "Project Manager",
    location: "Singapore",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    skills: ["Agile", "Scrum", "Stakeholder Management"],
    industry: ["Technology", "E-commerce"],
    status: "Available",
    contractExpiry: "2026-03-30",
    email: "gareth.tan@geco.asia",
    phone: "+65 9123 4567",
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "Mandarin", proficiency: "Fluent" },
    ],
    yearsOfExperience: 12,
    availability: "2026-02-15",
    bio: "Certified PMP with over 12 years of experience leading digital transformation projects.",
    certifications: ["PMP", "CSM", "SAFe Agilist"],
    linkedIn: "linkedin.com/in/johntan",
    profileCompleted: true,
    orientationCompleted: true,
  },
  {
    id: "3",
    name: "Tan Heng Khuan",
    role: "Data Scientist",
    location: "Bangalore, India",
    photo:
      "https://images.unsplash.com/photo-1543879739-ab87be3df369?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbGUlMjBwcm9mZXNzaW9uYWwlMjBidXNpbmVzc3xlbnwxfHx8fDE3NzA2ODk4NTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    skills: [
      "Python",
      "Machine Learning",
      "Data Visualization",
    ],
    industry: ["Retail", "Finance"],
    status: "Committed",
    contractExpiry: "2027-01-20",
    email: "hk@geco.asia",
    phone: "+91 98765 43210",
    languages: [
      { language: "English", proficiency: "Fluent" },
      { language: "Hindi", proficiency: "Native" },
    ],
    yearsOfExperience: 6,
    availability: "2027-01-21",
    bio: "Data scientist specializing in predictive analytics and customer behavior modeling.",
    certifications: [
      "AWS Machine Learning",
      "Google Data Analytics",
    ],
    linkedIn: "linkedin.com/in/priyasharma",
    profileCompleted: true,
    orientationCompleted: true,
  },
  {
    id: "4",
    name: "Kenneth Guan",
    role: "CTO",
    location: "Seoul, South Korea",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    skills: ["Figma", "User Research", "Prototyping"],
    industry: ["Technology", "Consumer Goods"],
    status: "Available",
    contractExpiry: "2026-02-28",
    email: "Kenneth.Guan@geco.asia",
    phone: "+82 10 1234 5678",
    languages: [
      { language: "English", proficiency: "Fluent" },
      { language: "Korean", proficiency: "Native" },
    ],
    yearsOfExperience: 5,
    availability: "2026-02-10",
    bio: "Creative UX designer with a passion for user-centered design and accessibility.",
    certifications: [
      "Google UX Design",
      "Nielsen Norman Group UX",
    ],
    linkedIn: "linkedin.com/in/davidlee",
    profileCompleted: true,
    orientationCompleted: true,
  },
  {
    id: "5",
    name: "Christie Dao",
    role: "Director",
    location: "Singapore, Singapore",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    skills: ["Digital Marketing", "SEO", "Content Strategy"],
    industry: ["E-commerce", "Hospitality"],
    status: "Former",
    contractExpiry: "2025-12-31",
    email: "Christie.Dao@geco.asia",
    phone: "+66 81 234 5678",
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "Thai", proficiency: "Intermediate" },
    ],
    yearsOfExperience: 7,
    availability: "N/A",
    bio: "Strategic marketer with proven track record in growing e-commerce brands.",
    certifications: ["Google Ads", "HubSpot Marketing"],
    linkedIn: "linkedin.com/in/sarahjohnson",
    profileCompleted: true,
    orientationCompleted: true,
  },
  {
    id: "6",
    name: "Aaron Sabalon",
    role: "DevOps Engineer",
    location: "Kuala Lumpur, Malaysia",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    skills: ["AWS", "Docker", "Kubernetes"],
    industry: ["Technology", "Finance"],
    status: "Committed",
    contractExpiry: "2026-11-30",
    email: "ahmad.hassan@example.com",
    phone: "+60 12 345 6789",
    languages: [
      { language: "English", proficiency: "Fluent" },
      { language: "Malay", proficiency: "Native" },
    ],
    yearsOfExperience: 9,
    availability: "2026-12-01",
    bio: "DevOps engineer specializing in cloud infrastructure and CI/CD automation.",
    certifications: ["AWS Solutions Architect", "CKA"],
    linkedIn: "linkedin.com/in/ahmadhassan",
    profileCompleted: true,
    orientationCompleted: true,
  },
];

export const mockContracts: Contract[] = [
  {
    id: "C001",
    consultantId: "1",
    consultantName: "Kyay Mon",
    client: "ABC Bank",
    startDate: "2024-08-15",
    endDate: "2026-08-15",
    duration: 24,
    renewalCount: 2,
    renewalDate: "2026-06-15",
    salary: 95000,
    salaryHistory: [
      { year: "2022", amount: 80000, increase: 0, effectiveDate: "2022-01-01", reason: "Initial" },
      { year: "2023", amount: 87000, increase: 8.75, effectiveDate: "2023-01-01", reason: "Annual Increment" },
      { year: "2024", amount: 95000, increase: 9.2, effectiveDate: "2024-01-01", reason: "Contract Renewal" },
    ],
    allowances: [
      { type: "Transport", amount: 500, frequency: "Monthly" },
      { type: "Housing", amount: 1000, frequency: "Monthly" },
    ],
    contractType: "UST",
    joiningDate: "2024-08-15",
    deploymentDate: "2024-08-15",
    deploymentHistory: [
      { client: "ABC Bank", deploymentDate: "2024-08-15", offboardingDate: null, status: "Active", notes: "Initial deployment" },
    ],
    jobRole: "Senior Business Analyst",
    jobRoleHistory: [
      { role: "Business Analyst", startDate: "2024-08-15", endDate: "2025-08-15", grade: "A", promoted: false },
      { role: "Senior Business Analyst", startDate: "2025-08-15", endDate: null, grade: "B", promoted: true },
    ],
    status: "Active",
    nextActionDate: "2026-06-15",
  },
  {
    id: "C002",
    consultantId: "2",
    consultantName: "Gareth Tan",
    client: "Tech Innovations Pte Ltd",
    startDate: "2024-04-01",
    endDate: "2026-03-30",
    duration: 24,
    renewalCount: 1,
    renewalDate: "2026-02-28",
    salary: 125000,
    salaryHistory: [
      { year: "2023", amount: 115000, increase: 0, effectiveDate: "2023-01-01", reason: "Initial" },
      { year: "2024", amount: 125000, increase: 8.7, effectiveDate: "2024-01-01", reason: "Annual Increment" },
    ],
    allowances: [
      { type: "Transport", amount: 500, frequency: "Monthly" },
      { type: "Housing", amount: 1000, frequency: "Monthly" },
    ],
    contractType: "BAU",
    joiningDate: "2024-04-01",
    deploymentDate: "2024-04-01",
    deploymentHistory: [
      { client: "Tech Innovations Pte Ltd", deploymentDate: "2024-04-01", offboardingDate: null, status: "Active", notes: "Initial deployment" },
    ],
    jobRole: "Project Manager",
    jobRoleHistory: [
      { role: "Project Manager", startDate: "2024-04-01", endDate: null, grade: "A", promoted: false },
    ],
    status: "Pending Renewal",
    nextActionDate: "2026-02-28",
  },
  {
    id: "C003",
    consultantId: "3",
    consultantName: "Tan Heng Khuan",
    client: "RetailCorp",
    startDate: "2025-01-20",
    endDate: "2027-01-20",
    duration: 24,
    renewalCount: 0,
    renewalDate: "N/A",
    salary: 88000,
    salaryHistory: [
      { year: "2025", amount: 88000, increase: 0, effectiveDate: "2025-01-01", reason: "Initial" },
    ],
    allowances: [
      { type: "Transport", amount: 500, frequency: "Monthly" },
      { type: "Housing", amount: 1000, frequency: "Monthly" },
    ],
    contractType: "CLT",
    joiningDate: "2025-01-20",
    deploymentDate: "2025-01-20",
    deploymentHistory: [
      { client: "RetailCorp", deploymentDate: "2025-01-20", offboardingDate: null, status: "Active", notes: "Initial deployment" },
    ],
    jobRole: "Data Scientist",
    jobRoleHistory: [
      { role: "Data Scientist", startDate: "2025-01-20", endDate: null, grade: "A", promoted: false },
    ],
    status: "Active",
    nextActionDate: "2026-10-20",
  },
  {
    id: "C004",
    consultantId: "4",
    consultantName: "Kenneth Guan",
    client: "DesignHub Korea",
    startDate: "2024-03-01",
    endDate: "2026-02-28",
    duration: 24,
    renewalCount: 1,
    renewalDate: "2026-02-15",
    salary: 78000,
    salaryHistory: [
      { year: "2023", amount: 72000, increase: 0, effectiveDate: "2023-01-01", reason: "Initial" },
      { year: "2024", amount: 78000, increase: 8.3, effectiveDate: "2024-01-01", reason: "Annual Increment" },
    ],
    allowances: [
      { type: "Transport", amount: 500, frequency: "Monthly" },
      { type: "Housing", amount: 1000, frequency: "Monthly" },
    ],
    contractType: "ESG",
    joiningDate: "2024-03-01",
    deploymentDate: "2024-03-01",
    deploymentHistory: [
      { client: "DesignHub Korea", deploymentDate: "2024-03-01", offboardingDate: null, status: "Active", notes: "Initial deployment" },
    ],
    jobRole: "CTO",
    jobRoleHistory: [
      { role: "CTO", startDate: "2024-03-01", endDate: null, grade: "A", promoted: false },
    ],
    status: "Pending Renewal",
    nextActionDate: "2026-02-15",
  },
  {
    id: "C005",
    consultantId: "6",
    consultantName: "Christie Dao",
    client: "FinTech Solutions",
    startDate: "2024-11-30",
    endDate: "2026-11-30",
    duration: 24,
    renewalCount: 1,
    renewalDate: "2026-09-30",
    salary: 105000,
    salaryHistory: [
      { year: "2023", amount: 95000, increase: 0, effectiveDate: "2023-01-01", reason: "Initial" },
      { year: "2024", amount: 105000, increase: 10.5, effectiveDate: "2024-01-01", reason: "Annual Increment" },
    ],
    allowances: [
      { type: "Transport", amount: 500, frequency: "Monthly" },
      { type: "Housing", amount: 1000, frequency: "Monthly" },
    ],
    contractType: "Other",
    joiningDate: "2024-11-30",
    deploymentDate: "2024-11-30",
    deploymentHistory: [
      { client: "FinTech Solutions", deploymentDate: "2024-11-30", offboardingDate: null, status: "Active", notes: "Initial deployment" },
    ],
    jobRole: "DevOps Engineer",
    jobRoleHistory: [
      { role: "DevOps Engineer", startDate: "2024-11-30", endDate: null, grade: "A", promoted: false },
    ],
    status: "Active",
    nextActionDate: "2026-09-30",
  },
];

export const mockPerformanceReviews: PerformanceReview[] = [
  {
    id: "PR001",
    consultantId: "1",
    consultantName: "Kyay Mon",
    reviewType: "Semi-Annual",
    dueDate: "2026-02-28",
    status: "Completed",
    clientRating: 4.5,
    consultantSelfRating: 4.2,
    strengths:
      "Excellent stakeholder communication, strong analytical skills",
    improvements: "Could improve technical documentation",
  },
  {
    id: "PR002",
    consultantId: "2",
    consultantName: "Gareth Tan",
    reviewType: "Quarterly",
    dueDate: "2026-03-31",
    status: "Sent to Client",
    clientRating: undefined,
    consultantSelfRating: 4.3,
  },
  {
    id: "PR003",
    consultantId: "3",
    consultantName: "Tan Heng Khuan",
    reviewType: "Quarterly",
    dueDate: "2026-04-20",
    status: "Draft",
  },
  {
    id: "PR004",
    consultantId: "6",
    consultantName: "Kenneth Guan",
    reviewType: "Annual",
    dueDate: "2026-02-28",
    status: "Awaiting Consultant",
    clientRating: 4.8,
  },
];

export const mockOnboardingTasks: OnboardingTask[] = [
  {
    id: "OB001",
    consultantName: "Kyay Mon",
    stage: "Document Submission",
    status: "Completed",
    dueDate: "2026-02-10",
    notes: "All documents received and verified",
  },
  {
    id: "OB002",
    consultantName: "Kyay Mon",
    stage: "Background Check",
    status: "In Progress",
    dueDate: "2026-02-15",
    notes: "BGC initiated with vendor",
  },
  {
    id: "OB003",
    consultantName: "Gareth Tan",
    stage: "Medical Clearance",
    status: "Pending",
    dueDate: "2026-02-20",
    notes: "Appointment scheduled for Feb 18",
  },
  {
    id: "OB004",
    consultantName: "Kenneth Guan",
    stage: "HR Orientation",
    status: "Completed",
    dueDate: "2026-02-08",
    notes: "Completed online orientation module",
  },
  {
    id: "OB005",
    consultantName: "Kenneth Guan",
    stage: "Contract Signing",
    status: "Pending",
    dueDate: "2026-02-12",
    notes: "E-signature link sent",
  },
];

export const mockOffboardingCases: OffboardingCase[] = [
  {
    id: "OFF001",
    consultantName: "Sarah Johnson",
    separationType: "End of Contract",
    exitDate: "2025-12-31",
    exitInterviewCompleted: true,
    equipmentReturned: true,
    accessRevoked: true,
    finalPayComputed: true,
    clearanceIssued: true,
    reason: "Contract ended, pursuing other opportunities",
    sentiment: "Positive",
  },
  {
    id: "OFF002",
    consultantName: "Robert Chen",
    separationType: "Resignation",
    exitDate: "2026-02-28",
    exitInterviewCompleted: false,
    equipmentReturned: false,
    accessRevoked: false,
    finalPayComputed: false,
    clearanceIssued: false,
    reason: "Better offer from competitor",
    sentiment: "Neutral",
  },
  {
    id: "OFF003",
    consultantName: "Emma Wilson",
    separationType: "Project Layoff",
    exitDate: "2026-01-31",
    exitInterviewCompleted: true,
    equipmentReturned: true,
    accessRevoked: true,
    finalPayComputed: true,
    clearanceIssued: false,
    reason: "Client project ended",
    sentiment: "Negative",
  },
];

export const kpiData = {
  totalHeadcount: 156,
  foreigners: 45,
  locals: 89,
  prs: 22,
  activeContracts: 142,
  expiringThisMonth: 8,
  pendingReviews: 12,
};

export const headcountByCountry = [
  { country: "Philippines", count: 45 },
  { country: "Singapore", count: 38 },
  { country: "Malaysia", count: 28 },
  { country: "Thailand", count: 22 },
  { country: "Indonesia", count: 15 },
  { country: "Vietnam", count: 8 },
];

export const headcountByCountryDetailed = [
  {
    country: "Singapore",
    code: "SG",
    total: 38,
    locals: 25,
    foreigners: 13,
  },
  {
    country: "Philippines",
    code: "PH",
    total: 45,
    locals: 38,
    foreigners: 7,
  },
  {
    country: "Malaysia",
    code: "MY",
    total: 28,
    locals: 20,
    foreigners: 8,
  },
  {
    country: "Thailand",
    code: "TH",
    total: 22,
    locals: 18,
    foreigners: 4,
  },
  {
    country: "Indonesia",
    code: "ID",
    total: 15,
    locals: 12,
    foreigners: 3,
  },
  {
    country: "Vietnam",
    code: "VN",
    total: 8,
    locals: 6,
    foreigners: 2,
  },
];

export const engagementTrendData = [
  { month: "Aug", engagement: 78 },
  { month: "Sep", engagement: 82 },
  { month: "Oct", engagement: 79 },
  { month: "Nov", engagement: 85 },
  { month: "Dec", engagement: 83 },
  { month: "Jan", engagement: 87 },
  { month: "Feb", engagement: 89 },
];

export const attritionReasonsData = [
  { name: "End of Contract", value: 45 },
  { name: "Resignation", value: 30 },
  { name: "Project Layoff", value: 15 },
  { name: "Termination", value: 10 },
];

export const contractExpiryData = [
  { month: "Feb", count: 8 },
  { month: "Mar", count: 12 },
  { month: "Apr", count: 6 },
  { month: "May", count: 9 },
  { month: "Jun", count: 15 },
  { month: "Jul", count: 11 },
];