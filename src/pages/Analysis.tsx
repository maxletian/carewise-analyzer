
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useHealth } from '@/contexts/HealthContext';
import { AlertCircle, BarChart, Scale, Activity } from 'lucide-react';

const Analysis = () => {
  const { user } = useAuth();
  const { healthData, calculateBMI, getBMICategory, getHealthRisks } = useHealth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!healthData) {
      navigate('/health-form');
    }
  }, [user, healthData, navigate]);

  if (!user || !healthData) return null;

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory();
  const healthRisks = getHealthRisks();

  const getBmiColor = () => {
    if (!bmi) return 'text-muted-foreground';
    if (bmi < 18.5) return 'text-yellow-500';
    if (bmi < 25) return 'text-carewise-green';
    if (bmi < 30) return 'text-yellow-500';
    return 'text-destructive';
  };

  const getBmiProgressPercentage = () => {
    if (!bmi) return 50;
    if (bmi < 10) return 10;
    if (bmi > 40) return 90;
    return ((bmi - 10) / 30) * 80 + 10; // Scale from 10-40 BMI to 10-90%
  };

  const getRiskLevelColor = (risk: 'low' | 'moderate' | 'high') => {
    switch (risk) {
      case 'low': return 'text-carewise-green';
      case 'moderate': return 'text-yellow-500';
      case 'high': return 'text-destructive';
    }
  };

  const getRiskProgressValue = (risk: 'low' | 'moderate' | 'high') => {
    switch (risk) {
      case 'low': return 25;
      case 'moderate': return 60;
      case 'high': return 90;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Health Analysis</h1>
        <p className="text-muted-foreground">Based on your health data, here's an analysis of potential health risks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scale className="mr-2" /> BMI Analysis
            </CardTitle>
            <CardDescription>Your Body Mass Index</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">BMI Score</span>
                <span className={`font-semibold ${getBmiColor()}`}>{bmi}</span>
              </div>
              <Progress value={getBmiProgressPercentage()} className="h-2" />
            </div>
            
            <div className="p-4 bg-muted rounded-md">
              <p className="font-semibold mb-1">Category: <span className={getBmiColor()}>{bmiCategory}</span></p>
              <p className="text-sm text-muted-foreground">
                {bmiCategory === 'Underweight' && 'You may need to gain some weight. Consider consulting a nutritionist.'}
                {bmiCategory === 'Normal' && 'Your weight is within the healthy range. Keep up the good habits!'}
                {bmiCategory === 'Overweight' && 'You may benefit from losing some weight. Focus on a balanced diet and regular exercise.'}
                {bmiCategory === 'Obese' && 'Your BMI indicates obesity, which increases health risks. Consider consulting a healthcare provider.'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2" /> Lifestyle Impact
            </CardTitle>
            <CardDescription>How your habits affect your health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Physical Activity</p>
                <p className="font-medium capitalize">{healthData.physicalActivity}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Sleep</p>
                <p className="font-medium">
                  {healthData.sleepHours < 6 ? 'Insufficient' : 
                   healthData.sleepHours < 7 ? 'Borderline' : 
                   healthData.sleepHours <= 9 ? 'Optimal' : 'Excessive'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Diet Type</p>
                <p className="font-medium capitalize">{healthData.eatingHabits.dietType}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Smoking</p>
                <p className="font-medium capitalize">{healthData.smokingStatus}</p>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-md">
              <p className="font-semibold mb-1">Lifestyle Impact</p>
              <p className="text-sm text-muted-foreground">
                {healthData.physicalActivity === 'sedentary' 
                  ? 'Your sedentary lifestyle increases several health risks. Regular physical activity is recommended.'
                  : healthData.physicalActivity === 'light'
                  ? 'Increasing your physical activity could provide additional health benefits.'
                  : 'Your active lifestyle helps protect against many chronic diseases. Keep it up!'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2" /> Risk Summary
            </CardTitle>
            <CardDescription>Your potential health risks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {healthRisks.slice(0, 3).map((risk, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{risk.condition}</span>
                    <span className={`font-semibold ${getRiskLevelColor(risk.risk)}`}>
                      {risk.risk.charAt(0).toUpperCase() + risk.risk.slice(1)}
                    </span>
                  </div>
                  <Progress value={getRiskProgressValue(risk.risk)} className="h-1.5" />
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-muted rounded-md">
              <p className="font-semibold mb-1">Total Risk Factors</p>
              <p className="text-sm text-muted-foreground">
                {healthRisks.length > 0 
                  ? `${healthRisks.length} potential health risks identified based on your data.` 
                  : 'No significant health risks identified based on your data.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2" /> Detailed Health Risk Analysis
          </CardTitle>
          <CardDescription>
            Based on your health data, we've identified the following potential health risks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {healthRisks.length > 0 ? (
            <div className="space-y-8">
              {healthRisks.map((risk, index) => (
                <div key={index} className="border-b border-border pb-6 last:border-0 last:pb-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{risk.condition}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      risk.risk === 'low' 
                        ? 'bg-carewise-green/20 text-carewise-green' 
                        : risk.risk === 'moderate'
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-destructive/20 text-destructive'
                    }`}>
                      {risk.risk.toUpperCase()} RISK
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Preventive Measures:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {risk.preventiveMeasures.map((measure, i) => (
                        <li key={i}>{measure}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-muted-foreground">
                No significant health risks were identified based on your data. Keep up your healthy habits!
              </p>
            </div>
          )}

          <div className="mt-8 p-4 bg-carewise-blue/10 rounded-lg border border-carewise-blue/20">
            <div className="flex items-start">
              <AlertCircle className="mt-1 mr-3 text-carewise-blue" />
              <div>
                <p className="font-medium text-foreground mb-1">Important Note</p>
                <p className="text-sm text-muted-foreground">
                  This analysis is based on the information you provided and should not replace professional medical advice. 
                  Always consult with a healthcare provider for a complete evaluation of your health status.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          className="bg-carewise-blue hover:bg-carewise-blue/90"
          onClick={() => navigate('/health-form')}
        >
          Update Health Information
        </Button>
      </div>
    </div>
  );
};

export default Analysis;
