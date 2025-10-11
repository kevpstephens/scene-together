"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Event {
  id: number;
  title: string;
  dateTime: string;
  location: string;
  maxCapacity: number;
  price: number;
  attendeeCount?: number;
  movie?: {
    title: string;
    posterUrl: string | null;
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const router = useRouter();

  const fetchEvents = async () => {
    try {
      const { data } = await api.get("/events");
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setDeleting(id);
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date TBA";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const isPastEvent = (dateString: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;
    return date < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#46D4AF] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#000102]">Events</h1>
          <p className="mt-2 text-gray-600">
            Manage all screening events ({events.length} total)
          </p>
        </div>
        <Link
          href="/admin/events/create"
          className="px-6 py-3 bg-gradient-to-r from-[#46D4AF] to-[#23797E] text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
        >
          + Create Event
        </Link>
      </div>

      {/* Events Table */}
      {events.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold text-[#000102] mb-2">
            No events yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first screening event to get started
          </p>
          <Link
            href="/admin/events/create"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#46D4AF] to-[#23797E] text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
          >
            Create Event
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => {
                  const past = isPastEvent(event.dateTime);
                  const attendees = event.attendeeCount || 0;
                  const fillPercentage = (attendees / event.maxCapacity) * 100;

                  return (
                    <tr
                      key={event.id}
                      className={`hover:bg-gray-50 ${past ? "opacity-60" : ""}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {event.movie?.posterUrl && (
                            <img
                              src={event.movie.posterUrl}
                              alt={event.title}
                              className="w-10 h-14 object-cover rounded"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-[#000102]">
                              {event.title}
                            </div>
                            {event.movie && (
                              <div className="text-xs text-gray-500">
                                {event.movie.title}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(event.dateTime)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {event.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {attendees} / {event.maxCapacity}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className={`h-1.5 rounded-full ${
                              fillPercentage >= 90
                                ? "bg-red-500"
                                : fillPercentage >= 70
                                  ? "bg-orange-500"
                                  : "bg-[#46D4AF]"
                            }`}
                            style={{ width: `${fillPercentage}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {event.price > 0
                          ? `£${event.price.toFixed(2)}`
                          : "Free"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {past ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            Past
                          </span>
                        ) : fillPercentage >= 100 ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            Full
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button
                          onClick={() =>
                            router.push(`/admin/events/${event.id}/attendees`)
                          }
                          className="text-[#23797E] hover:text-[#46D4AF] transition-colors"
                        >
                          Attendees
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/admin/events/${event.id}/edit`)
                          }
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event.id, event.title)}
                          disabled={deleting === event.id}
                          className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                        >
                          {deleting === event.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
