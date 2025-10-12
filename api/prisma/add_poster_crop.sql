-- Add posterCrop field to Event table
-- This stores the crop/zoom/pan settings for how the poster appears in event cards
-- Format: { "scale": 1.0, "translateX": 0, "translateY": 0 }

ALTER TABLE "Event" ADD COLUMN "posterCrop" JSONB;

-- Update the schema to include this field
COMMENT ON COLUMN "Event"."posterCrop" IS 'Crop settings for poster display in event cards (scale, translateX, translateY)';


