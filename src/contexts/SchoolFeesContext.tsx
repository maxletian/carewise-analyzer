
import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  Student, 
  Payment, 
  FeesStructure, 
  Receipt,
  StudentWithBalance,
  StudentInput,
  FeesStructureInput
} from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";

interface SchoolFeesContextType {
  students: Student[];
  payments: Payment[];
  feesStructures: FeesStructure[];
  receipts: Receipt[];
  currentAcademicYear: string;
  currentSemester: string;
  
  // Student Management
  addStudent: (student: StudentInput) => Student;
  updateStudent: (id: string, studentData: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudent: (id: string) => Student | undefined;
  getStudentByAdminNumber: (adminNumber: string) => Student | undefined;
  
  // Payment Management
  addPayment: (payment: Omit<Payment, "id" | "paymentDate" | "receiptNumber">) => Payment;
  getPaymentsForStudent: (studentId: string) => Payment[];
  
  // Fees Structure Management
  addFeesStructure: (feesStructure: FeesStructureInput) => FeesStructure;
  updateFeesStructure: (id: string, feesData: Partial<FeesStructure>) => void;
  deleteFeesStructure: (id: string) => void;
  getCurrentFeesForClass: (className: string) => FeesStructure | undefined;
  
  // Receipt Management
  generateReceipt: (studentId: string, paymentId: string) => Receipt;
  getReceipt: (id: string) => Receipt | undefined;
  
  // Student Balance 
  getStudentBalance: (studentId: string) => { totalFees: number, totalPaid: number, balance: number };
  getStudentsWithBalances: () => StudentWithBalance[];
  
  // Settings
  setAcademicYear: (year: string) => void;
  setSemester: (semester: string) => void;
}

const defaultContextValue: SchoolFeesContextType = {
  students: [],
  payments: [],
  feesStructures: [],
  receipts: [],
  currentAcademicYear: new Date().getFullYear().toString(),
  currentSemester: "First",
  
  addStudent: () => ({ id: "", adminNumber: "", firstName: "", lastName: "", class: "", grade: "", guardianName: "", guardianContact: "", registrationDate: new Date() }),
  updateStudent: () => {},
  deleteStudent: () => {},
  getStudent: () => undefined,
  getStudentByAdminNumber: () => undefined,
  
  addPayment: () => ({ id: "", studentId: "", amount: 0, paymentDate: new Date(), semester: "", academicYear: "", receiptNumber: "", paymentMethod: "" }),
  getPaymentsForStudent: () => [],
  
  addFeesStructure: () => ({ id: "", academicYear: "", semester: "", class: "", amount: 0, description: "", dueDate: new Date() }),
  updateFeesStructure: () => {},
  deleteFeesStructure: () => {},
  getCurrentFeesForClass: () => undefined,
  
  generateReceipt: () => ({ id: "", studentId: "", paymentId: "", generateDate: new Date(), printCount: 0 }),
  getReceipt: () => undefined,
  
  getStudentBalance: () => ({ totalFees: 0, totalPaid: 0, balance: 0 }),
  getStudentsWithBalances: () => [],
  
  setAcademicYear: () => {},
  setSemester: () => {}
};

const SchoolFeesContext = createContext<SchoolFeesContextType>(defaultContextValue);

export const useSchoolFees = () => useContext(SchoolFeesContext);

// Local storage keys
const STUDENTS_KEY = "school_fees_students";
const PAYMENTS_KEY = "school_fees_payments";
const FEES_STRUCTURES_KEY = "school_fees_structures";
const RECEIPTS_KEY = "school_fees_receipts";
const CURRENT_ACADEMIC_YEAR_KEY = "school_fees_academic_year";
const CURRENT_SEMESTER_KEY = "school_fees_semester";

export const SchoolFeesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // States
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [feesStructures, setFeesStructures] = useState<FeesStructure[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [currentAcademicYear, setCurrentAcademicYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [currentSemester, setCurrentSemester] = useState<string>("First");
  
  // Load data from localStorage on component mount
  useEffect(() => {
    const loadedStudents = localStorage.getItem(STUDENTS_KEY);
    const loadedPayments = localStorage.getItem(PAYMENTS_KEY);
    const loadedFeesStructures = localStorage.getItem(FEES_STRUCTURES_KEY);
    const loadedReceipts = localStorage.getItem(RECEIPTS_KEY);
    const loadedAcademicYear = localStorage.getItem(CURRENT_ACADEMIC_YEAR_KEY);
    const loadedSemester = localStorage.getItem(CURRENT_SEMESTER_KEY);
    
    if (loadedStudents) setStudents(JSON.parse(loadedStudents));
    if (loadedPayments) setPayments(JSON.parse(loadedPayments));
    if (loadedFeesStructures) setFeesStructures(JSON.parse(loadedFeesStructures));
    if (loadedReceipts) setReceipts(JSON.parse(loadedReceipts));
    if (loadedAcademicYear) setCurrentAcademicYear(loadedAcademicYear);
    if (loadedSemester) setCurrentSemester(loadedSemester);
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  }, [students]);
  
  useEffect(() => {
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
  }, [payments]);
  
  useEffect(() => {
    localStorage.setItem(FEES_STRUCTURES_KEY, JSON.stringify(feesStructures));
  }, [feesStructures]);
  
  useEffect(() => {
    localStorage.setItem(RECEIPTS_KEY, JSON.stringify(receipts));
  }, [receipts]);
  
  useEffect(() => {
    localStorage.setItem(CURRENT_ACADEMIC_YEAR_KEY, currentAcademicYear);
  }, [currentAcademicYear]);
  
  useEffect(() => {
    localStorage.setItem(CURRENT_SEMESTER_KEY, currentSemester);
  }, [currentSemester]);
  
  // Student Management Functions
  const addStudent = (studentData: StudentInput) => {
    const existingStudent = students.find(
      (s) => s.adminNumber === studentData.adminNumber
    );
    
    if (existingStudent) {
      toast({
        title: "Error",
        description: `Student with Admin Number ${studentData.adminNumber} already exists.`,
        variant: "destructive",
      });
      throw new Error(`Student with Admin Number ${studentData.adminNumber} already exists`);
    }
    
    const newStudent: Student = {
      ...studentData,
      id: uuidv4(),
      registrationDate: new Date(),
    };
    
    setStudents((prev) => [...prev, newStudent]);
    toast({
      title: "Success",
      description: `Student ${newStudent.firstName} ${newStudent.lastName} registered successfully.`,
    });
    
    return newStudent;
  };
  
  const updateStudent = (id: string, studentData: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, ...studentData } : student
      )
    );
    
    toast({
      title: "Success",
      description: "Student information updated successfully.",
    });
  };
  
  const deleteStudent = (id: string) => {
    // Check if student has any payments before deleting
    const studentPayments = payments.filter((p) => p.studentId === id);
    if (studentPayments.length > 0) {
      toast({
        title: "Error",
        description: "Cannot delete student with existing payments.",
        variant: "destructive",
      });
      return;
    }
    
    setStudents((prev) => prev.filter((student) => student.id !== id));
    toast({
      title: "Success",
      description: "Student deleted successfully.",
    });
  };
  
  const getStudent = (id: string) => {
    return students.find((student) => student.id === id);
  };
  
  const getStudentByAdminNumber = (adminNumber: string) => {
    return students.find((student) => student.adminNumber === adminNumber);
  };
  
  // Payment Management Functions
  const addPayment = (paymentData: Omit<Payment, "id" | "paymentDate" | "receiptNumber">) => {
    const student = students.find((s) => s.id === paymentData.studentId);
    
    if (!student) {
      toast({
        title: "Error",
        description: "Student not found.",
        variant: "destructive",
      });
      throw new Error("Student not found");
    }
    
    // Generate receipt number: Format - SCHOOL/YEAR/SEMESTER/XXXX
    const paymentCount = payments.length + 1;
    const receiptNumber = `SCH/${currentAcademicYear.slice(-2)}/${currentSemester.charAt(0)}/${paymentCount.toString().padStart(4, '0')}`;
    
    const newPayment: Payment = {
      ...paymentData,
      id: uuidv4(),
      paymentDate: new Date(),
      receiptNumber,
    };
    
    setPayments((prev) => [...prev, newPayment]);
    toast({
      title: "Payment Recorded",
      description: `Payment of ${paymentData.amount} recorded for ${student.firstName} ${student.lastName}.`,
    });
    
    return newPayment;
  };
  
  const getPaymentsForStudent = (studentId: string) => {
    return payments.filter((payment) => payment.studentId === studentId);
  };
  
  // Fees Structure Management Functions
  const addFeesStructure = (feesData: FeesStructureInput) => {
    // Check if there's already a fee structure for this combination
    const existingStructure = feesStructures.find(
      (fs) =>
        fs.academicYear === feesData.academicYear &&
        fs.semester === feesData.semester &&
        fs.class === feesData.class
    );
    
    if (existingStructure) {
      toast({
        title: "Error",
        description: "Fee structure for this class, semester and academic year already exists.",
        variant: "destructive",
      });
      throw new Error("Fee structure already exists");
    }
    
    const newFeesStructure: FeesStructure = {
      ...feesData,
      id: uuidv4(),
    };
    
    setFeesStructures((prev) => [...prev, newFeesStructure]);
    toast({
      title: "Success",
      description: `Fee structure for ${feesData.class} added successfully.`,
    });
    
    return newFeesStructure;
  };
  
  const updateFeesStructure = (id: string, feesData: Partial<FeesStructure>) => {
    setFeesStructures((prev) =>
      prev.map((fs) => (fs.id === id ? { ...fs, ...feesData } : fs))
    );
    
    toast({
      title: "Success",
      description: "Fee structure updated successfully.",
    });
  };
  
  const deleteFeesStructure = (id: string) => {
    setFeesStructures((prev) => prev.filter((fs) => fs.id !== id));
    
    toast({
      title: "Success",
      description: "Fee structure deleted successfully.",
    });
  };
  
  const getCurrentFeesForClass = (className: string) => {
    return feesStructures.find(
      (fs) =>
        fs.class === className &&
        fs.academicYear === currentAcademicYear &&
        fs.semester === currentSemester
    );
  };
  
  // Receipt Management Functions
  const generateReceipt = (studentId: string, paymentId: string) => {
    const newReceipt: Receipt = {
      id: uuidv4(),
      studentId,
      paymentId,
      generateDate: new Date(),
      printCount: 0,
    };
    
    setReceipts((prev) => [...prev, newReceipt]);
    
    return newReceipt;
  };
  
  const getReceipt = (id: string) => {
    return receipts.find((receipt) => receipt.id === id);
  };
  
  // Student Balance Functions
  const getStudentBalance = (studentId: string) => {
    const student = getStudent(studentId);
    
    if (!student) {
      return { totalFees: 0, totalPaid: 0, balance: 0 };
    }
    
    // Find applicable fee structure for the student
    const feeStructure = getCurrentFeesForClass(student.class);
    const totalFees = feeStructure ? feeStructure.amount : 0;
    
    // Calculate total paid amount for the current semester
    const studentPayments = payments.filter(
      (p) =>
        p.studentId === studentId &&
        p.academicYear === currentAcademicYear &&
        p.semester === currentSemester
    );
    
    const totalPaid = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const balance = totalFees - totalPaid;
    
    return { totalFees, totalPaid, balance };
  };
  
  const getStudentsWithBalances = (): StudentWithBalance[] => {
    return students.map((student) => {
      const { totalFees, totalPaid, balance } = getStudentBalance(student.id);
      const studentPayments = getPaymentsForStudent(student.id);
      
      return {
        ...student,
        totalFees,
        totalPaid,
        balance,
        payments: studentPayments,
        currentSemester,
        currentAcademicYear,
      };
    });
  };
  
  // Settings Functions
  const setAcademicYearHandler = (year: string) => {
    setCurrentAcademicYear(year);
    toast({
      title: "Updated",
      description: `Academic year set to ${year}.`,
    });
  };
  
  const setSemesterHandler = (semester: string) => {
    setCurrentSemester(semester);
    toast({
      title: "Updated",
      description: `Semester set to ${semester}.`,
    });
  };
  
  const contextValue: SchoolFeesContextType = {
    students,
    payments,
    feesStructures,
    receipts,
    currentAcademicYear,
    currentSemester,
    
    addStudent,
    updateStudent,
    deleteStudent,
    getStudent,
    getStudentByAdminNumber,
    
    addPayment,
    getPaymentsForStudent,
    
    addFeesStructure,
    updateFeesStructure,
    deleteFeesStructure,
    getCurrentFeesForClass,
    
    generateReceipt,
    getReceipt,
    
    getStudentBalance,
    getStudentsWithBalances,
    
    setAcademicYear: setAcademicYearHandler,
    setSemester: setSemesterHandler,
  };
  
  return (
    <SchoolFeesContext.Provider value={contextValue}>
      {children}
    </SchoolFeesContext.Provider>
  );
};
