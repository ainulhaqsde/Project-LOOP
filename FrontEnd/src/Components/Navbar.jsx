import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiLogOut, FiZap } from "react-icons/fi";

function getUser() {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");
  const user = getUser();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-all ${
      isActive
        ? "bg-blue-500/10 text-blue-300"
        : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  const adminLinkClass = ({ isActive }) =>
    `rounded-lg border px-3 py-2 text-sm font-semibold transition-all ${
      isActive
        ? "border-violet-400/30 bg-violet-500/10 text-violet-300"
        : "border-white/10 text-slate-300 hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-300"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to={token ? "/dashboard" : "/"}
          className="group flex items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-blue-300 shadow-lg shadow-blue-950/20 transition group-hover:scale-105">
            <FiZap size={18} />
          </span>
          <span>
            <span className="block text-base font-extrabold tracking-[0.08em] text-white sm:text-lg">PROJECT LOOP</span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 sm:block">Feedback Intelligence</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        <div className={`${open ? "flex" : "hidden"} absolute left-4 right-4 top-[72px] flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl lg:static lg:flex lg:flex-row lg:items-center lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}>
          {!token ? (
            <>
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              <NavLink to="/info" className={navLinkClass}>Features</NavLink>
              <NavLink to="/info" className={navLinkClass}>About</NavLink>
              <NavLink to="/login" className={navLinkClass}>Sign In</NavLink>
              <Link
                to="/register"
                className="mt-1 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-violet-500 lg:ml-1 lg:mt-0"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/feedback" className={navLinkClass}>Feedback</NavLink>
              <NavLink to="/add-feedback" className={navLinkClass}>Add Feedback</NavLink>
              <NavLink to="/analytics" className={navLinkClass}>Analytics</NavLink>
              <NavLink to="/ask-ai" className={navLinkClass}>Ask AI</NavLink>
              {isAdmin && (
                <>
                  <NavLink to="/admin" className={adminLinkClass}>Admin</NavLink>
                  <NavLink to="/admin/users" className={adminLinkClass}>Users</NavLink>
                </>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-lg border border-red-400/20 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 lg:ml-1"
              >
                <FiLogOut size={15} /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
