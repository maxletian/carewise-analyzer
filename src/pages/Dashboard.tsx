
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useHealth } from '@/contexts/HealthContext';
import { Activity, ClipboardCheck, AlertCircle, PieChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const Dashboard = () => {
  const { user } = useAuth();
  const { healthData, calculateBMI, getBMICategory } = useHealth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory();

  let bmiColor = 'text-carewise-green';
  let bmiProgress = 50;
  
  if (bmi) {
    if (bmi < 18.5) {
      bmiColor = 'text-yellow-500';
      bmiProgress = 20;
    } else if (bmi < 25) {
      bmiColor = 'text-carewise-green';
      bmiProgress = 50;
    } else if (bmi < 30) {
      bmiColor = 'text-yellow-500';
      bmiProgress = 75;
    } else {
      bmiColor = 'text-destructive';
      bmiProgress = 90;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">Here's an overview of your health status</p>
        </div>
        {!healthData && (
          <Button
            className="mt-4 md:mt-0 bg-carewise-blue hover:bg-carewise-blue/90"
            onClick={() => navigate('/health-form')}
          >
            Complete Health Assessment
          </Button>
        )}
      </div>

      {healthData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* BMI Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex flex-col space-y-1">
                <CardTitle className="text-xl">BMI Score</CardTitle>
                <CardDescription>Body Mass Index</CardDescription>
              </div>
              <PieChart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                <span className={bmiColor}>{bmi}</span>
              </div>
              <Progress value={bmiProgress} className="h-2 mb-2" />
              <p className={`text-sm ${bmiColor}`}>{bmiCategory}</p>
            </CardContent>
          </Card>

          {/* Basic Info Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex flex-col space-y-1">
                <CardTitle className="text-xl">Basic Info</CardTitle>
                <CardDescription>Age, Height, Weight</CardDescription>
              </div>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="text-sm font-medium">{healthData.age} years</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="text-sm font-medium">{healthData.height} cm</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="text-sm font-medium">{healthData.weight} kg</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="text-sm font-medium capitalize">{healthData.gender}</p>
              </div>
            </CardContent>
          </Card>

          {/* Health Status Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex flex-col space-y-1">
                <CardTitle className="text-xl">Health Factors</CardTitle>
                <CardDescription>Lifestyle & Habits</CardDescription>
              </div>
              <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Physical Activity</p>
                <p className="text-sm font-medium capitalize">{healthData.physicalActivity}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Sleep Hours</p>
                <p className="text-sm font-medium">{healthData.sleepHours} hours</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Diet Type</p>
                <p className="text-sm font-medium capitalize">{healthData.eatingHabits.dietType}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Smoking</p>
                <p className="text-sm font-medium capitalize">{healthData.smokingStatus}</p>
              </div>
            </CardContent>
          </Card>

          {/* Health Risks Card */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex flex-col space-y-1">
                <CardTitle className="text-xl">Health Analysis</CardTitle>
                <CardDescription>
                  Based on your health data, here's a summary of your risk factors
                </CardDescription>
              </div>
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-lg mb-4">
                  View your complete health risk analysis and preventive recommendations
                </p>
                <Button onClick={() => navigate('/analysis')} className="bg-carewise-blue hover:bg-carewise-blue/90">
                  See Full Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl">Complete Your Health Assessment</CardTitle>
              <CardDescription>
                To get personalized health insights and recommendations, please complete your health assessment.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6">
              <div className="flex justify-center">
                <ClipboardCheck className="h-16 w-16 text-carewise-blue mb-4" />
              </div>
              <p className="text-center mb-6">
                The assessment will ask you about your general health, habits, and pre-existing conditions to provide an accurate analysis.
              </p>
              <Button 
                className="w-full bg-carewise-blue hover:bg-carewise-blue/90" 
                size="lg"
                onClick={() => navigate('/health-form')}
              >
                Start Health Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
