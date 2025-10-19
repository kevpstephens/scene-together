import React from "react";
import { View, Text, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { CalendarIcon, ClockIcon, StarIcon, FilmIcon } from "react-native-heroicons/outline";
import AnimatedButton from "../../../components/AnimatedButton";
import { theme } from "../../../theme";
import { styles } from "../EventDetailScreen.styles";
import type { Event } from "../../../types";
import { getGenreColor, getYouTubeVideoId } from "../utils";

interface MovieDataSectionProps {
  movieData: Event["movieData"];
  onOpenIMDB: () => void;
}

export const MovieDataSection: React.FC<MovieDataSectionProps> = ({
  movieData,
  onOpenIMDB,
}) => {
  if (!movieData) {
    return null;
  }

  const videoId = movieData.trailer ? getYouTubeVideoId(movieData.trailer) : null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>About the film</Text>
      <Text style={styles.movieTitle}>{movieData.title}</Text>

      {/* Movie Info Badges Row */}
      <View style={styles.movieMetaRow}>
        {movieData.year && (
          <View style={styles.metaChip}>
            <CalendarIcon
              size={12}
              color={theme.colors.text.inverse}
            />
            <Text style={styles.metaChipText}>
              {movieData.year}
            </Text>
          </View>
        )}
        {movieData.runtime && (
          <View style={styles.metaChip}>
            <ClockIcon
              size={12}
              color={theme.colors.text.inverse}
            />
            <Text style={styles.metaChipText}>
              {movieData.runtime}
            </Text>
          </View>
        )}
        {movieData.imdbRating && (
          <View style={styles.metaChip}>
            <StarIcon size={12} color={theme.colors.text.inverse} />
            <Text style={styles.metaChipText}>
              {parseFloat(movieData.imdbRating).toFixed(1)}/10
            </Text>
          </View>
        )}
      </View>

      {movieData.plot && (
        <Text style={styles.moviePlot}>{movieData.plot}</Text>
      )}

      {/* Genre Chips */}
      {movieData.genre && (
        <View style={styles.genreSection}>
          <Text style={styles.movieMetaLabel}>Genres:</Text>
          <View style={styles.genreChipsContainer}>
            {movieData.genre
              .split(",")
              .map((genre, index) => {
                const trimmedGenre = genre.trim();
                return (
                  <View
                    key={index}
                    style={[
                      styles.genreChip,
                      {
                        backgroundColor: getGenreColor(trimmedGenre),
                      },
                    ]}
                  >
                    <Text style={styles.genreChipText}>
                      {trimmedGenre}
                    </Text>
                  </View>
                );
              })}
          </View>
        </View>
      )}

      {movieData.director && (
        <Text style={styles.movieMeta}>
          <Text style={styles.movieMetaLabel}>Director: </Text>
          {movieData.director}
        </Text>
      )}
      {movieData.actors && (
        <Text style={styles.movieMeta}>
          <Text style={styles.movieMetaLabel}>Cast: </Text>
          {movieData.actors}
        </Text>
      )}

      {/* IMDB Button */}
      {movieData?.imdbId && (
        <View style={styles.actionButtons}>
          <AnimatedButton
            style={styles.imdbButton}
            onPress={onOpenIMDB}
          >
            <FilmIcon size={20} color={theme.colors.primary} />
            <Text style={styles.imdbButtonText}>View on IMDB</Text>
          </AnimatedButton>
        </View>
      )}

      {/* Embedded YouTube Trailer */}
      {videoId && (
        <View style={styles.trailerContainer}>
          <View style={styles.trailerTitleRow}>
            <FilmIcon
              size={18}
              color={theme.colors.text.primary}
            />
            <Text style={styles.trailerTitle}>
              Watch Trailer
            </Text>
          </View>

          {Platform.OS === "web" ? (
            // Web: Use iframe directly with 16:9 aspect ratio
            <View style={styles.videoWrapper}>
              <View style={styles.videoAspectRatio}>
                <iframe
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                    borderRadius: 12,
                  }}
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </View>
            </View>
          ) : (
            // Mobile: Use WebView
            <View style={styles.videoWrapper}>
              <WebView
                style={styles.video}
                source={{
                  html: `
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                        <style>
                          * { margin: 0; padding: 0; }
                          body { background: #000; }
                          .container { position: relative; width: 100%; padding-bottom: 56.25%; }
                          iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
                        </style>
                      </head>
                      <body>
                        <div class="container">
                          <iframe 
                            src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1"
                            allowfullscreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          ></iframe>
                        </div>
                      </body>
                    </html>
                  `,
                }}
                allowsFullscreenVideo
                javaScriptEnabled
                domStorageEnabled
                mediaPlaybackRequiresUserAction={false}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

