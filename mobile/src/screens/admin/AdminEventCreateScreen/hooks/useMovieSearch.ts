/*===============================================
 * useMovieSearch Hook - AdminEventCreateScreen
 * ==============================================
 * Handles TMDB movie search and selection for event creation.
 * Fetches movie data including posters and trailers.
 * ==============================================
 */

import { useState } from "react";
import { Alert } from "react-native";
import { api } from "../../../../services/api";

export type Movie = {
  id: number;
  title: string;
  year: string;
  poster: string | null;
  plot: string;
  rating: string;
};

interface UseMovieSearchProps {
  onMovieSelect: (movie: Movie) => void;
  onRemoveMovie: () => void;
}

export interface UseMovieSearchReturn {
  showMovieSearch: boolean;
  searchQuery: string;
  searchResults: Movie[];
  selectedMovie: Movie | null;
  searching: boolean;

  setShowMovieSearch: (value: boolean) => void;
  setSearchQuery: (value: string) => void;
  setSelectedMovie: (movie: Movie | null) => void;

  searchMovies: (query: string) => Promise<void>;
  handleMovieSelect: (movie: Movie) => void;
  handleRemoveMovie: () => void;
}

export const useMovieSearch = ({
  onMovieSelect,
  onRemoveMovie,
}: UseMovieSearchProps): UseMovieSearchReturn => {
  const [showMovieSearch, setShowMovieSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searching, setSearching] = useState(false);

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const { data } = await api.get("/movies/search", {
        params: { query },
      });
      setSearchResults(data.results.slice(0, 5));
    } catch (error: any) {
      console.error("Failed to search movies:", error);
      const errorMsg =
        error.response?.data?.error ||
        error.message ||
        "Failed to search movies";
      Alert.alert("Error", errorMsg);
    } finally {
      setSearching(false);
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    onMovieSelect(movie);
    setSearchResults([]);
    setSearchQuery("");
    setShowMovieSearch(false);
  };

  const handleRemoveMovie = () => {
    setSelectedMovie(null);
    onRemoveMovie();
  };

  return {
    showMovieSearch,
    searchQuery,
    searchResults,
    selectedMovie,
    searching,
    setShowMovieSearch,
    setSearchQuery,
    setSelectedMovie,
    searchMovies,
    handleMovieSelect,
    handleRemoveMovie,
  };
};
