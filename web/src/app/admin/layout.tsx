"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/contexts/AuthContext";
import { checkIsAdmin } from "@/lib/checkAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useRequireAuth();
  const { signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (user) {
        const adminStatus = await checkIsAdmin();
        setIsAdmin(adminStatus);
        setCheckingAdmin(false);
      }
    };
    verifyAdmin();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFF0EF]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#46D4AF] border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFF0EF] p-4">
        <div className="text-center max-w-md bg-white rounded-xl shadow-lg p-8">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-[#000102] mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You need admin privileges to access this dashboard.
          </p>
          <button
            onClick={handleSignOut}
            className="px-6 py-3 bg-gradient-to-r from-[#46D4AF] to-[#23797E] text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/events", label: "Events", icon: "🎬" },
    { href: "/admin/events/create", label: "Create Event", icon: "➕" },
  ];

  return (
    <div className="min-h-screen bg-[#EFF0EF]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/admin" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#46D4AF] to-[#23797E] rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-[#000102]">
                SceneTogether
              </span>
            </Link>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#23797E] transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-yellow-800 text-center">
            🎬 <strong>Demo Mode:</strong> This is a portfolio demonstration.
            Changes may be reset periodically.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-[#46D4AF] text-[#23797E]"
                      : "border-transparent text-gray-600 hover:text-[#23797E] hover:border-gray-300"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
