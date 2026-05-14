import type { User } from "../../src/types/index"; 

export const MOCK_USERS: User[] = [
  // Salespersons
  {
    id: "usr_001",
    email: "john.northgate@informatics.com",
    name: "John Santos",
    role: "SALESPERSON",
    centerId: "center_northgate",
  },
  {
    id: "usr_002",
    email: "maria.manila@informatics.com",
    name: "Maria Reyes",
    role: "SALESPERSON",
    centerId: "center_manila",
  },
  {
    id: "usr_003",
    email: "carlo.cavite@informatics.com",
    name: "Carlo Mendoza",
    role: "SALESPERSON",
    centerId: "center_cavite",
  },
  {
    id: "usr_004",
    email: "anne.baguio@informatics.com",
    name: "Anne Garcia",
    role: "SALESPERSON",
    centerId: "center_baguio",
  },
  {
    id: "usr_012",
    email: "michael.northgate@informatics.com",
    name: "Michael Cruz",
    role: "SALESPERSON",
    centerId: "center_northgate",
  },
  {
    id: "usr_013",
    email: "lisa.manila@informatics.com",
    name: "Lisa Fernandez",
    role: "SALESPERSON",
    centerId: "center_manila",
  },
  {
    id: "usr_014",
    email: "paolo.cavite@informatics.com",
    name: "Paolo Reyes",
    role: "SALESPERSON",
    centerId: "center_cavite",
  },
  {
    id: "usr_015",
    email: "karen.baguio@informatics.com",
    name: "Karen Santos",
    role: "SALESPERSON",
    centerId: "center_baguio",
  },
  
  // Managers
  {
    id: "usr_005",
    email: "manager.northgate@informatics.com",
    name: "Robert Cruz",
    role: "MANAGER",
    centerId: "center_northgate",
  },
  {
    id: "usr_006",
    email: "manager.manila@informatics.com",
    name: "Patricia Lopez",
    role: "MANAGER",
    centerId: "center_manila",
  },
  {
    id: "usr_007",
    email: "manager.cavite@informatics.com",
    name: "Fernando Diaz",
    role: "MANAGER",
    centerId: "center_cavite",
  },
  {
    id: "usr_008",
    email: "manager.baguio@informatics.com",
    name: "Carmen Villanueva",
    role: "MANAGER",
    centerId: "center_baguio",
  },
  
  // Execom
  {
    id: "usr_009",
    email: "execom@informatics.com",
    name: "Executive Committee User",
    role: "EXECOM",
  },
  {
    id: "usr_010",
    email: "ceo@informatics.com",
    name: "Dr. Maria Santiago",
    role: "EXECOM",
  },
  
  // Admin
  {
    id: "usr_011",
    email: "admin@informatics.com",
    name: "System Administrator",
    role: "ADMIN",
  },
];