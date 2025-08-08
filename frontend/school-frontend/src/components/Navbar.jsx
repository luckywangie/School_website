import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import navLinks from "../data/navLinks";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // mobile dropdown control

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold text-blue-700">
          MySchool
        </NavLink>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 relative">
          {navLinks.map((link, i) =>
            link.children ? (
              <div key={i} className="group relative">
                <span className="flex items-center cursor-pointer font-medium text-gray-700 hover:text-blue-600">
                  {link.label} <ChevronDown size={16} className="ml-1" />
                </span>
                {/* Dropdown */}
                <div className="absolute left-0 hidden group-hover:block bg-white shadow-lg rounded mt-2 min-w-[180px]">
                  {link.children.map((child, j) => (
                    <NavLink
                      key={j}
                      to={child.to}
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={i}
                to={link.to}
                className={({ isActive }) =>
                  `font-medium hover:text-blue-600 ${
                    isActive
                      ? "text-blue-700 border-b-2 border-blue-700"
                      : "text-gray-700"
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          {navLinks.map((link, i) =>
            link.children ? (
              <div key={i}>
                <button
                  className="w-full flex justify-between px-6 py-3 border-b text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  onClick={() =>
                    setOpenDropdown(openDropdown === i ? null : i)
                  }
                >
                  {link.label}
                  <ChevronDown
                    size={16}
                    className={`transform transition ${
                      openDropdown === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openDropdown === i && (
                  <div className="bg-gray-50">
                    {link.children.map((child, j) => (
                      <NavLink
                        key={j}
                        to={child.to}
                        className="block px-8 py-2 text-gray-700 hover:bg-blue-100"
                        onClick={() => setIsOpen(false)}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={i}
                to={link.to}
                className={({ isActive }) =>
                  `block px-6 py-3 border-b text-gray-700 hover:bg-blue-50 hover:text-blue-700 ${
                    isActive ? "bg-blue-100 font-semibold" : ""
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            )
          )}
        </div>
      )}
    </header>
  );
}
