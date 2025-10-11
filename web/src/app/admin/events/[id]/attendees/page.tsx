"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";

interface RSVP {
  id: number;
  status: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    fullName: string | null;
  };
}

interface Event {
  id: number;
  title: string;
  dateTime: string;
  maxCapacity: number;
}

export default function AttendeesPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id;
  const [event, setEvent] = useState<Event | null>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch event details
        const { data: eventData } = await api.get(`/events/${eventId}`);
        setEvent(eventData);

        // Fetch RSVPs
        const { data: rsvpData } = await api.get(`/events/${eventId}/rsvps`);
        setRsvps(rsvpData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      going: "bg-green-100 text-green-800",
      interested: "bg-blue-100 text-blue-800",
      not_going: "bg-red-100 text-red-800",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      going: "Going",
      interested: "Interested",
      not_going: "Not Going",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const goingCount = rsvps.filter((r) => r.status === "going").length;
  const interestedCount = rsvps.filter((r) => r.status === "interested").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#46D4AF] border-t-transparent"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Event not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => router.push("/admin/events")}
          className="text-[#23797E] hover:text-[#46D4AF] mb-4 inline-flex items-center text-sm font-medium"
        >
          ← Back to Events
        </button>
        <h1 className="text-3xl font-bold text-[#000102]">{event.title}</h1>
        <p className="mt-2 text-gray-600">Attendee List</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm font-medium text-gray-600">Total RSVPs</p>
          <p className="mt-2 text-3xl font-bold text-[#000102]">
            {rsvps.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm font-medium text-gray-600">Going</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{goingCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm font-medium text-gray-600">Interested</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {interestedCount}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm font-medium text-gray-600">Capacity</p>
          <p className="mt-2 text-3xl font-bold text-[#000102]">
            {goingCount} / {event.maxCapacity}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-[#46D4AF] h-2 rounded-full"
              style={{ width: `${(goingCount / event.maxCapacity) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Attendees List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {rsvps.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-[#000102] mb-2">
              No RSVPs yet
            </h3>
            <p className="text-gray-600">
              When people RSVP, they&apos;ll appear here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RSVP Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#000102]">
                        {rsvp.user.fullName || "Anonymous User"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {rsvp.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                          rsvp.status
                        )}`}
                      >
                        {getStatusLabel(rsvp.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(rsvp.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            // Export to CSV
            const csv = [
              ["Name", "Email", "Status", "RSVP Date"],
              ...rsvps.map((r) => [
                r.user.fullName || "Anonymous",
                r.user.email,
                getStatusLabel(r.status),
                formatDate(r.createdAt),
              ]),
            ]
              .map((row) => row.join(","))
              .join("\n");

            const blob = new Blob([csv], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${event.title.replace(/[^a-z0-9]/gi, "_")}_attendees.csv`;
            a.click();
          }}
          className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Export to CSV
        </button>
      </div>
    </div>
  );
}
