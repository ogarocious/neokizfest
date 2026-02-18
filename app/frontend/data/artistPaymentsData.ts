export interface Artist {
  name: string;
  /** Artist photo path — drop images in: public/images/artist-payments/artists/
   *  Example: "/images/artist-payments/artists/dj-example.jpg" */
  image?: string;
  confirmed: boolean;
  /** Screenshots of payment proof — drop images in: public/images/artist-payments/proof/
   *  Example: "/images/artist-payments/proof/dj-example-2024.png" */
  proofImages?: string[];
}

export interface FestivalEdition {
  year: number;
  name: string;
  /** Festival flyer image path — drop images in: public/images/artist-payments/flyers/
   *  Example: "/images/artist-payments/flyers/2024.jpg" */
  flyerImage?: string;
  note?: string;
  artists: Artist[];
}

export interface ArtistTestimonial {
  name: string;
  /** Artist photo — same folder as artist payment photos */
  image?: string;
  /** Which editions they performed at */
  years: number[];
  /** Their quote about the festival experience */
  quote: string;
  /** Optional role descriptor, e.g. "DJ", "Instructor", "Performer" */
  role?: string;
}

// ──────────────────────────────────────────────────────
// IMAGE PATHS CHEAT SHEET
// ──────────────────────────────────────────────────────
// Flyers:        public/images/artist-payments/flyers/2024.jpg   → flyerImage: "/images/artist-payments/flyers/2024.jpg"
// Artist photos: public/images/artist-payments/artists/name.jpg  → image: "/images/artist-payments/artists/name.jpg"
// Proof shots:   public/images/artist-payments/proof/name-yr.png → proofImages: ["/images/artist-payments/proof/name-yr.png"]
// ──────────────────────────────────────────────────────

export const festivalEditions: FestivalEdition[] = [
  {
    year: 2024,
    name: "Neo Kizomba Festival 2024",
    flyerImage: "/images/artist-payments/flyers/2024.jpg",
    artists: [
      {
        name: "DJ Sink",
        image: "/images/artist-payments/artists/dj-sink-2024.png",
        confirmed: true,
        proofImages: ["/images/artist-payments/proof/dj-sink-testimonial.jpg"],
      },
      {
        name: "DJ Art",
        image: "/images/artist-payments/artists/dj-art-2024.png",
        confirmed: true,
        proofImages: ["/images/artist-payments/proof/dj-art-testimonial.png"],
      },
      {
        name: "DJ Olu",
        image: "/images/artist-payments/artists/dj-olu-2024.png",
        confirmed: false,
      },
      {
        name: "Ceijay & Bruna",
        image: "/images/artist-payments/artists/ceijay-bruna-2024.png",
        confirmed: true,
        proofImages: [
          "/images/artist-payments/proof/ceijay-bruna-testimonial.jpg",
        ],
      },
      {
        name: "Derrick",
        image: "/images/artist-payments/artists/derrick-2024.png",
        confirmed: false,
      },
      {
        name: "Samy",
        image: "/images/artist-payments/artists/samy-2024.png",
        confirmed: false,
      },
      {
        name: "Joey & Sha",
        image: "/images/artist-payments/artists/joey-sha-2024.png",
        confirmed: false,
      },
      {
        name: "JP & Stephy",
        image: "/images/artist-payments/artists/jp-stephy-2024.png",
        confirmed: false,
      },
      {
        name: "Ronie & Frida",
        image: "/images/artist-payments/artists/ronie-frida-2024.png",
        confirmed: true,
        proofImages: [
          "/images/artist-payments/proof/ronie-saleh-testimonial.jpg",
          "/images/artist-payments/proof/ronie-saleh-payment-2024.png",
        ],
      },
      {
        name: "Jurcic (DJ Stripes)",
        image: "/images/artist-payments/artists/jurcic-dj-stripes-2024.png",
        confirmed: false,
      },
      {
        name: "DJ Mojo",
        image: "/images/artist-payments/artists/dj-mojo-2024.png",
        confirmed: true,
        proofImages: [
          "/images/artist-payments/proof/dj-mojo-payment-2024.png",
        ],
      },
      {
        name: "DJ Profe",
        image: "/images/artist-payments/artists/dj-profe-2024.png",
        confirmed: true,
        proofImages: [
          "/images/artist-payments/proof/dj-profe-payment-2024.png",
          "/images/artist-payments/proof/dj-profe-zelle-2024.png",
        ],
      },
      {
        name: "Eri Kardos",
        image: "/images/artist-payments/artists/eri-kardos-2024.png",
        confirmed: true,
        proofImages: ["/images/artist-payments/proof/eri-kardos-2024.jpg"],
      },
      {
        name: "Ninja",
        image: "/images/artist-payments/artists/ninja-2024.png",
        confirmed: false,
      },
      {
        name: "Mike & Nikki",
        image: "/images/artist-payments/artists/mike-nikki-2024.png",
        confirmed: false,
      },
      {
        name: "DJ Babyface",
        image: "/images/artist-payments/artists/dj-babyface-2024.png",
        confirmed: true,
        proofImages: [
          "/images/artist-payments/proof/dj-babyface-testimonial.png",
          "/images/artist-payments/proof/dj-babyface-zelle-2024.png",
        ],
      },
    ],
  },
  {
    year: 2023,
    name: "Neo Kizomba Festival 2023",
    flyerImage: "/images/artist-payments/flyers/2023.png",
    artists: [
      {
        name: "Tom Lev (DJ Froyo)",
        image: "/images/artist-payments/artists/tom-lev-froyo.png",
        confirmed: true,
        proofImages: [
          "/images/artist-payments/proof/tom-lev-2023.jpg",
          "/images/artist-payments/proof/tom-lev-payment-2023.png",
        ],
      },
      {
        name: "DJ Olu",
        image: "/images/artist-payments/artists/dj-olu-2023.png",
        confirmed: false,
      },
      {
        name: "Ceijay & Bruna",
        image: "/images/artist-payments/artists/ceijay-bruna-2023.png",
        confirmed: true,
        proofImages: [
          "/images/artist-payments/proof/ceijay-bruna-testimonial.jpg",
        ],
      },
      { name: "Ninja", confirmed: false },
      { name: "DJ Yawo", confirmed: false },
      {
        name: "DJ Nhat",
        confirmed: true,
        proofImages: ["/images/artist-payments/proof/dj-nhat-payment-2023.png"],
      },
      {
        name: "DJ Babyface",
        confirmed: true,
        proofImages: [
          "/images/artist-payments/proof/dj-babyface-testimonial.png",
          "/images/artist-payments/proof/dj-babyface-zelle-2023.png",
        ],
      },
      { name: "Derrick", confirmed: false },
      { name: "JP & Stephy", confirmed: false },
      { name: "Jurcic (DJ Stripes)", confirmed: false },
      { name: "Mike & Nikki", confirmed: false },
      { name: "DJ Pingusso", confirmed: false },
    ],
  },
  {
    year: 2022,
    name: "Neo Kizomba Festival 2022",
    flyerImage: "/images/artist-payments/flyers/2022.png",
    artists: [
      {
        name: "DJ Sink",
        image: "/images/artist-payments/artists/dj-sink-2022.png",
        confirmed: true,
        proofImages: ["/images/artist-payments/proof/dj-sink-testimonial.jpg"],
      },
      {
        name: "DJ Art",
        image: "/images/artist-payments/artists/dj-art-2022.png",
        confirmed: true,
        proofImages: ["/images/artist-payments/proof/dj-art-testimonial.png"],
      },
      {
        name: "DJ Babyface",
        confirmed: true,
        proofImages: [
          "/images/artist-payments/proof/dj-babyface-testimonial.png",
          "/images/artist-payments/proof/dj-babyface-venmo-2022.png",
        ],
      },
      { name: "Artist 3", confirmed: false },
      { name: "Artist 4", confirmed: false },
      { name: "Artist 5", confirmed: false },
    ],
  },
  {
    year: 2021,
    name: "Neo Kizomba Festival 2021",
    note: "Did not take place due to COVID-19",
    artists: [],
  },
  {
    year: 2020,
    name: "Neo Kizomba Festival 2020",
    note: "Did not take place due to COVID-19",
    artists: [],
  },
  {
    year: 2020,
    name: "NeoKiz Cruise 2020",
    flyerImage: "/images/artist-payments/flyers/cruise-2020.png",
    artists: [
      {
        name: "DJ Sink",
        image: "/images/artist-payments/artists/dj-sink-cruise-2020.png",
        confirmed: true,
        proofImages: ["/images/artist-payments/proof/dj-sink-testimonial.jpg"],
      },
      { name: "DJ Morelasoul", confirmed: false },
      { name: "DJ Zay'X", confirmed: false },
      { name: "DJ Pingusso", confirmed: false },
      { name: "DJ Mojo", confirmed: false },
      { name: "DJ Lil G", confirmed: false },
    ],
  },
  {
    year: 2019,
    name: "Neo Kizomba Festival 2019",
    flyerImage: "/images/artist-payments/flyers/2019.png",
    artists: [
      {
        name: "Lindsay Hutton",
        image: "/images/artist-payments/artists/lindsay-hutton.png",
        confirmed: true,
        proofImages: ["/images/artist-payments/proof/lindsay-hutton-2019.jpg"],
      },
      {
        name: "Tarah",
        image: "/images/artist-payments/artists/tarah.png",
        confirmed: true,
        proofImages: [
          "/images/artist-payments/proof/tarah-payment-2019.png",
        ],
      },
      {
        name: "Willie Ledoux",
        image: "/images/artist-payments/artists/willie-ledoux.png",
        confirmed: false,
      },
      {
        name: "DJ Sink",
        image: "/images/artist-payments/artists/dj-sink-2019.png",
        confirmed: true,
        proofImages: ["/images/artist-payments/proof/dj-sink-testimonial.jpg"],
      },
      {
        name: "Py & Sarah",
        image: "/images/artist-payments/artists/py-sarah-2019.png",
        confirmed: false,
      },
      {
        name: "DJ Mojo",
        image: "/images/artist-payments/artists/dj-mojo-2019.png",
        confirmed: false,
      },
      { name: "DJ Morelasoul", confirmed: false },
      { name: "DJ Lenhy", confirmed: false },
      { name: "Laurent Yishu", confirmed: false },
      { name: "Isabelle", confirmed: false },
      {
        name: "Gwany & Liliana",
        image: "/images/artist-payments/artists/gwany-2019.png",
        confirmed: true,
        proofImages: ["/images/artist-payments/proof/gwany-liliana-testimonial.jpg"],
      },
      {
        name: "DJ Art",
        image: "/images/artist-payments/artists/dj-art-2019.png",
        confirmed: true,
        proofImages: ["/images/artist-payments/proof/dj-art-testimonial.png"],
      },
      { name: "DJ Arka", confirmed: false },
      {
        name: "Val'r & Stephy",
        image: "/images/artist-payments/artists/valar-stephy.png",
        confirmed: false,
      },
    ],
  },
  {
    year: 2018,
    name: "Neo Kizomba Festival 2018",
    flyerImage: "/images/artist-payments/flyers/2018.png",
    artists: [
      {
        name: "DJ Sink",
        confirmed: true,
        proofImages: ["/images/artist-payments/proof/dj-sink-testimonial.jpg"],
      },
      {
        name: "Ronie Saleh",
        confirmed: true,
        proofImages: [
          "/images/artist-payments/proof/ronie-saleh-testimonial.jpg",
          "/images/artist-payments/proof/ronie-saleh-payment-2024.png",
        ],
      },
      { name: "Artist 3", confirmed: false },
      { name: "Artist 4", confirmed: false },
    ],
  },
  {
    year: 2017,
    name: "Neo Kizomba Festival 2017",
    flyerImage: "/images/artist-payments/flyers/2017.png",
    artists: [
      { name: "Artist 1", confirmed: false },
      { name: "Artist 2", confirmed: false },
      { name: "Artist 3", confirmed: false },
      { name: "Artist 4", confirmed: false },
    ],
  },
  {
    year: 2016,
    name: "Neo Kizomba Festival 2016",
    flyerImage: "/images/artist-payments/flyers/2016.png",
    artists: [
      { name: "Artist 1", confirmed: false },
      { name: "Artist 2", confirmed: false },
      { name: "Artist 3", confirmed: false },
    ],
  },
  {
    year: 2015,
    name: "Neo Kizomba Festival 2015",
    flyerImage: "/images/artist-payments/flyers/2015.png",
    artists: [
      { name: "Artist 1", confirmed: false },
      { name: "Artist 2", confirmed: false },
      { name: "Artist 3", confirmed: false },
    ],
  },
];

// ──────────────────────────────────────────────────────
// ARTIST TESTIMONIALS
// ──────────────────────────────────────────────────────
// Add testimonials as artists respond. These appear in
// a dedicated section on the Artist Payments page.
// ──────────────────────────────────────────────────────

export const artistTestimonials: ArtistTestimonial[] = [
  {
    name: "Lindsay Hutton",
    image: "/images/artist-payments/artists/lindsay-hutton.png",
    years: [2019],
    role: "Teacher & Performer",
    quote:
      "I, Lindsay Hutton, was paid in full and in a timely manner for every workshop I gave at Charles' Neokiz festival. As a teacher, performer, and participant in multiple editions, I and my students/performance troupes were always treated well, and with respect. Teaching at multiple events with Charles, I was always paid what was agreed, and it was always a fair and positive experience doing business with him.",
  },
  {
    name: "Tom Lev (DJ Froyo)",
    image: "/images/artist-payments/artists/tom-lev-froyo.png",
    years: [2023],
    role: "DJ",
    quote:
      "My experience with NeoKiz was as smooth and professional as an event gets. We signed an agreement, which was fully fulfilled and respected. Payment was timely and without complications. I was treated wonderfully by Charles and the team!",
  },
  {
    name: "DJ Art",
    image: "/images/artist-payments/artists/dj-art-2024.png",
    years: [2019, 2022, 2024],
    role: "DJ",
    quote:
      "I confirm that I've been fully paid by Charles Ogar — Neokiz for DJ services for the years 2019, 2022 and 2024.",
  },
  {
    name: "DJ Sink",
    image: "/images/artist-payments/artists/dj-sink-2024.png",
    years: [2018, 2019, 2020, 2022, 2024],
    role: "DJ",
    quote:
      "I have always been paid in full when working at Neokiz Festival. I've had the pleasure of working with Charles Ogar multiple times, and his work ethic is truly unmatched. I was part of the 2018, 2019, and 2020 editions (Neokiz Cruise to the Bahamas), as well as 2022 and 2024. Throughout all these years, the Neokiz team has consistently taken great care of their artists. Flights, accommodations, transportation, artist management — everything has always been handled professionally and with attention to detail.",
  },
  {
    name: "Ceijay & Bruna",
    image: "/images/artist-payments/artists/ceijay-bruna-2024.png",
    years: [2020, 2022, 2023, 2024],
    role: "Instructor & Performer",
    quote:
      "Throughout every edition I participated in, Bruna & Ceijay were always fully taken care of and paid before even leaving Austin Texas. Our flights, accommodations, and meals were consistently handled with professionalism and care. Bruna and I had an amazing experience, and I would like to personally thank Charles for organizing such a wonderful event. As an organizer and Kizomba instructor myself, I truly understand how challenging it can be to put together festivals, especially when the return is often minimal or uncertain. Huge appreciation to Charles and the entire team for their dedication, passion, and hard work in supporting and growing the community.",
  },
  {
    name: "Ronie Saleh",
    image: "/images/artist-payments/artists/ronie-frida-2024.png",
    years: [2018, 2024],
    role: "Kizomba Fusion Artist",
    quote:
      "My name is Ronie Saleh, a Kizomba Fusion Artist who have been working with Charles Ogar at Neo Kizomba Festival at many occasions. I've always been treated well by Charles and paid according to agreements. NeoKiz has always been one of my favorite festivals to attend. The hospitality and vibe is very special at the event. The organizer and his team have always been professional, always welcoming, helpful and positive. An event I always look forward to come back to.",
  },
  {
    name: "DJ Babyface",
    image: "/images/artist-payments/artists/dj-babyface-2024.png",
    years: [2022, 2023, 2024],
    role: "DJ",
    quote:
      "I certify that I have been paid in full for all three editions of Neokiz that I have played at. As an artist, even when I was fairly new, I was treated with quality care during my time at the event.",
  },
  {
    name: "Gwany & Liliana",
    image: "/images/artist-payments/artists/gwany-2019.png",
    years: [2019],
    role: "Instructor",
    quote:
      "Gwany and Liliana confirm payment for Neokiz 2019.",
  },
  {
    name: "Eri Kardos",
    image: "/images/artist-payments/artists/eri-kardos-2024.png",
    years: [2024],
    role: "Teacher & TEDx Speaker",
    quote:
      "I'm happy to confirm that I have no outstanding balances from my time teaching at Neo Kizomba Festival 2024. All of our agreed terms and arrangements were honored. My experience working with you was genuinely one of the best I've had at a large kizomba festival. I felt seen, supported, and well cared for, and your communication and professionalism were excellent throughout. The level of intention and heart you put into the experience for artists and participants really stands out.",
  },
];
