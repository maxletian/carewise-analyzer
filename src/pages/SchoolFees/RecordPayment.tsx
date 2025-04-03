
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSchoolFees } from "@/contexts/SchoolFeesContext";
import { Student } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Printer } from "lucide-react";

const formSchema = z.object({
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  paymentMethod: z.string().min(1, {
    message: "Payment method is required.",
  }),
  notes: z.string().optional(),
});

export default function RecordPayment() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    getStudent,
    getStudentBalance,
    addPayment,
    currentAcademicYear,
    currentSemester,
    generateReceipt,
  } = useSchoolFees();
  
  const [student, setStudent] = useState<Student | null>(null);
  const [balance, setBalance] = useState({ totalFees: 0, totalPaid: 0, balance: 0 });
  const [paymentId, setPaymentId] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      paymentMethod: "Cash",
      notes: "",
    },
  });
  
  useEffect(() => {
    if (studentId) {
      const foundStudent = getStudent(studentId);
      if (foundStudent) {
        setStudent(foundStudent);
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
  }, [studentId, getStudent, navigate, toast, getStudentBalance]);
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!student) return;
    
    try {
      const payment = addPayment({
        studentId: student.id,
        amount: values.amount,
        academicYear: currentAcademicYear,
        semester: currentSemester,
        paymentMethod: values.paymentMethod,
        notes: values.notes,
      });
      
      const receipt = generateReceipt(student.id, payment.id);
      setPaymentId(payment.id);
      
      toast({
        title: "Payment Recorded",
        description: `Payment of $${values.amount} recorded successfully.`,
      });
      
      // Update the balance display
      setBalance(getStudentBalance(student.id));
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to record payment.",
        variant: "destructive",
      });
    }
  }
  
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Record Payment</CardTitle>
              <CardDescription>
                Record a new fee payment for {student.firstName} {student.lastName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Student Name</p>
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
                  <p className="text-sm text-muted-foreground">Semester</p>
                  <p className="font-medium">
                    {currentSemester} Semester, {currentAcademicYear}
                  </p>
                </div>
              </div>
              
              {paymentId ? (
                <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-900">
                  <h3 className="font-medium text-green-800 dark:text-green-300">
                    Payment Recorded Successfully
                  </h3>
                  <p className="text-green-700 dark:text-green-400 mt-1">
                    Payment has been recorded and receipt has been generated.
                  </p>
                  <div className="flex space-x-4 mt-4">
                    <Button onClick={() => navigate(`/school-fees/receipt/${paymentId}`)}>
                      <Printer className="h-4 w-4 mr-2" />
                      View Receipt
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setPaymentId(null);
                        form.reset({
                          amount: 0,
                          paymentMethod: "Cash",
                          notes: "",
                        });
                      }}
                    >
                      Record Another Payment
                    </Button>
                  </div>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <FormControl>
                            <Input 
                              list="paymentMethods" 
                              placeholder="Select payment method"
                              {...field} 
                            />
                          </FormControl>
                          <datalist id="paymentMethods">
                            <option value="Cash" />
                            <option value="Bank Transfer" />
                            <option value="Cheque" />
                            <option value="Mobile Money" />
                          </datalist>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any additional information about this payment"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Record Payment
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Fee Summary</CardTitle>
              <CardDescription>
                Current fee status for {currentSemester} Semester, {currentAcademicYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Fees</p>
                  <p className="text-2xl font-bold">${balance.totalFees.toFixed(2)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Amount Paid</p>
                  <p className="text-2xl font-medium text-green-600">
                    ${balance.totalPaid.toFixed(2)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Balance Due</p>
                  <p className={`text-2xl font-bold ${balance.balance > 0 ? "text-red-500" : "text-green-500"}`}>
                    ${balance.balance.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
