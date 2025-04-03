
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSchoolFees } from "@/contexts/SchoolFeesContext";
import { Payment, Student } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, PlusCircle, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StudentDetails() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    getStudent,
    getPaymentsForStudent,
    getStudentBalance,
    currentAcademicYear,
    currentSemester,
  } = useSchoolFees();
  
  const [student, setStudent] = useState<Student | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [balance, setBalance] = useState({ totalFees: 0, totalPaid: 0, balance: 0 });
  
  useEffect(() => {
    if (studentId) {
      const foundStudent = getStudent(studentId);
      if (foundStudent) {
        setStudent(foundStudent);
        setPayments(getPaymentsForStudent(studentId));
        setBalance(getStudentBalance(studentId));
      } else {
        toast({
          title: "Error",
          description: "Student not found.",
          variant: "destructive",
        });
        navigate("/school-fees/students");
      }
    }
  }, [studentId, getStudent, navigate, toast, getPaymentsForStudent, getStudentBalance]);
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };
  
  if (!student) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <Button
        variant="outline"
        onClick={() => navigate("/school-fees/students")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Students
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
              <CardDescription>
                Details and current fee status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">
                  {student.firstName} {student.lastName}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Admin Number</p>
                <p className="font-medium">{student.adminNumber}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-medium">
                  {student.class} ({student.grade})
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Registration Date</p>
                <p className="font-medium">{formatDate(student.registrationDate)}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Guardian</p>
                <p className="font-medium">{student.guardianName}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">{student.guardianContact}</p>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Fee Summary</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Fees</p>
                    <p className="font-medium">${balance.totalFees.toFixed(2)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="font-medium text-green-600">${balance.totalPaid.toFixed(2)}</p>
                  </div>
                  
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Balance Due</p>
                    <p className={`font-bold ${balance.balance > 0 ? "text-red-500" : "text-green-500"}`}>
                      ${balance.balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => navigate(`/school-fees/payments/new/${student.id}`)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                All payments recorded for this student
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Receipt #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Academic Year</TableHead>
                        <TableHead>Semester</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.receiptNumber}</TableCell>
                          <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                          <TableCell>{payment.academicYear}</TableCell>
                          <TableCell>{payment.semester}</TableCell>
                          <TableCell>${payment.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(`/school-fees/receipt/${payment.id}`)
                              }
                            >
                              <Printer className="h-4 w-4 mr-1" />
                              Receipt
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No payment records found</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate(`/school-fees/payments/new/${student.id}`)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Record First Payment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
