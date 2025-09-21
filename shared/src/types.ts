export type Role = "member" | "staff";

export type Event = {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO
  location?: string;
  onlineLink?: string;
  movieId?: string; // OMDb/TMDb ID
};
