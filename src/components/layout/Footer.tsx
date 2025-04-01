
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold text-carewise-blue">Care<span className="text-carewise-green">Wise</span></span>
            <p className="text-sm text-muted-foreground mt-1">Your personal health analyzer</p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition">
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {year} CareWise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
