import { prisma } from "../src/utils/prisma.js";
import "dotenv/config";

async function checkPWYCEvents() {
  console.log("🔍 Checking PWYC event configuration...\n");

  const allEvents = await prisma.event.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      payWhatYouCan: true,
      minPrice: true,
    },
    orderBy: { createdAt: "desc" },
  });

  console.log(`📊 Total events: ${allEvents.length}\n`);

  // Categorize events
  const freeEvents = allEvents.filter((e) => !e.price || e.price === 0);
  const fixedPriceEvents = allEvents.filter(
    (e) => e.price && e.price > 0 && !e.payWhatYouCan
  );
  const pwycEvents = allEvents.filter(
    (e) => e.price && e.price > 0 && e.payWhatYouCan
  );
  const problematicEvents = allEvents.filter(
    (e) => e.payWhatYouCan && (!e.price || e.price === 0)
  );

  console.log("📋 Event Breakdown:");
  console.log(`   Free Events: ${freeEvents.length}`);
  console.log(`   Fixed Price Events: ${fixedPriceEvents.length}`);
  console.log(`   PWYC Events: ${pwycEvents.length}`);
  console.log(
    `   ⚠️  Problematic (PWYC with no price): ${problematicEvents.length}\n`
  );

  if (pwycEvents.length > 0) {
    console.log("💰 PWYC Events:");
    pwycEvents.forEach((e) => {
      console.log(
        `   - ${e.title}: Price £${(e.price! / 100).toFixed(2)}, Min £${((e.minPrice || 0) / 100).toFixed(2)}`
      );
    });
    console.log("");
  }

  if (fixedPriceEvents.length > 0) {
    console.log("🎫 Fixed Price Events:");
    fixedPriceEvents.forEach((e) => {
      console.log(
        `   - ${e.title}: £${(e.price! / 100).toFixed(2)} (PWYC: ${e.payWhatYouCan})`
      );
    });
    console.log("");
  }

  if (problematicEvents.length > 0) {
    console.log("⚠️  PROBLEMATIC Events (PWYC flag but no price):");
    problematicEvents.forEach((e) => {
      console.log(
        `   - ${e.title}: payWhatYouCan=${e.payWhatYouCan}, price=${e.price}`
      );
    });
    console.log("");
  }

  await prisma.$disconnect();
}

checkPWYCEvents().catch((e) => {
  console.error(e);
  process.exit(1);
});
