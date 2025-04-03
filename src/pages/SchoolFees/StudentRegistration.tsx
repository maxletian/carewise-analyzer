
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useSchoolFees } from "@/contexts/SchoolFeesContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  adminNumber: z.string().min(2, {
    message: "Admin number must be at least 2 characters.",
  }),
  class: z.string().min(1, {
    message: "Class is required.",
  }),
  grade: z.string().min(1, {
    message: "Grade/Form is required.",
  }),
  guardianName: z.string().min(2, {
    message: "Guardian name must be at least 2 characters.",
  }),
  guardianContact: z.string().min(10, {
    message: "Guardian contact must be at least 10 characters.",
  }),
});

export default function StudentRegistration() {
  const { addStudent } = useSchoolFees();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      adminNumber: "",
      class: "",
      grade: "",
      guardianName: "",
      guardianContact: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const student = addStudent(values);
      toast({
        title: "Success",
        description: `Student ${values.firstName} ${values.lastName} registered successfully.`,
      });
      navigate("/school-fees/students");
    } catch (error) {
      console.error(error);
      // Error is already handled in the context
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Student Registration</CardTitle>
          <CardDescription>
            Register a new student for the current semester
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adminNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Admin Number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Unique student identification number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade/Form</FormLabel>
                      <FormControl>
                        <Input placeholder="Grade/Form" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                      <FormControl>
                        <Input placeholder="Class (e.g., 1A, 2B)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <hr className="my-4" />
                  <h3 className="text-lg font-medium my-2">Guardian Information</h3>
                </div>

                <FormField
                  control={form.control}
                  name="guardianName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guardian Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Guardian Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guardianContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guardian Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Guardian Contact" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/school-fees/students")}
                >
                  Cancel
                </Button>
                <Button type="submit">Register Student</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
