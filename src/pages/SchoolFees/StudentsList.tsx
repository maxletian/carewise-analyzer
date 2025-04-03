
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSchoolFees } from "@/contexts/SchoolFeesContext";
import { Student } from "@/types";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { PlusCircle, Search, UserPlus } from "lucide-react";

export default function StudentsList() {
  const { students, getStudentBalance } = useSchoolFees();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.adminNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Students</CardTitle>
            <CardDescription>
              Manage registered students and their fees
            </CardDescription>
          </div>
          <Button onClick={() => navigate("/school-fees/students/register")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Register Student
          </Button>
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
                    <TableHead>Admin #</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => {
                    const { balance } = getStudentBalance(student.id);
                    return (
                      <TableRow key={student.id}>
                        <TableCell>{student.adminNumber}</TableCell>
                        <TableCell>
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell>
                          {student.class} ({student.grade})
                        </TableCell>
                        <TableCell>
                          {formatDate(student.registrationDate)}
                        </TableCell>
                        <TableCell>
                          <span className={balance > 0 ? "text-red-500" : "text-green-500"}>
                            {balance > 0 ? `Due: $${balance.toFixed(2)}` : "Paid"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/school-fees/students/${student.id}`)}
                            >
                              Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/school-fees/payments/new/${student.id}`)}
                            >
                              <PlusCircle className="h-4 w-4 mr-1" />
                              Payment
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No students found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/school-fees/students/register")}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Register Student
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
