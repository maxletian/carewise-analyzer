
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center bg-background text-center px-6">
      <div className="max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-destructive/10 p-3 rounded-full">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl font-medium mb-4">Page Not Found</p>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center">
          <Link to="/">
            <Button className="bg-carewise-blue hover:bg-carewise-blue/90">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
