
export interface Student {
  id: string;
  adminNumber: string;
  firstName: string;
  lastName: string;
  class: string;
  grade: string;
  guardianName: string;
  guardianContact: string;
  registrationDate: Date;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  paymentDate: Date;
  semester: string;
  academicYear: string;
  receiptNumber: string;
  paymentMethod: string;
  notes?: string;
}

export interface FeesStructure {
  id: string;
  academicYear: string;
  semester: string;
  class: string;
  amount: number;
  description: string;
  dueDate: Date;
}

export interface Receipt {
  id: string;
  studentId: string;
  paymentId: string;
  generateDate: Date;
  printCount: number;
}

export type PaymentHistory = Payment & {
  student: Student;
};

export interface StudentWithBalance extends Student {
  totalFees: number;
  totalPaid: number;
  balance: number;
  payments: Payment[];
  currentSemester: string;
  currentAcademicYear: string;
}

// Input types for form handling
export interface StudentInput {
  adminNumber: string;
  firstName: string;
  lastName: string;
  class: string;
  grade: string;
  guardianName: string;
  guardianContact: string;
}

export interface FeesStructureInput {
  academicYear: string;
  semester: string;
  class: string;
  amount: number;
  description: string;
  dueDate: Date;
}

