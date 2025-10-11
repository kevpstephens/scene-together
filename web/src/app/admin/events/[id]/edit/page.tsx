"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { INPUT_CLASSES } from "@/lib/constants";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  dateTime: z.string().min(1, "Date and time are required"),
  location: z.string().min(1, "Location is required"),
  maxCapacity: z.number().min(1, "Capacity must be at least 1"),
  price: z.number().min(0, "Price cannot be negative"),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${eventId}`);
        setValue("title", data.title);
        setValue("description", data.description);
        // Convert to datetime-local format
        const date = new Date(data.dateTime);
        const localDateTime = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16);
        setValue("dateTime", localDateTime);
        setValue("location", data.location);
        setValue("maxCapacity", data.maxCapacity);
        setValue("price", data.price || 0);
      } catch (err) {
        console.error("Failed to fetch event:", err);
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, setValue]);

  const onSubmit = async (data: EventFormData) => {
    setError("");
    setSubmitting(true);

    try {
      await api.put(`/events/${eventId}`, {
        ...data,
        dateTime: new Date(data.dateTime).toISOString(),
      });
      router.push("/admin/events");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update event");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#46D4AF] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#000102]">Edit Event</h1>
        <p className="mt-2 text-gray-600">Update event details</p>
      </div>

      {/* Event Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-md p-6 space-y-6"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Event Title *
          </label>
          <input
            id="title"
            type="text"
            {...register("title")}
            className={INPUT_CLASSES}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            className={INPUT_CLASSES}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Date & Time */}
        <div>
          <label
            htmlFor="dateTime"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Date & Time *
          </label>
          <input
            id="dateTime"
            type="datetime-local"
            {...register("dateTime")}
            className={INPUT_CLASSES}
          />
          {errors.dateTime && (
            <p className="mt-1 text-sm text-red-600">
              {errors.dateTime.message}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Location *
          </label>
          <input
            id="location"
            type="text"
            {...register("location")}
            className={INPUT_CLASSES}
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">
              {errors.location.message}
            </p>
          )}
        </div>

        {/* Capacity & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="maxCapacity"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Max Capacity *
            </label>
            <input
              id="maxCapacity"
              type="number"
              {...register("maxCapacity", { valueAsNumber: true })}
              className={INPUT_CLASSES}
            />
            {errors.maxCapacity && (
              <p className="mt-1 text-sm text-red-600">
                {errors.maxCapacity.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Price (£)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className={INPUT_CLASSES}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/events")}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-gradient-to-r from-[#46D4AF] to-[#23797E] text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
