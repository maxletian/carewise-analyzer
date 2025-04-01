
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useHealth, type HealthData } from '@/contexts/HealthContext';
import { toast } from '@/components/ui/use-toast';

const HealthForm = () => {
  const { user } = useAuth();
  const { healthData: savedHealthData, setHealthMetrics } = useHealth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<HealthData>({
    age: 30,
    height: 170,
    weight: 70,
    gender: 'male',
    preExistingConditions: [],
    eatingHabits: {
      dietType: 'balanced',
      mealsPerDay: 3,
      snacksPerDay: 2,
      waterConsumption: 8,
      alcoholConsumption: 'occasional',
      caffeineConsumption: 'moderate',
    },
    physicalActivity: 'moderate',
    sleepHours: 7,
    smokingStatus: 'never',
    familyHistory: [],
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    
    if (savedHealthData) {
      setFormData(savedHealthData);
    }
  }, [user, savedHealthData, navigate]);

  if (!user) return null;

  const handleInputChange = (field: keyof HealthData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEatingHabitsChange = (field: keyof HealthData['eatingHabits'], value: any) => {
    setFormData((prev) => ({
      ...prev,
      eatingHabits: {
        ...prev.eatingHabits,
        [field]: value
      }
    }));
  };

  const handlePreExistingCondition = (condition: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      preExistingConditions: checked 
        ? [...prev.preExistingConditions, condition]
        : prev.preExistingConditions.filter(c => c !== condition)
    }));
  };

  const handleFamilyHistory = (condition: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      familyHistory: checked 
        ? [...prev.familyHistory, condition]
        : prev.familyHistory.filter(c => c !== condition)
    }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    setHealthMetrics(formData);
    toast({
      title: "Health data saved",
      description: "Your health assessment has been completed successfully"
    });
    navigate('/analysis');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Health Assessment</h1>
      <p className="text-muted-foreground mb-6">
        Please provide accurate information to get the most precise health analysis
      </p>

      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle>Step {currentStep} of 4</CardTitle>
            <span className="text-sm text-muted-foreground">{Math.round((currentStep / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-carewise-blue transition-all duration-300 ease-in-out" 
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </CardHeader>

        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                      min={1}
                      max={120}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={formData.gender}
                      onValueChange={(value) => handleInputChange('gender', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                      min={50}
                      max={250}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
                      min={1}
                      max={300}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Eating Habits</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dietType">Diet Type</Label>
                  <Select 
                    value={formData.eatingHabits.dietType}
                    onValueChange={(value) => handleEatingHabitsChange('dietType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="pescatarian">Pescatarian</SelectItem>
                      <SelectItem value="keto">Keto</SelectItem>
                      <SelectItem value="paleo">Paleo</SelectItem>
                      <SelectItem value="low-carb">Low-carb</SelectItem>
                      <SelectItem value="high-protein">High-protein</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Meals per day: {formData.eatingHabits.mealsPerDay}</Label>
                  <Slider 
                    value={[formData.eatingHabits.mealsPerDay]} 
                    min={1}
                    max={6}
                    step={1}
                    onValueChange={(value) => handleEatingHabitsChange('mealsPerDay', value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Snacks per day: {formData.eatingHabits.snacksPerDay}</Label>
                  <Slider 
                    value={[formData.eatingHabits.snacksPerDay]} 
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={(value) => handleEatingHabitsChange('snacksPerDay', value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Water consumption (glasses per day): {formData.eatingHabits.waterConsumption}</Label>
                  <Slider 
                    value={[formData.eatingHabits.waterConsumption]} 
                    min={0}
                    max={20}
                    step={1}
                    onValueChange={(value) => handleEatingHabitsChange('waterConsumption', value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
                  <Select 
                    value={formData.eatingHabits.alcoholConsumption}
                    onValueChange={(value) => handleEatingHabitsChange('alcoholConsumption', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select alcohol consumption" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="occasional">Occasional</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="frequent">Frequent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="caffeineConsumption">Caffeine Consumption</Label>
                  <Select 
                    value={formData.eatingHabits.caffeineConsumption}
                    onValueChange={(value) => handleEatingHabitsChange('caffeineConsumption', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select caffeine consumption" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="light">Light (1 cup/day)</SelectItem>
                      <SelectItem value="moderate">Moderate (2-4 cups/day)</SelectItem>
                      <SelectItem value="heavy">Heavy (5+ cups/day)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Lifestyle & Health Conditions</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="physicalActivity">Physical Activity Level</Label>
                  <RadioGroup 
                    value={formData.physicalActivity}
                    onValueChange={(value) => handleInputChange('physicalActivity', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sedentary" id="sedentary" />
                      <Label htmlFor="sedentary">Sedentary (little or no exercise)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light">Light (1-3 days/week)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="moderate" />
                      <Label htmlFor="moderate">Moderate (3-5 days/week)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high">High (6-7 days/week)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Sleep Hours per Night: {formData.sleepHours}</Label>
                  <Slider 
                    value={[formData.sleepHours]} 
                    min={3}
                    max={12}
                    step={0.5}
                    onValueChange={(value) => handleInputChange('sleepHours', value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smokingStatus">Smoking Status</Label>
                  <RadioGroup 
                    value={formData.smokingStatus}
                    onValueChange={(value) => handleInputChange('smokingStatus', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="never" id="never" />
                      <Label htmlFor="never">Never smoked</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="former" id="former" />
                      <Label htmlFor="former">Former smoker</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="current" id="current" />
                      <Label htmlFor="current">Current smoker</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Medical History</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base">Pre-existing Conditions</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Check any conditions you have been diagnosed with
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'diabetes', 'hypertension', 'heart disease', 'asthma',
                      'cancer', 'thyroid disorder', 'arthritis', 'depression',
                      'anxiety', 'obesity', 'high cholesterol', 'kidney disease'
                    ].map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`condition-${condition}`} 
                          checked={formData.preExistingConditions.includes(condition)}
                          onCheckedChange={(checked) => {
                            handlePreExistingCondition(condition, checked === true)
                          }}
                        />
                        <Label htmlFor={`condition-${condition}`} className="capitalize">
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Family History</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Check any conditions present in your immediate family
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'diabetes', 'hypertension', 'heart disease', 'stroke',
                      'cancer', 'alzheimer\'s', 'dementia', 'mental illness',
                      'obesity', 'high cholesterol', 'thyroid disorder'
                    ].map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`family-${condition}`}
                          checked={formData.familyHistory.includes(condition)}
                          onCheckedChange={(checked) => {
                            handleFamilyHistory(condition, checked === true)
                          }}
                        />
                        <Label htmlFor={`family-${condition}`} className="capitalize">
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        {currentStep > 1 ? (
          <Button variant="outline" onClick={prevStep}>
            Previous
          </Button>
        ) : (
          <div></div>
        )}
        
        {currentStep < 4 ? (
          <Button className="bg-carewise-blue hover:bg-carewise-blue/90" onClick={nextStep}>
            Next
          </Button>
        ) : (
          <Button className="bg-carewise-green hover:bg-carewise-green/90" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default HealthForm;
