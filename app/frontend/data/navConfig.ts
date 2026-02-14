import {
  IconHome,
  IconQuestionMark,
  IconSearch,
  IconChartBar,
  IconHeart,
  IconCode,
  IconMusic,
  IconFileText,
  IconBook,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";

export interface NavItem {
  href: string;
  label: string;
  icon: Icon;
  enabled: boolean;
}

const navConfig: NavItem[] = [
  { href: "/", label: "Home", icon: IconHome, enabled: true },
  { href: "/choosing-myself", label: "My Story", icon: IconBook, enabled: true },
  { href: "/request", label: "Request Refund", icon: IconFileText, enabled: true },
  { href: "/faq", label: "FAQ", icon: IconQuestionMark, enabled: true },
  { href: "/status", label: "Status", icon: IconSearch, enabled: true },
  { href: "/progress", label: "Progress", icon: IconChartBar, enabled: true },
  { href: "/support", label: "Donate", icon: IconHeart, enabled: true },
  { href: "/artist-payments", label: "Artists", icon: IconMusic, enabled: true },
  { href: "/behind-the-build", label: "Built With", icon: IconCode, enabled: true },
];

export default navConfig;
