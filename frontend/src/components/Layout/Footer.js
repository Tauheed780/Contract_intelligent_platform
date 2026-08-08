// src/components/Layout/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container-custom py-6">
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
          <p>© 2024 Contract Analyser. All rights reserved.</p>
          <div className="flex space-x-6 mt-2 md:mt-0">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;