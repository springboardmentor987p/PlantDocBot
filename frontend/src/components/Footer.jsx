import React from 'react';
import { Separator } from './ui/separator.jsx';
import { Leaf, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-green-100">
      <div className="container mx-auto px-4 py-8">
        <Separator className="mb-8" />
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-lg">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">PLANT DOC</h3>
                <p className="text-sm text-gray-600">Disease Detection System</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 max-w-sm">
              Advanced AI-powered plant disease detection system, helping gardeners and farmers to 
              protect their crops with intelligent diagnosis and treatment recommendations.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Features</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Text-based Disease Analysis</li>
              <li>• Image Recognition Technology</li>
              <li>• Treatment Recommendations</li>
              <li>• User-friendly Interface</li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Plant Care Tips</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Regular monitoring prevents disease</li>
              <li>• Proper watering reduces fungal issues</li>
              <li>• Good air circulation is essential</li>
              <li>• Early detection saves plants</li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-green-100 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>© {currentYear} PLANT DOC. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for plant lovers everywhere</span>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Plant Guard uses advanced machine learning algorithms to provide disease predictions. 
              Always consult with agricultural experts for severe plant health issues.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;