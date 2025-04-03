
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookUser, BookOpen, LineChart, Settings, User, FileSpreadsheet } from "lucide-react";

const features = [
  {
    icon: <BookUser className="h-8 w-8" />,
    title: "Health Assessment",
    description:
      "Complete comprehensive health assessments tailored to your needs",
    url: "/health-form",
  },
  {
    icon: <LineChart className="h-8 w-8" />,
    title: "Health Analytics",
    description:
      "View detailed analysis of your health data with personalized insights",
    url: "/analysis",
  },
  {
    icon: <User className="h-8 w-8" />,
    title: "User Profile",
    description: "Manage your profile information and preferences",
    url: "/profile",
  },
  {
    icon: <FileSpreadsheet className="h-8 w-8" />,
    title: "School Fees Management",
    description: "Manage student registrations, fee payments, and receipts",
    url: "/school-fees/index",
  },
  {
    icon: <BookOpen className="h-8 w-8" />,
    title: "Documentation",
    description: "Access user guides and documentation on how to use the platform",
    url: "/documentation",
  },
  {
    icon: <Settings className="h-8 w-8" />,
    title: "Settings",
    description: "Configure app settings including theme and notifications",
    url: "/settings",
  },
];

export default function Index() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Platform Dashboard
        </h1>
        <p className="text-xl text-muted-foreground">
          Access both Health Assessment and School Fees Management modules
        </p>
      </div>

      <div className="flex justify-center mb-10">
        <div className="flex gap-4">
          <Link to="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">
              Log In
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900">
                {feature.icon}
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Link to={feature.url} className="w-full">
                <Button variant="outline" className="w-full">
                  Explore
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
