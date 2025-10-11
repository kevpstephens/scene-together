"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { INPUT_CLASSES } from "@/lib/constants";
import axios from "axios";
import Image from "next/image";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  dateTime: z.string().min(1, "Date and time are required"),
  location: z.string().min(1, "Location is required"),
  maxCapacity: z.number().min(1, "Capacity must be at least 1"),
  price: z.number().min(0, "Price cannot be negative"),
  tmdbId: z.number().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
}

export default function CreateEventPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      price: 0,
      maxCapacity: 50,
    },
  });

  const searchMovies = async (query: string) => {
    if (!query.trim() || !TMDB_API_KEY) return;

    setSearching(true);
    try {
      const { data } = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          query,
          include_adult: false,
        },
      });
      setSearchResults(data.results.slice(0, 5));
    } catch (err) {
      console.error("Failed to search movies:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setSearchResults([]);
    setSearchQuery("");
    setValue("title", movie.title);
    setValue("description", movie.overview || "");
    setValue("tmdbId", movie.id);
  };

  const onSubmit = async (data: EventFormData) => {
    setError("");
    setSubmitting(true);

    try {
      await api.post("/events", {
        ...data,
        dateTime: new Date(data.dateTime).toISOString(),
      });
      router.push("/admin/events");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "response" in err
            ? (err as { response?: { data?: { message?: string } } }).response
                ?.data?.message || "Failed to create event"
            : "Failed to create event";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#000102]">Create Event</h1>
        <p className="mt-2 text-gray-600">
          Search for a movie and create a new screening event
        </p>
      </div>

      {/* Movie Search */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-[#000102] mb-4">
          Search Movie (Optional)
        </h2>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.length > 2) {
                searchMovies(e.target.value);
              }
            }}
            placeholder="Search for a movie on TMDb..."
            className={INPUT_CLASSES}
          />
          {searching && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#46D4AF] border-t-transparent"></div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
            {searchResults.map((movie) => (
              <button
                key={movie.id}
                onClick={() => handleMovieSelect(movie)}
                className="w-full flex items-start space-x-4 p-3 border border-gray-200 rounded-lg hover:bg-[#46D4AF]/5 hover:border-[#46D4AF] transition-colors text-left"
              >
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-24 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-[#000102]">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {movie.overview}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Selected Movie */}
        {selectedMovie && (
          <div className="mt-4 p-4 bg-[#46D4AF]/10 border border-[#46D4AF] rounded-lg flex items-start space-x-4">
            {selectedMovie.poster_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w92${selectedMovie.poster_path}`}
                alt={selectedMovie.title}
                className="w-16 h-24 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-[#000102]">
                {selectedMovie.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">Selected from TMDb</p>
            </div>
            <button
              onClick={() => {
                setSelectedMovie(null);
                setValue("tmdbId", undefined);
              }}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Event Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-md p-6 space-y-6"
      >
        <h2 className="text-xl font-semibold text-[#000102]">Event Details</h2>

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
            placeholder="Grand Budapest Hotel Screening"
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
            placeholder="Join us for an unforgettable screening..."
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
            placeholder="The Grand Cinema, London"
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
              placeholder="50"
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
              placeholder="0.00"
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
            {submitting ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
