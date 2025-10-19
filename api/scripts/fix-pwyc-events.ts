import { prisma } from "../src/utils/prisma.js";
import "dotenv/config";

async function fixPWYCEvents() {
  console.log("🔧 Fixing problematic PWYC events...\n");

  // Find events with PWYC flag but no price
  const problematicEvents = await prisma.event.findMany({
    where: {
      payWhatYouCan: true,
      OR: [{ price: null }, { price: 0 }],
    },
    select: {
      id: true,
      title: true,
      price: true,
      payWhatYouCan: true,
      minPrice: true,
    },
  });

  if (problematicEvents.length === 0) {
    console.log("✅ No problematic events found!");
    await prisma.$disconnect();
    return;
  }

  console.log(`⚠️  Found ${problematicEvents.length} problematic events:\n`);

  for (const event of problematicEvents) {
    console.log(
      `   - ${event.title}: payWhatYouCan=${event.payWhatYouCan}, price=${event.price}`
    );

    // Fix: Set payWhatYouCan to false for events with no price
    await prisma.event.update({
      where: { id: event.id },
      data: {
        payWhatYouCan: false,
        minPrice: null,
      },
    });

    console.log(`     ✅ Fixed! Set payWhatYouCan=false\n`);
  }

  console.log(
    `🎉 Fixed ${problematicEvents.length} events! They are now free events.`
  );

  await prisma.$disconnect();
}

fixPWYCEvents().catch((e) => {
  console.error(e);
  process.exit(1);
});
