// Web calendar helpers for Expo Web
// Provides utilities to add events to Google Calendar or download an ICS file

export type WebCalendarEvent = {
  id?: string;
  title: string;
  description?: string;
  location?: string;
  startUtcISO: string; // ISO string in UTC
  endUtcISO: string; // ISO string in UTC
};

function formatDatesForGoogle(startUtcISO: string, endUtcISO: string) {
  const start =
    new Date(startUtcISO).toISOString().replace(/[-:]/g, "").split(".")[0] +
    "Z";
  const end =
    new Date(endUtcISO).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return `${start}/${end}`;
}

export function buildGoogleCalendarUrl(event: WebCalendarEvent) {
  const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const params = new URLSearchParams({
    text: event.title,
    dates: formatDatesForGoogle(event.startUtcISO, event.endUtcISO),
    details: event.description || "",
    location: event.location || "",
  });
  return `${base}&${params.toString()}`;
}

function escapeICSText(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function createIcsFromEvent(event: WebCalendarEvent) {
  const uid = event.id || `${Date.now()}@scenetogether`;
  const dtStart =
    new Date(event.startUtcISO)
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0] + "Z";
  const dtEnd =
    new Date(event.endUtcISO).toISOString().replace(/[-:]/g, "").split(".")[0] +
    "Z";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SceneTogether//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStart}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeICSText(event.title)}`,
    event.description
      ? `DESCRIPTION:${escapeICSText(event.description)}`
      : undefined,
    event.location ? `LOCATION:${escapeICSText(event.location)}` : undefined,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean) as string[];

  return lines.join("\r\n");
}

export function downloadIcs(filename: string, icsContent: string) {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
