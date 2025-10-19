/**
 * Fix event times to be reasonable evening times (6pm-11pm)
 * Run with: npx tsx scripts/fix-event-times.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Reasonable evening times for film screenings (in 24-hour format)
const REASONABLE_TIMES = [
  { hour: 18, minute: 0 }, // 6:00 PM
  { hour: 18, minute: 30 }, // 6:30 PM
  { hour: 19, minute: 0 }, // 7:00 PM
  { hour: 19, minute: 30 }, // 7:30 PM
  { hour: 20, minute: 0 }, // 8:00 PM
  { hour: 20, minute: 30 }, // 8:30 PM
  { hour: 21, minute: 0 }, // 9:00 PM
];

function getRandomTime() {
  return REASONABLE_TIMES[Math.floor(Math.random() * REASONABLE_TIMES.length)];
}

function isWeirdTime(date: Date): boolean {
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();

  // Consider times between midnight and 6am, or with odd seconds/milliseconds as "weird"
  return (
    (hour >= 0 && hour < 6) ||
    date.getUTCSeconds() > 0 ||
    date.getUTCMilliseconds() > 0
  );
}

async function fixEventTimes() {
  console.log("🕐 Starting event time fix...\n");

  try {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        date: true,
      },
    });

    console.log(`📊 Found ${events.length} events\n`);

    let fixed = 0;
    let skipped = 0;

    for (const event of events) {
      const eventDate = new Date(event.date);

      if (!isWeirdTime(eventDate)) {
        console.log(
          `✅ "${event.title}" - already has reasonable time (${eventDate.toLocaleTimeString("en-US")})`
        );
        skipped++;
        continue;
      }

      // Get a random reasonable time
      const { hour, minute } = getRandomTime();

      // Create new date with same day but new time (in UTC)
      const newDate = new Date(eventDate);
      newDate.setUTCHours(hour, minute, 0, 0);

      await prisma.event.update({
        where: { id: event.id },
        data: { date: newDate },
      });

      const oldTime = eventDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const newTime = newDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      console.log(`🔧 Fixed "${event.title}"`);
      console.log(`   Old: ${oldTime} → New: ${newTime}\n`);
      fixed++;
    }

    console.log("\n🎉 Fix complete!");
    console.log(`🔧 Fixed: ${fixed}`);
    console.log(`✅ Already OK: ${skipped}`);
  } catch (error) {
    console.error("Error fixing times:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixEventTimes();
