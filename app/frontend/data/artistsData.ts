export interface Artist {
  id: number;
  name: string;
  city: string;
  country: string;
  countryFlag: string;
  isDJ: boolean;
  isInstructor: boolean;
  previousEditions: number;
  participatedYears: number[];
  bio: string;
  image: string;
}

export const sampleArtists: Artist[] = [
  {
    id: 1,
    name: "Carlos Silva",
    city: "Lisbon",
    country: "Portugal",
    countryFlag: "🇵🇹",
    isDJ: true,
    isInstructor: true,
    previousEditions: 3,
    participatedYears: [2022, 2023, 2024],
    bio: "International Kizomba artist with over 10 years of experience bringing authentic rhythms to dance floors worldwide. Carlos has been a cornerstone of the festival since its early days.",
    image: "https://placehold.co/400x250/1a1a1a/FF6B35?text=Carlos+Silva",
  },
  {
    id: 2,
    name: "Maria Santos",
    city: "São Paulo",
    country: "Brazil",
    countryFlag: "🇧🇷",
    isDJ: false,
    isInstructor: true,
    previousEditions: 2,
    participatedYears: [2023, 2024],
    bio: "Dynamic instructor combining modern soul with traditional African influences, creating unforgettable learning experiences for dancers of all levels.",
    image: "https://placehold.co/400x250/1a1a1a/FF6B35?text=Maria+Santos",
  },
  {
    id: 3,
    name: "DJ Kwame",
    city: "Accra",
    country: "Ghana",
    countryFlag: "🇬🇭",
    isDJ: true,
    isInstructor: false,
    previousEditions: 1,
    participatedYears: [2024],
    bio: "Innovative DJ blending global rhythms with contemporary beats, pushing the boundaries of festival music and bringing fresh African sounds to the dance floor.",
    image: "https://placehold.co/400x250/1a1a1a/FF6B35?text=DJ+Kwame",
  },
  {
    id: 4,
    name: "Luna Rodriguez",
    city: "Madrid",
    country: "Spain",
    countryFlag: "🇪🇸",
    isDJ: false,
    isInstructor: true,
    previousEditions: 2,
    participatedYears: [2023, 2024],
    bio: "Passionate instructor specializing in contemporary Kizomba fusion, bringing elegant technique and emotional expression to every workshop.",
    image: "https://placehold.co/400x250/1a1a1a/FF6B35?text=Luna+Rodriguez",
  },
  {
    id: 5,
    name: "DJ Phoenix",
    city: "Cape Town",
    country: "South Africa",
    countryFlag: "🇿🇦",
    isDJ: true,
    isInstructor: false,
    previousEditions: 1,
    participatedYears: [2024],
    bio: "Rising star in the Afro-house scene, known for seamlessly blending traditional African rhythms with modern electronic beats.",
    image: "https://placehold.co/400x250/1a1a1a/FF6B35?text=DJ+Phoenix",
  },
  {
    id: 6,
    name: "André & Sofia",
    city: "Paris",
    country: "France",
    countryFlag: "🇫🇷",
    isDJ: false,
    isInstructor: true,
    previousEditions: 3,
    participatedYears: [2022, 2023, 2024],
    bio: "World-renowned dance duo bringing sophistication and artistry to Kizomba. Their workshops focus on connection, musicality, and elegant styling.",
    image: "https://placehold.co/400x250/1a1a1a/FF6B35?text=André+%26+Sofia",
  },
];
