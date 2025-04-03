
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSchoolFees } from "@/contexts/SchoolFeesContext";
import { Student, Payment } from "@/types";
import { 
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Receipt() {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const {
    payments,
    getStudent,
    getCurrentFeesForClass,
    getStudentBalance,
  } = useSchoolFees();
  
  const [payment, setPayment] = useState<Payment | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  
  useEffect(() => {
    if (paymentId) {
      const foundPayment = payments.find((p) => p.id === paymentId);
      
      if (foundPayment) {
        setPayment(foundPayment);
        
        const foundStudent = getStudent(foundPayment.studentId);
        if (foundStudent) {
          setStudent(foundStudent);
        } else {
          toast({
            title: "Error",
            description: "Student information not found.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Payment record not found.",
          variant: "destructive",
        });
        navigate("/school-fees/students");
      }
    }
  }, [paymentId, payments, getStudent, navigate, toast]);
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString();
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  if (!payment || !student) {
    return <div>Loading receipt...</div>;
  }
  
  const { totalFees, totalPaid, balance } = getStudentBalance(student.id);
  const feeStructure = getCurrentFeesForClass(student.class);
  
  return (
    <div className="container mx-auto py-8">
      <div className="hidden md:block print:hidden mb-4">
        <Button variant="outline" onClick={() => navigate("/school-fees/students")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>
      </div>
      
      <div className="print:py-0">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden ring-1 ring-gray-200 dark:ring-gray-800 print:shadow-none print:ring-0">
          <div className="p-8 print:p-0" ref={receiptRef}>
            {/* Receipt Header */}
            <div className="border-b pb-4 mb-4 text-center">
              <h1 className="text-2xl font-bold uppercase">School Fee Receipt</h1>
              <p className="text-lg">{payment.academicYear} - {payment.semester} Semester</p>
            </div>
            
            {/* Receipt Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Receipt No:</p>
                <p className="font-medium">{payment.receiptNumber}</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Date:</p>
                <p className="font-medium">{formatDate(payment.paymentDate)}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Time:</p>
                <p className="font-medium">{formatTime(payment.paymentDate)}</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Payment Method:</p>
                <p className="font-medium">{payment.paymentMethod}</p>
              </div>
            </div>
            
            {/* Student Information */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Student Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name:</p>
                  <p className="font-medium">{student.firstName} {student.lastName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Admin Number:</p>
                  <p className="font-medium">{student.adminNumber}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Class:</p>
                  <p className="font-medium">{student.class} ({student.grade})</p>
                </div>
              </div>
            </div>
            
            {/* Payment Details */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Payment Details</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Description</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3">
                      Fee Payment - {payment.semester} Semester {payment.academicYear}
                      {payment.notes && <div className="text-sm text-muted-foreground">{payment.notes}</div>}
                    </td>
                    <td className="py-3 text-right font-medium">${payment.amount.toFixed(2)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td className="py-3 font-semibold">Total Paid</td>
                    <td className="py-3 text-right font-bold">${payment.amount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            {/* Payment Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-6">
              <h2 className="text-lg font-semibold mb-2">Fee Summary</h2>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Total Fees:</p>
                  <p className="font-medium">${totalFees.toFixed(2)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Total Paid:</p>
                  <p className="font-medium text-green-600">${totalPaid.toFixed(2)}</p>
                </div>
                
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Balance Due:</p>
                  <p className={`font-bold ${balance > 0 ? "text-red-500" : "text-green-500"}`}>
                    ${balance.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="text-center border-t pt-4">
              <p className="text-sm text-muted-foreground">This is a computer generated receipt and does not require a signature.</p>
              <p className="text-xs mt-2">For any queries, please contact the school finance office.</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-6 space-x-4 print:hidden">
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print Receipt
          </Button>
        </div>
      </div>
    </div>
  );
}
