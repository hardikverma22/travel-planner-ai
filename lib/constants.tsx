import {Doc} from "@/convex/_generated/dataModel";
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
  CloudDrizzle,
  MapPinned,
  Palette,
  PersonStanding,
  Castle,
  ShoppingBag,
  MoonStar,
  Users,
  HeartHandshake,
  Heart,
  Contact,
  User,
  Users2,
} from "lucide-react";
import {ReactNode} from "react";

export const navlinks = [
  {text: "How it works", id: "how-it-works"},
  {text: "Community Plans", id: "public-plans"},
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
  tooltipText: string;
}[] = [
  {
    id: "expense-tracker",
    title: "Expense Tracker",
    icon: <DollarSignIcon className="mr-2 h-4 w-4" />,
    tooltipText:
      "Track your travel expenses, view spending metrics, and manage your budget efficiently",
  },
  {
    id: "collaborate",
    title: "Collaborate",
    icon: <UserIcon className="mr-2 h-4 w-4" />,
    tooltipText:
      "Invite friends and family to your travel plan and manage access permissions easily",
  },
  {
    id: "settings",
    title: "Settings",
    icon: <SettingsIcon className="mr-2 h-4 w-4" />,
    tooltipText:
      "Update your display name, set your preferred currency, and manage or delete your entire travel plan",
  },
];

export const planSections: {
  id: keyof Doc<"plan">["contentGenerationState"] | "weather";
  name: string;
  icon: ReactNode;
  isPublic: boolean;
}[] = [
  {
    id: "imagination",
    name: "Your Imagination",
    icon: <Lightbulb className="mr-2 h-4 w-4" />,
    isPublic: true,
  },
  {
    id: "abouttheplace",
    name: "About the Place",
    icon: <Info className="mr-2 h-4 w-4" />,
    isPublic: true,
  },
  {
    id: "weather",
    name: "Weather",
    icon: <CloudDrizzle className="mr-2 h-4 w-4" />,
    isPublic: false,
  },
  {
    id: "adventuresactivitiestodo",
    name: "Top Activities",
    icon: <Sailboat className="mr-2 h-4 w-4" />,
    isPublic: true,
  },
  {
    id: "topplacestovisit",
    name: "Top places to visit",
    icon: <MapPin className="mr-2 h-4 w-4" />,
    isPublic: true,
  },
  {
    id: "itinerary",
    name: "Itinerary",
    icon: <Navigation className="mr-2 h-4 w-4" />,
    isPublic: true,
  },
  {
    id: "localcuisinerecommendations",
    name: "Local Cuisines",
    icon: <Utensils className="mr-2 h-4 w-4" />,
    isPublic: true,
  },
  {
    id: "packingchecklist",
    name: "Packing Checklist",
    icon: <Backpack className="mr-2 h-4 w-4" />,
    isPublic: true,
  },
  {
    id: "besttimetovisit",
    name: "Best time to visit",
    icon: <Clock3 className="mr-2 h-4 w-4" />,
    isPublic: true,
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

export const FEEDBACK_LABELS = [
  {id: "issue", displayName: "Issue"},
  {id: "idea", displayName: "Idea"},
  {id: "question", displayName: "Question"},
  {id: "complaint", displayName: "Complaint"},
  {id: "featurerequest", displayName: "Feature Request"},
  {id: "other", displayName: "Other"},
];

export const ACTIVITY_PREFERENCES = [
  {id: "sightseeing", displayName: "Sightseeing", icon: MapPinned},
  {id: "adventure", displayName: "Adventure", icon: Sailboat},
  {id: "culturalexperiences", displayName: "Cultural Experiences", icon: Palette},
  {id: "historical", displayName: "Historical", icon: Castle},
  {id: "relaxationwellness", displayName: "Relaxation", icon: PersonStanding},
  {id: "shopping", displayName: "Shopping", icon: ShoppingBag},
  {id: "nightlife", displayName: "Nightlife", icon: MoonStar},
];

export const COMPANION_PREFERENCES = [
  {id: "solo", displayName: "Solo", icon: MapPinned},
  {id: "couple", displayName: "Couple", icon: Heart},
  {id: "family", displayName: "Family", icon: Users2},
  {id: "group", displayName: "Group", icon: Contact},
];
