// src/components/Footer.jsx
import { NavLink } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: About */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-4">About Us</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Welcome to MySchool! We provide the latest news, tenders, and
            updates from our institution to keep you informed.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-4">
            Quick Links
          </h2>
          <ul className="space-y-2">
            <li>
              <NavLink to="/" className="hover:text-white">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/departments" className="hover:text-white">
                Departments
              </NavLink>
            </li>
            <li>
              <NavLink to="/gallery" className="hover:text-white">
                Gallery
              </NavLink>
            </li>
            <li>
              <NavLink to="/news" className="hover:text-white">
                News
              </NavLink>
            </li>
            <li>
              <NavLink to="/tenders" className="hover:text-white">
                Tenders
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact / Social */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-4">Connect</h2>
          <ul className="space-y-2 text-sm">
            <li>Email: info@myschool.com</li>
            <li>Phone: +254 712 345 678</li>
          </ul>

          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-white">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-white">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-white">
              <Instagram size={20} />
            </a>
            <a href="mailto:info@myschool.com" className="hover:text-white">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm border-t border-gray-700 py-4">
        © {new Date().getFullYear()} MySchool. All rights reserved.
      </div>
    </footer>
  );
}
