
import React, { useState } from "react";
import { useSchoolFees } from "@/contexts/SchoolFeesContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useNavigate } from "react-router-dom";
import { Check, Download, FileText, Printer, User } from "lucide-react";

export default function Reports() {
  const navigate = useNavigate();
  const {
    students,
    getStudentsWithBalances,
    currentAcademicYear,
    currentSemester,
  } = useSchoolFees();
  
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  
  const studentsWithBalance = getStudentsWithBalances();
  // Students with outstanding balances
  const outstandingBalances = studentsWithBalance.filter((s) => s.balance > 0);
  // Students who have fully paid
  const fullyPaid = studentsWithBalance.filter((s) => s.balance <= 0);
  
  // Group students by class
  const studentsByClass = students.reduce((acc, student) => {
    if (!acc[student.class]) {
      acc[student.class] = [];
    }
    acc[student.class].push(student);
    return acc;
  }, {} as Record<string, typeof students>);
  
  // Class list with count and fee collection rate
  const classList = Object.entries(studentsByClass).map(([className, studentsList]) => {
    const classStudents = studentsList.map(student => {
      const balanceInfo = studentsWithBalance.find(s => s.id === student.id);
      return balanceInfo || {
        ...student,
        totalFees: 0,
        totalPaid: 0,
        balance: 0,
        payments: [],
        currentSemester,
        currentAcademicYear
      };
    });
    
    const totalFees = classStudents.reduce((sum, s) => sum + s.totalFees, 0);
    const totalPaid = classStudents.reduce((sum, s) => sum + s.totalPaid, 0);
    const collectionRate = totalFees > 0 ? (totalPaid / totalFees) * 100 : 0;
    
    return {
      className,
      count: studentsList.length,
      totalFees,
      totalPaid,
      collectionRate
    };
  });
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const renderSelectedReport = () => {
    switch (selectedReport) {
      case "outstanding":
        return (
          <div className="print:p-8">
            <div className="print:mb-4 print:text-center">
              <h2 className="print:text-2xl font-bold">Outstanding Balances Report</h2>
              <p className="print:text-lg">
                {currentSemester} Semester, {currentAcademicYear}
              </p>
              <p className="print:text-sm">Generated on {new Date().toLocaleDateString()}</p>
            </div>
            
            {outstandingBalances.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin #</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Total Fees</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outstandingBalances.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.adminNumber}</TableCell>
                      <TableCell>
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>${student.totalFees.toFixed(2)}</TableCell>
                      <TableCell>${student.totalPaid.toFixed(2)}</TableCell>
                      <TableCell className="text-red-500 font-medium">
                        ${student.balance.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center py-4">No outstanding balances found</p>
            )}
            
            <div className="mt-4 print:mt-8 print:text-right">
              <p>
                <strong>Total Outstanding: </strong>$
                {outstandingBalances
                  .reduce((sum, student) => sum + student.balance, 0)
                  .toFixed(2)}
              </p>
              <p>
                <strong>Total Students: </strong>
                {outstandingBalances.length}
              </p>
            </div>
          </div>
        );
        
      case "fullypaid":
        return (
          <div className="print:p-8">
            <div className="print:mb-4 print:text-center">
              <h2 className="print:text-2xl font-bold">Fully Paid Students Report</h2>
              <p className="print:text-lg">
                {currentSemester} Semester, {currentAcademicYear}
              </p>
              <p className="print:text-sm">Generated on {new Date().toLocaleDateString()}</p>
            </div>
            
            {fullyPaid.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin #</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Total Fees</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fullyPaid.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.adminNumber}</TableCell>
                      <TableCell>
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>${student.totalFees.toFixed(2)}</TableCell>
                      <TableCell>${student.totalPaid.toFixed(2)}</TableCell>
                      <TableCell className="text-green-500 font-medium">
                        <span className="flex items-center">
                          <Check className="h-4 w-4 mr-1" /> Paid
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center py-4">No fully paid students found</p>
            )}
            
            <div className="mt-4 print:mt-8 print:text-right">
              <p>
                <strong>Total Students: </strong>
                {fullyPaid.length}
              </p>
              <p>
                <strong>Total Collected: </strong>$
                {fullyPaid
                  .reduce((sum, student) => sum + student.totalPaid, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        );
        
      case "classwise":
        return (
          <div className="print:p-8">
            <div className="print:mb-4 print:text-center">
              <h2 className="print:text-2xl font-bold">Class-wise Fee Collection Report</h2>
              <p className="print:text-lg">
                {currentSemester} Semester, {currentAcademicYear}
              </p>
              <p className="print:text-sm">Generated on {new Date().toLocaleDateString()}</p>
            </div>
            
            {classList.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Total Students</TableHead>
                    <TableHead>Total Fees</TableHead>
                    <TableHead>Amount Collected</TableHead>
                    <TableHead>Collection Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classList.map((classInfo) => (
                    <TableRow key={classInfo.className}>
                      <TableCell>{classInfo.className}</TableCell>
                      <TableCell>{classInfo.count}</TableCell>
                      <TableCell>${classInfo.totalFees.toFixed(2)}</TableCell>
                      <TableCell>${classInfo.totalPaid.toFixed(2)}</TableCell>
                      <TableCell>
                        {classInfo.collectionRate.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center py-4">No class data available</p>
            )}
            
            <div className="mt-4 print:mt-8 print:text-right">
              <p>
                <strong>Total Classes: </strong>
                {classList.length}
              </p>
              <p>
                <strong>Total Students: </strong>
                {students.length}
              </p>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-10">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
            <p className="mt-4">Select a report from the list to generate</p>
          </div>
        );
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Fee Reports</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>
                Select a report to generate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={selectedReport === "outstanding" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedReport("outstanding")}
              >
                <User className="h-4 w-4 mr-2" />
                Outstanding Balances Report
              </Button>
              
              <Button
                variant={selectedReport === "fullypaid" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedReport("fullypaid")}
              >
                <Check className="h-4 w-4 mr-2" />
                Fully Paid Students Report
              </Button>
              
              <Button
                variant={selectedReport === "classwise" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedReport("classwise")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Class-wise Fee Collection Report
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigate("/school-fees")}
              >
                Back to Dashboard
              </Button>
              
              {selectedReport && (
                <Button onClick={handlePrint} className="print:hidden">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-2 print:col-span-full">
          <Card className="print:shadow-none print:border-none">
            <CardHeader className="print:hidden">
              <CardTitle>
                {selectedReport
                  ? selectedReport === "outstanding"
                    ? "Outstanding Balances Report"
                    : selectedReport === "fullypaid"
                    ? "Fully Paid Students Report"
                    : "Class-wise Fee Collection Report"
                  : "Report Preview"}
              </CardTitle>
              <CardDescription>
                {selectedReport
                  ? `${currentSemester} Semester, ${currentAcademicYear}`
                  : "Select a report to view"}
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto">
              {renderSelectedReport()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
