import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      setCheckingAuth(true);
      try {
        const res = await api.get("/auth/check");
        setIsLoggedIn(true);
        setUser(res.data.user || null);
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setIsLoggedIn(false);
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const getUserInitials = useCallback(() => {
    if (!user) return "";
    const firstInitial = user.firstName ? user.firstName.charAt(0) : "";
    const lastInitial = user.lastName ? user.lastName.charAt(0) : "";
    return (firstInitial + lastInitial).toUpperCase();
  }, [user]);

  const showLoginLink = location.pathname === "/register";
  const showRegisterLink = location.pathname === "/login";

  if (checkingAuth) {
    return (
      <header className="w-full flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 md:px-12 py-4 shadow-lg text-white font-montserrat select-none sticky top-0 z-30">
        <Link
          to="/"
          className="font-extrabold text-2xl tracking-widest text-emerald-400 drop-shadow-md"
        >
          ARVYA.X
        </Link>
        <nav>
          <span className="text-emerald-400 animate-pulse">Checking auth…</span>
        </nav>
      </header>
    );
  }

  return (
    <header className="w-full flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 md:px-12 py-4 shadow-lg text-white font-montserrat select-none sticky top-0 z-30">
      <Link
        to="/sessions"
        className="font-extrabold text-2xl tracking-widest text-emerald-400 drop-shadow-md transition-transform duration-300 hover:scale-105"
        aria-label="Go to ARVYA.X homepage"
      >
        ARVYA.X
      </Link>
      <nav className="flex items-center gap-8 text-sm md:text-base font-semibold tracking-wide">
        <Link
          to="/sessions"
          className="relative py-1 px-2.5 text-white hover:text-emerald-400 transition-colors duration-200 group"
        >
          Sessions
          <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-emerald-500 rounded transition-all group-hover:w-full group-focus:w-full" />
        </Link>
        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              className="relative py-1 px-2.5 text-white hover:text-emerald-400 transition-colors duration-200 group"
            >
              Dashboard
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-emerald-500 rounded transition-all group-hover:w-full" />
            </Link>
            <Link
              to="/my-sessions"
              className="relative py-1 px-2.5 text-white hover:text-emerald-400 transition-colors duration-200 group"
            >
              My Sessions
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-emerald-500 rounded transition-all group-hover:w-full" />
            </Link>
            {/* Avatar and full name */}
            <div className="flex items-center gap-4 ml-6">
              <div
                className="relative w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shadow-lg border border-emerald-300 ring-1 ring-emerald-300 select-none"
                aria-label={`User profile: ${user?.firstName || ""} ${
                  user?.lastName || ""
                }`}
                title={`${user?.firstName || ""} ${
                  user?.lastName || ""
                }`.trim()}
              >
                {getUserInitials() || "U"}
                <span className="absolute inset-0 rounded-full ring-2 ring-emerald-400 opacity-0 hover:opacity-40 transition-opacity duration-350" />
              </div>
              <span className="hidden md:block max-w-48 whitespace-nowrap truncate font-medium text-emerald-200">
                {`${user?.firstName || ""} ${user?.lastName || ""}`.trim()}
              </span>
            </div>
            <button
              onClick={handleLogout}
              type="button"
              aria-label="Logout"
              className="ml-8 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-400 focus:outline-none shadow-md transition-shadow duration-300 cursor-pointer text-white font-semibold border border-emerald-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {showLoginLink && (
              <Link
                to="/login"
                className="py-2 px-4 rounded-md hover:text-emerald-400 transition-colors"
              >
                Login
              </Link>
            )}
            {showRegisterLink && (
              <Link
                to="/register"
                className="py-2 px-4 rounded-md hover:text-emerald-400 transition-colors"
              >
                Register
              </Link>
            )}
            {!showLoginLink && !showRegisterLink && (
              <>
                <Link
                  to="/login"
                  className="py-2 px-4 rounded-md hover:text-emerald-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="py-2 px-4 rounded-md hover:text-emerald-400 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
