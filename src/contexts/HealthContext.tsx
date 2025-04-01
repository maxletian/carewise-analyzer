
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface HealthData {
  age: number;
  height: number; // in cm
  weight: number; // in kg
  gender: 'male' | 'female' | 'other';
  preExistingConditions: string[];
  eatingHabits: {
    dietType: string;
    mealsPerDay: number;
    snacksPerDay: number;
    waterConsumption: number; // glasses per day
    alcoholConsumption: string;
    caffeineConsumption: string;
  };
  physicalActivity: string; // sedentary, light, moderate, high
  sleepHours: number;
  smokingStatus: string; // never, former, current
  familyHistory: string[];
}

interface HealthContextType {
  healthData: HealthData | null;
  setHealthMetrics: (data: HealthData) => void;
  calculateBMI: () => number | null;
  getBMICategory: () => string;
  getHealthRisks: () => { condition: string; risk: 'low' | 'moderate' | 'high'; preventiveMeasures: string[] }[];
}

const defaultHealthData: HealthData = {
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
};

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<HealthData | null>(null);

  useEffect(() => {
    if (user) {
      const savedData = localStorage.getItem('health_data');
      if (savedData) {
        setHealthData(JSON.parse(savedData));
      } else {
        setHealthData(null);
      }
    } else {
      setHealthData(null);
    }
  }, [user]);

  const setHealthMetrics = (data: HealthData) => {
    setHealthData(data);
    localStorage.setItem('health_data', JSON.stringify(data));
  };

  const calculateBMI = (): number | null => {
    if (!healthData) return null;
    const heightInM = healthData.height / 100;
    return parseFloat((healthData.weight / (heightInM * heightInM)).toFixed(1));
  };

  const getBMICategory = (): string => {
    const bmi = calculateBMI();
    if (!bmi) return 'Unknown';
    
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const getHealthRisks = () => {
    const risks: { condition: string; risk: 'low' | 'moderate' | 'high'; preventiveMeasures: string[] }[] = [];
    
    if (!healthData) return risks;
    
    const bmi = calculateBMI();
    const bmiCategory = getBMICategory();
    
    // BMI-related risks
    if (bmiCategory === 'Overweight' || bmiCategory === 'Obese') {
      risks.push({
        condition: 'Type 2 Diabetes',
        risk: bmiCategory === 'Obese' ? 'high' : 'moderate',
        preventiveMeasures: [
          'Maintain a healthy diet rich in fiber and low in processed sugars',
          'Regular physical activity (150+ minutes per week)',
          'Regular blood glucose screening',
          'Weight management through sustainable lifestyle changes'
        ]
      });
      
      risks.push({
        condition: 'Cardiovascular Disease',
        risk: bmiCategory === 'Obese' ? 'high' : 'moderate',
        preventiveMeasures: [
          'Maintain a heart-healthy diet low in saturated fats',
          'Regular aerobic exercise',
          'Monitor blood pressure regularly',
          'Limit sodium intake',
          'Manage stress through mindfulness and relaxation techniques'
        ]
      });
    }
    
    if (bmiCategory === 'Underweight') {
      risks.push({
        condition: 'Nutritional Deficiencies',
        risk: 'moderate',
        preventiveMeasures: [
          'Increase caloric intake with nutrient-dense foods',
          'Consider protein supplementation',
          'Regular health check-ups to monitor nutritional status',
          'Strength training to build muscle mass'
        ]
      });
    }
    
    // Age-related risks
    if (healthData.age > 45) {
      risks.push({
        condition: 'Hypertension',
        risk: healthData.age > 60 ? 'high' : 'moderate',
        preventiveMeasures: [
          'Regular blood pressure monitoring',
          'Limit sodium intake to less than 2,300mg per day',
          'Regular physical activity',
          'Manage stress through mindfulness practices',
          'Maintain a healthy weight'
        ]
      });
    }
    
    // Smoking-related risks
    if (healthData.smokingStatus === 'current') {
      risks.push({
        condition: 'Lung Cancer',
        risk: 'high',
        preventiveMeasures: [
          'Quit smoking - consider nicotine replacement therapy or counseling',
          'Avoid secondhand smoke exposure',
          'Regular lung function testing',
          'Diet rich in antioxidants'
        ]
      });
      
      risks.push({
        condition: 'COPD',
        risk: 'high',
        preventiveMeasures: [
          'Quit smoking immediately',
          'Avoid air pollutants and irritants',
          'Regular pulmonary function tests',
          'Vaccinations for influenza and pneumonia'
        ]
      });
    }
    
    // Sedentary lifestyle risks
    if (healthData.physicalActivity === 'sedentary') {
      risks.push({
        condition: 'Metabolic Syndrome',
        risk: 'moderate',
        preventiveMeasures: [
          'Increase physical activity to at least 150 minutes per week',
          'Break up sitting time with short activity breaks',
          'Strength training twice weekly',
          'Balanced diet rich in fruits, vegetables and whole grains'
        ]
      });
    }
    
    // Sleep-related risks
    if (healthData.sleepHours < 6) {
      risks.push({
        condition: 'Mental Health Issues',
        risk: 'moderate',
        preventiveMeasures: [
          'Improve sleep hygiene - consistent sleep schedule',
          'Limit screen time before bed',
          'Create a comfortable sleep environment',
          'Consider mindfulness or relaxation techniques before bed',
          'Limit caffeine consumption after noon'
        ]
      });
    }
    
    // Pre-existing conditions analysis
    if (healthData.preExistingConditions.includes('diabetes')) {
      risks.push({
        condition: 'Diabetic Complications',
        risk: 'high',
        preventiveMeasures: [
          'Strict blood glucose monitoring',
          'Regular eye examinations',
          'Foot care and regular checkups',
          'Kidney function monitoring',
          'Medication adherence'
        ]
      });
    }
    
    if (healthData.preExistingConditions.includes('hypertension')) {
      risks.push({
        condition: 'Stroke',
        risk: 'high',
        preventiveMeasures: [
          'Blood pressure monitoring and management',
          'Low sodium diet',
          'Regular physical activity',
          'Limit alcohol consumption',
          'Medication adherence'
        ]
      });
    }
    
    // Family history analysis
    if (healthData.familyHistory.includes('heart disease')) {
      risks.push({
        condition: 'Heart Disease',
        risk: 'moderate',
        preventiveMeasures: [
          'Regular cardiovascular check-ups',
          'Heart-healthy diet low in saturated fats',
          'Regular physical activity',
          'Stress management techniques',
          'Consider preventive aspirin therapy (consult doctor)'
        ]
      });
    }
    
    if (healthData.familyHistory.includes('cancer')) {
      risks.push({
        condition: 'Cancer',
        risk: 'moderate',
        preventiveMeasures: [
          'Regular cancer screenings appropriate for age and risk level',
          'Diet rich in antioxidants and low in processed foods',
          'Maintain healthy weight',
          'Limit alcohol consumption',
          'Sun protection'
        ]
      });
    }
    
    return risks;
  };

  return (
    <HealthContext.Provider value={{ 
      healthData, 
      setHealthMetrics, 
      calculateBMI, 
      getBMICategory, 
      getHealthRisks 
    }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
