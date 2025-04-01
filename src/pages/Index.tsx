
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Activity, ClipboardCheck, BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Your Personal <span className="text-carewise-blue">Health</span>{" "}
                <span className="text-carewise-green">Analyzer</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md">
                Understand your health risks and get personalized recommendations to improve your wellbeing.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button className="px-8 bg-carewise-blue hover:bg-carewise-blue/90">
                    Get Started <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-carewise-blue/30 rounded-full filter blur-3xl opacity-30"></div>
                <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-carewise-green/30 rounded-full filter blur-3xl opacity-30"></div>
                <div className="relative bg-card rounded-xl shadow-lg border border-border p-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="bg-background p-4 rounded-lg flex items-center">
                      <div className="bg-carewise-blue/10 p-3 rounded-full mr-4">
                        <Activity className="text-carewise-blue" />
                      </div>
                      <div>
                        <h3 className="font-medium">Health Assessment</h3>
                        <p className="text-sm text-muted-foreground">Analyze your health profile</p>
                      </div>
                    </div>
                    <div className="bg-background p-4 rounded-lg flex items-center">
                      <div className="bg-carewise-green/10 p-3 rounded-full mr-4">
                        <BarChart3 className="text-carewise-green" />
                      </div>
                      <div>
                        <h3 className="font-medium">Risk Predictions</h3>
                        <p className="text-sm text-muted-foreground">Identify potential health issues</p>
                      </div>
                    </div>
                    <div className="bg-background p-4 rounded-lg flex items-center">
                      <div className="bg-carewise-lightblue/10 p-3 rounded-full mr-4">
                        <ClipboardCheck className="text-carewise-lightblue" />
                      </div>
                      <div>
                        <h3 className="font-medium">Preventive Measures</h3>
                        <p className="text-sm text-muted-foreground">Get personalized recommendations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How CareWise Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We analyze your health data to provide personalized insights and recommendations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-6 rounded-xl">
              <div className="bg-carewise-blue/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <ClipboardCheck className="text-carewise-blue" />
              </div>
              <h3 className="text-xl font-medium mb-2">1. Share Your Health Data</h3>
              <p className="text-muted-foreground">
                Answer questions about your health, habits, and pre-existing conditions to build your profile.
              </p>
            </div>
            
            <div className="bg-card border border-border p-6 rounded-xl">
              <div className="bg-carewise-lightblue/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Activity className="text-carewise-lightblue" />
              </div>
              <h3 className="text-xl font-medium mb-2">2. Analyze Your Risk Factors</h3>
              <p className="text-muted-foreground">
                Our system analyzes your data to identify potential health risks and concerns.
              </p>
            </div>
            
            <div className="bg-card border border-border p-6 rounded-xl">
              <div className="bg-carewise-green/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="text-carewise-green" />
              </div>
              <h3 className="text-xl font-medium mb-2">3. Get Prevention Tips</h3>
              <p className="text-muted-foreground">
                Receive personalized recommendations to reduce risks and improve your health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-carewise-blue to-carewise-lightblue rounded-2xl p-8 md:p-12 text-white">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Take Control of Your Health Today
              </h2>
              <p className="text-lg mb-8 text-white/90">
                Join thousands of users who have discovered their health risks and improved their wellbeing with CareWise.
              </p>
              <Link to="/signup">
                <Button size="lg" className="bg-white text-carewise-blue hover:bg-white/90">
                  Start Your Free Assessment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
