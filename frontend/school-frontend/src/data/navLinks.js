const navLinks = [
  { to: "/", label: "Home" },
  { to: "/departments", label: "Departments" },
  { to: "/gallery", label: "Gallery" },
  { to: "/news", label: "News" },
  { to: "/tenders", label: "Tenders" },
  { to: "/results", label: "Results" },
  {
    label: "Staff",
    children: [
      { to: "/staff/teachers", label: "Teachers" },
      { to: "/staff/support", label: "Support Staff" },
      { to: "/staff/admin", label: "Admin" },
    ],
  },
  { to: "/dashboard", label: "User Dashboard" }, // Remove if not used
];

export default navLinks;
