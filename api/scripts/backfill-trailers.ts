/**
 * Backfill trailer data for existing events that have movieData but missing trailers
 * Run with: npx ts-node scripts/backfill-trailers.ts
 */

import { PrismaClient } from "@prisma/client";
import { getMovieDetails } from "../src/modules/movies/tmdb.service.js";

const prisma = new PrismaClient();

async function backfillTrailers() {
  console.log("🎬 Starting trailer backfill...\n");

  try {
    // Get all events that have movieData
    const events = await prisma.event.findMany({
      where: {
        movieData: {
          not: null,
        },
      },
      select: {
        id: true,
        title: true,
        movieId: true,
        movieData: true,
      },
    });

    console.log(`📊 Found ${events.length} events with movie data\n`);

    let updated = 0;
    let skipped = 0;
    let failed = 0;

    for (const event of events) {
      const movieData = event.movieData as any;

      // Skip if already has trailer
      if (movieData?.trailer) {
        console.log(`⏭️  Skipping "${event.title}" - already has trailer`);
        skipped++;
        continue;
      }

      // Skip if no movieId (can't fetch from TMDB)
      if (!event.movieId) {
        console.log(`⚠️  Skipping "${event.title}" - no movieId`);
        skipped++;
        continue;
      }

      try {
        console.log(`🔄 Updating "${event.title}"...`);

        // Fetch fresh movie data from TMDB
        const freshMovieData = await getMovieDetails(event.movieId);

        // Update event with fresh data (includes trailer if available)
        await prisma.event.update({
          where: { id: event.id },
          data: {
            movieData: freshMovieData as any,
          },
        });

        if (freshMovieData.trailer) {
          console.log(`✅ Updated "${event.title}" with trailer\n`);
          updated++;
        } else {
          console.log(`⚠️  No trailer available for "${event.title}"\n`);
          skipped++;
        }
      } catch (error: any) {
        console.error(`❌ Failed to update "${event.title}":`, error.message);
        failed++;
      }

      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    console.log("\n🎉 Backfill complete!");
    console.log(`✅ Updated: ${updated}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Failed: ${failed}`);
  } catch (error) {
    console.error("Error during backfill:", error);
  } finally {
    await prisma.$disconnect();
  }
}

backfillTrailers();
