import {SidebarProps} from "@/components/plan/Sidebar";
import {
  Backpack,
  Clock3,
  Info,
  Lightbulb,
  MapPin,
  Navigation,
  Sailboat,
  Utensils,
  Bus,
  Gift,
  Hotel,
  Pizza,
  ShieldQuestion,
  ShoppingCart,
} from "lucide-react";
import {ReactNode} from "react";

export const navlinks = [
  {text: "How it works", id: "how-it-works"},
  {text: "Pricing", id: "pricing"},
];

export const features = [
  "Top Spots Unveiled",
  "Tailored Itineraries",
  "Optimal Timing",
  "Foodie Hotspots",
  "Prime Experiences",
];

export const planSections: {
  id: keyof SidebarProps;
  name: string;
  icon: ReactNode;
}[] = [
  {
    id: "imagination",
    name: "Your Imagination",
    icon: <Lightbulb className="mr-2 h-4 w-4" />,
  },
  {
    id: "abouttheplace",
    name: "About the Place",
    icon: <Info className="mr-2 h-4 w-4" />,
  },
  {
    id: "topactivities",
    name: "Top Activities",
    icon: <Sailboat className="mr-2 h-4 w-4" />,
  },
  {
    id: "topplacestovisit",
    name: "Top places to visit",
    icon: <MapPin className="mr-2 h-4 w-4" />,
  },
  {
    id: "itinerary",
    name: "Itinerary",
    icon: <Navigation className="mr-2 h-4 w-4" />,
  },
  {
    id: "localcuisines",
    name: "Local Cuisines",
    icon: <Utensils className="mr-2 h-4 w-4" />,
  },
  {
    id: "packingchecklist",
    name: "Packing Checklist",
    icon: <Backpack className="mr-2 h-4 w-4" />,
  },
  {
    id: "besttimetovisit",
    name: "Best time to visit",
    icon: <Clock3 className="mr-2 h-4 w-4" />,
  },
];

export const colors = ["#ef4444", "#14b8a6", "#f59e0b", "#06b6d4", "#a855f7", "#ec4899"];

export const expenseCategories = [
  {key: "food", icon: <Pizza className="h-4 w-4" />, label: "Food"},
  {key: "commute", icon: <Bus className="h-4 w-4" />, label: "Commute"},
  {key: "shopping", icon: <ShoppingCart className="h-4 w-4" />, label: "Shopping"},
  {key: "gifts", icon: <Gift className="h-4 w-4" />, label: "Gifts"},
  {key: "accomodations", icon: <Hotel className="h-4 w-4" />, label: "Accomodation"},
  {key: "others", icon: <ShieldQuestion className="h-4 w-4" />, label: "Others"},
];

export const planNavLinks = [
  {
    key: "plan",
    lable: "Plan",
  },
  {
    key: "expense-tracker",
    lable: "Expense Tracker",
  },
  {
    key: "settings",
    lable: "Settings",
  },
];
