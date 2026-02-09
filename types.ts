
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ENGINEER = 'ENGINEER',
  ADMIN = 'ADMIN'
}

export enum ProjectStatus {
  SUBMITTED = 'Submitted',
  APPROVED = 'Approved by Engineer',
  FINALIZED = 'Finalized & Building'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isApproved?: boolean;
  experience?: number;
  profileImage?: string;
  phone?: string;
  address?: string;
}

export interface FloorConfig {
  floorNumber: number;
  rooms: number;
  bathrooms: number;
  kitchenType: 'With Chimney' | 'Without Chimney';
}

export interface ConstructionDetails {
  plotArea: number;
  floors: number;
  floorConfigs: FloorConfig[];
  parking: boolean;
  budgetRange: string;
  notes?: string;
}

export interface AiEstimateOption {
  label: string;
  material: number;
  labor: number;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  role: UserRole;
  text?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'file';
  timestamp: string;
}

export interface Estimate {
  engineerId: string;
  engineerName: string;
  materialCost: number;
  laborCost: number;
  submittedAt: string;
  message?: string;
}

export interface Project {
  id: string;
  customerId: string;
  customerName: string;
  details: ConstructionDetails;
  status: ProjectStatus;
  createdAt: string;
  estimates: Estimate[];
  messages?: ChatMessage[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
