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
  DollarSignIcon,
  UserIcon,
  SettingsIcon,
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
  "Invite Others",
  "Expense tracking",
];

export const controlCenterSections: {
  id: string;
  title: string;
  icon: ReactNode;
}[] = [
  {
    id: "expense-tracker",
    title: "Expense Tracker",
    icon: <DollarSignIcon className="mr-2 h-4 w-4" />,
  },
  {
    id: "collaborate",
    title: "Collaborate",
    icon: <UserIcon className="mr-2 h-4 w-4" />,
  },
  {
    id: "settings",
    title: "Settings",
    icon: <SettingsIcon className="mr-2 h-4 w-4" />,
  },
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

export const MAPS_DARK_MODE_STYLES = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#181818",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1b1b1b",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#2c2c2c",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8a8a8a",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#373737",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#3c3c3c",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#4e4e4e",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#000000",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3d3d3d",
      },
    ],
  },
];
