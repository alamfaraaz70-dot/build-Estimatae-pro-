
import { User, UserRole, Project, ProjectStatus } from './types';

export const initialUsers: User[] = [
  { 
    id: 'admin-1', 
    name: 'Alam Farazi', 
    email: 'alamfaraaziitian@gmail.com', 
    password: 'alamiit', 
    role: UserRole.ADMIN 
  },
  { 
    id: 'customer-2', 
    name: 'alam', 
    email: 'iit@gmail.com', 
    password: 'iit', 
    role: UserRole.CUSTOMER 
  },
  { 
    id: '1', 
    name: 'John Doe', 
    email: 'customer@example.com', 
    password: 'password123',
    role: UserRole.CUSTOMER 
  },
  { 
    id: '2', 
    name: 'Eng. Sarah Smith', 
    email: 'engineer@example.com', 
    password: 'password123',
    role: UserRole.ENGINEER, 
    isApproved: true, 
    experience: 8,
    projectsDone: 45,
    companyName: 'Smith Structural Dynamics'
  },
  { 
    id: '3', 
    name: 'Admin User', 
    email: 'admin@example.com', 
    password: 'password123',
    role: UserRole.ADMIN 
  }
];

export const initialProjects: Project[] = [
  {
    id: 'P-X832',
    customerId: '1',
    customerName: 'John Doe',
    status: ProjectStatus.APPROVED,
    createdAt: new Date().toISOString(),
    details: {
      plotArea: 1500,
      floors: 1,
      floorConfigs: [
        { floorNumber: 1, rooms: 3, bathrooms: 2, kitchenType: 'With Chimney' }
      ],
      parking: true,
      budgetRange: "₹30 - ₹50 Lakhs",
      // Fix: Added missing required property 'timelineMonths'
      timelineMonths: 7,
      notes: 'Industrial style workshop house.'
    },
    estimates: [
      {
        engineerId: '2',
        engineerName: 'Eng. Sarah Smith',
        materialCost: 2800000,
        laborCost: 1200000,
        submittedAt: new Date().toISOString(),
        message: "Calculated based on heavy steel reinforcement requirements."
      }
    ]
  }
];
