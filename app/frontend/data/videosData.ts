export interface Video {
  id: number;
  title: string;
  youtube_id: string;
  year: number;
  category: string;
  description: string;
  thumbnail: string;
}

export const sampleVideos: Video[] = [
  {
    id: 1,
    title: "Festival Opening 2024",
    youtube_id: "dQw4w9WgXcQ",
    year: 2024,
    category: "Highlights",
    description:
      "Relive the magical opening ceremony from last year's unforgettable festival experience.",
    thumbnail:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    title: "Best Dance Moments",
    youtube_id: "dQw4w9WgXcQ",
    year: 2024,
    category: "Dance",
    description:
      "The most incredible dance performances and spontaneous moments captured throughout the festival.",
    thumbnail:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    title: "Artists Backstage",
    youtube_id: "dQw4w9WgXcQ",
    year: 2024,
    category: "Behind Scenes",
    description:
      "Exclusive behind-the-scenes footage with our featured artists and their creative process.",
    thumbnail:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
  },
  {
    id: 4,
    title: "Workshop Highlights",
    youtube_id: "dQw4w9WgXcQ",
    year: 2024,
    category: "Education",
    description:
      "See the incredible learning and growth happening in our intensive workshop sessions.",
    thumbnail:
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400&h=250&fit=crop",
  },
  {
    id: 5,
    title: "Night Social Dancing",
    youtube_id: "dQw4w9WgXcQ",
    year: 2024,
    category: "Social",
    description:
      "Experience the electric atmosphere of our late-night social dancing sessions.",
    thumbnail:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=250&fit=crop",
  },
  {
    id: 6,
    title: "Cultural Exchange",
    youtube_id: "dQw4w9WgXcQ",
    year: 2024,
    category: "Culture",
    description:
      "Celebrating the rich cultural heritage and international community that makes our festival special.",
    thumbnail:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=250&fit=crop",
  },
];
