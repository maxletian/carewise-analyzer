
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Users, 
  Book, 
  DollarSign,
  Settings,
  FileText,
  BarChart 
} from "lucide-react";
import { useSchoolFees } from "@/contexts/SchoolFeesContext";

const SchoolFeesIndex = () => {
  const navigate = useNavigate();
  const { students, payments } = useSchoolFees();
  
  const featureCards = [
    {
      title: "Student Registration",
      description: "Register new students to the system",
      icon: <User className="h-8 w-8 mb-2" />,
      path: "/school-fees/students/register",
    },
    {
      title: "Students Management",
      description: "View and manage all registered students",
      icon: <Users className="h-8 w-8 mb-2" />,
      path: "/school-fees/students",
    },
    {
      title: "Fee Structure",
      description: "Define and manage fee structures",
      icon: <Book className="h-8 w-8 mb-2" />,
      path: "/school-fees/fees",
    },
    {
      title: "Dashboard",
      description: "Overview of fees and payments",
      icon: <BarChart className="h-8 w-8 mb-2" />,
      path: "/school-fees",
    },
    {
      title: "Payments",
      description: "Record and manage fee payments",
      icon: <DollarSign className="h-8 w-8 mb-2" />,
      path: "/school-fees/students", // Redirects to students list where payments can be initiated
    },
    {
      title: "Reports",
      description: "Generate and print fee reports",
      icon: <FileText className="h-8 w-8 mb-2" />,
      path: "/school-fees/reports",
    },
  ];
  
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">School Fees Management System</h1>
        <p className="text-xl text-muted-foreground">
          Efficiently manage student registrations, fee collections, and generate reports
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {featureCards.map((card, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto">{card.icon}</div>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate(card.path)}>Access</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>System Statistics</CardTitle>
            <CardDescription>Current system overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span>Registered Students:</span>
                <span className="font-bold">{students.length}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span>Total Payments:</span>
                <span className="font-bold">{payments.length}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span>Payment Amount:</span>
                <span className="font-bold">
                  ${payments.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/school-fees")}
            >
              View Dashboard
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate("/school-fees/students/register")}
            >
              <User className="h-4 w-4 mr-2" />
              Register New Student
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate("/school-fees/fees")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure Fee Structure
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate("/school-fees/reports")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchoolFeesIndex;
