export interface ImportantDate {
  id: string;
  date: string;
  category:
    | "announcement"
    | "early-bird"
    | "tickets"
    | "deadline"
    | "community"
    | "travel";
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
  button: {
    text: string;
    link: string;
    variant: "primary" | "secondary" | "urgent";
  };
  priority: "high" | "medium" | "low";
}

export const importantDatesData: ImportantDate[] = [
  {
    id: "1",
    date: "Feb 25, 2025",
    category: "early-bird",
    title: "Early Bird Pricing Ends Soon!",
    description:
      "Last chance to secure your NeokizFest 2026 passes at early bird prices. 🔥 Save up to $150 per ticket! Full lineup announcement coming March 1st.",
    author: {
      name: "NeokizFest Team",
      avatar: "/assets/nkf-avatar.jpg",
    },
    button: {
      text: "GET EARLY BIRD PRICING",
      link: "/tickets/early-bird",
      variant: "urgent",
    },
    priority: "high",
  },
  {
    id: "2",
    date: "Mar 1, 2025",
    category: "announcement",
    title: "Full Lineup Announcement",
    description:
      "The moment you've been waiting for! Full artist lineup reveal with stage schedules, workshop details, and special surprise performances.",
    author: {
      name: "NeokizFest Team",
      avatar: "/assets/nkf-avatar.jpg",
    },
    button: {
      text: "SET REMINDER",
      link: "/lineup/reminder",
      variant: "primary",
    },
    priority: "high",
  },
  {
    id: "3",
    date: "Mar 15, 2025",
    category: "tickets",
    title: "VIP Experience Packages Available",
    description:
      "Exclusive VIP packages now on sale! Includes backstage access, artist meet & greets, premium viewing areas, and luxury amenities.",
    author: {
      name: "VIP Services",
      avatar: "/assets/vip-avatar.jpg",
    },
    button: {
      text: "EXPLORE VIP PACKAGES",
      link: "/tickets/vip",
      variant: "primary",
    },
    priority: "medium",
  },
  {
    id: "4",
    date: "Apr 1, 2025",
    category: "travel",
    title: "Hotel Partner Discounts Available",
    description:
      "Book your stay at our partner hotels with exclusive festival discounts. Limited rooms available at special rates for NeokizFest attendees.",
    author: {
      name: "Travel Team",
      avatar: "/assets/travel-avatar.jpg",
    },
    button: {
      text: "BOOK ACCOMMODATION",
      link: "/travel/hotels",
      variant: "secondary",
    },
    priority: "medium",
  },
  {
    id: "5",
    date: "May 1, 2025",
    category: "community",
    title: "Pre-Festival Meetups Begin",
    description:
      "Join fellow festival-goers at local meetups across the country! Network, plan your festival experience, and make new friends before the big event.",
    author: {
      name: "Community Team",
      avatar: "/assets/community-avatar.jpg",
    },
    button: {
      text: "FIND LOCAL MEETUPS",
      link: "/community/meetups",
      variant: "secondary",
    },
    priority: "low",
  },
  {
    id: "6",
    date: "Jun 1, 2025",
    category: "deadline",
    title: "Final Call: Regular Ticket Sales End",
    description:
      "This is it! Regular ticket sales end June 1st. After this date, only limited day-of tickets will be available at the gate (if not sold out).",
    author: {
      name: "Ticket Office",
      avatar: "/assets/tickets-avatar.jpg",
    },
    button: {
      text: "GET TICKETS NOW",
      link: "/tickets/regular",
      variant: "urgent",
    },
    priority: "high",
  },
];
