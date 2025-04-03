
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSchoolFees } from "@/contexts/SchoolFeesContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Users, Book, DollarSign, Calendar } from "lucide-react";

export default function SchoolFeesDashboard() {
  const {
    students,
    payments,
    feesStructures,
    currentAcademicYear,
    currentSemester,
    setAcademicYear,
    setSemester,
    getStudentsWithBalances,
  } = useSchoolFees();
  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Calculate dashboard statistics
  const totalStudents = students.length;
  const totalClasses = Array.from(new Set(students.map((s) => s.class))).length;
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const studentsWithBalance = getStudentsWithBalances().filter(
    (s) => s.balance > 0
  );
  
  // Get recent payments (top 5)
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .slice(0, 5);
  
  // Filter students with outstanding balances
  const filteredStudents = studentsWithBalance.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.adminNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">School Fees Dashboard</h1>
          <p className="text-muted-foreground">
            Manage students, fees, and payments
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex gap-2 items-center">
            <label htmlFor="academicYear" className="text-sm whitespace-nowrap">
              Academic Year:
            </label>
            <Input
              id="academicYear"
              value={currentAcademicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-32"
            />
          </div>
          
          <div className="flex gap-2 items-center">
            <label htmlFor="semester" className="text-sm whitespace-nowrap">
              Semester:
            </label>
            <Input
              id="semester"
              value={currentSemester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-32"
            />
          </div>
        </div>
      </div>
      
      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Registered Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              in {totalClasses} different classes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Outstanding Balances
            </CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentsWithBalance.length}</div>
            <p className="text-xs text-muted-foreground">
              students with unpaid fees
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              from {payments.length} payments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Period
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentSemester}</div>
            <p className="text-xs text-muted-foreground">
              Semester, {currentAcademicYear}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Access Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Button onClick={() => navigate("/school-fees/students/register")}>
          Register Student
        </Button>
        <Button onClick={() => navigate("/school-fees/students")}>
          View All Students
        </Button>
        <Button onClick={() => navigate("/school-fees/fees")}>
          Manage Fee Structure
        </Button>
        <Button onClick={() => navigate("/school-fees/reports")}>
          Generate Reports
        </Button>
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>
              Last {Math.min(recentPayments.length, 5)} payments received
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentPayments.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPayments.map((payment) => {
                      const student = students.find(
                        (s) => s.id === payment.studentId
                      );
                      return (
                        <TableRow key={payment.id}>
                          <TableCell>
                            {student
                              ? `${student.firstName} ${student.lastName}`
                              : "Unknown"}
                          </TableCell>
                          <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                          <TableCell>${payment.amount.toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                No recent payments
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Outstanding Balances</CardTitle>
            <CardDescription>
              Students with unpaid fees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <Search className="h-4 w-4 mr-2 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            {filteredStudents.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Admin #</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.slice(0, 5).map((student) => (
                      <TableRow
                        key={student.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() =>
                          navigate(`/school-fees/students/${student.id}`)
                        }
                      >
                        <TableCell>
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell>{student.adminNumber}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell className="text-red-500 font-medium">
                          ${student.balance.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                No outstanding balances found
              </p>
            )}
            
            {filteredStudents.length > 5 && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={() => navigate("/school-fees/students")}
                >
                  View All {filteredStudents.length} Students
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
