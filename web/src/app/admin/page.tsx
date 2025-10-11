"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalRSVPs: number;
  todayEvents: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    totalRSVPs: 0,
    todayEvents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/events");
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        const totalEvents = data.length;
        const upcomingEvents = data.filter(
          (event: any) => new Date(event.dateTime) > now
        ).length;
        const todayEvents = data.filter((event: any) => {
          const eventDate = new Date(event.dateTime);
          return (
            eventDate.getFullYear() === today.getFullYear() &&
            eventDate.getMonth() === today.getMonth() &&
            eventDate.getDate() === today.getDate()
          );
        }).length;
        const totalRSVPs = data.reduce(
          (sum: number, event: any) => sum + (event.attendeeCount || 0),
          0
        );

        setStats({ totalEvents, upcomingEvents, totalRSVPs, todayEvents });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Events",
      value: stats.totalEvents,
      icon: "🎬",
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Upcoming Events",
      value: stats.upcomingEvents,
      icon: "📅",
      color: "from-green-500 to-green-600",
    },
    {
      label: "Total RSVPs",
      value: stats.totalRSVPs,
      icon: "👥",
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Today's Events",
      value: stats.todayEvents,
      icon: "⭐",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#000102]">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to the SceneTogether admin dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {card.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-[#000102]">
                  {loading ? "..." : card.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center text-2xl`}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-[#000102] mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/events/create"
            className="flex items-center space-x-3 p-4 border-2 border-[#46D4AF] rounded-lg hover:bg-[#46D4AF]/5 transition-colors group"
          >
            <div className="w-10 h-10 bg-[#46D4AF] rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              ➕
            </div>
            <div>
              <p className="font-semibold text-[#000102]">Create Event</p>
              <p className="text-sm text-gray-600">Add a new screening</p>
            </div>
          </Link>

          <Link
            href="/admin/events"
            className="flex items-center space-x-3 p-4 border-2 border-[#23797E] rounded-lg hover:bg-[#23797E]/5 transition-colors group"
          >
            <div className="w-10 h-10 bg-[#23797E] rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              📋
            </div>
            <div>
              <p className="font-semibold text-[#000102]">Manage Events</p>
              <p className="text-sm text-gray-600">View all events</p>
            </div>
          </Link>

          <div className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg opacity-50">
            <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center text-xl">
              📊
            </div>
            <div>
              <p className="font-semibold text-[#000102]">Analytics</p>
              <p className="text-sm text-gray-600">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
