interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

const defaults = { size: 20, strokeWidth: 1.75 };

const icon =
  (path: React.ReactNode, viewBox = "0 0 24 24") =>
  ({
    size = defaults.size,
    color = "currentColor",
    strokeWidth = defaults.strokeWidth,
    className,
  }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  );

export const BookOpen = icon(
  <>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </>,
);

export const CalendarIcon = icon(
  <>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </>,
);

export const BarChart = icon(
  <>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </>,
);

export const Users = icon(
  <>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </>,
);

export const MapPin = icon(
  <>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </>,
);

export const ChevronLeft = icon(
  <>
    <polyline points="15 18 9 12 15 6" />
  </>,
);

export const Plus = icon(
  <>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </>,
);

export const Share2 = icon(
  <>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </>,
);

export const UserPlus = icon(
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </>,
);

export const Sparkles = icon(
  <>
    <path
      d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z"
      fill="currentColor"
      stroke="none"
    />
    <path
      d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75z"
      fill="currentColor"
      stroke="none"
    />
    <path
      d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5z"
      fill="currentColor"
      stroke="none"
    />
  </>,
);

export const Clock = icon(
  <>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </>,
);

export const Trash2 = icon(
  <>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </>,
);

export const Edit2 = icon(
  <>
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </>,
);

export const MoonStar = icon(
  <>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    <path
      d="M19 3l.5 1.5L21 5l-1.5.5L19 7l-.5-1.5L17 5l1.5-.5z"
      fill="currentColor"
      stroke="none"
    />
  </>,
);

export const ChevronDown = icon(
  <>
    <polyline points="6 9 12 15 18 9" />
  </>,
);

export const ChevronUp = icon(
  <>
    <polyline points="18 15 12 9 6 15" />
  </>,
);

/* Category icons */
export const Utensils = icon(
  <>
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <line x1="7" y1="2" x2="7" y2="22" />
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
  </>,
);

export const Dumbbell = icon(
  <>
    <path d="M6.5 6.5h11" />
    <path d="M6.5 17.5h11" />
    <path d="M3 9.5h1.5v5H3z" />
    <path d="M19.5 9.5H21v5h-1.5z" />
    <path d="M1.5 8h3v8h-3z" />
    <path d="M19.5 8h3v8h-3z" />
    <line x1="6.5" y1="12" x2="17.5" y2="12" />
  </>,
);

export const Film = icon(
  <>
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="2" x2="7" y2="22" />
    <line x1="17" y1="2" x2="17" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="2" y1="7" x2="7" y2="7" />
    <line x1="2" y1="17" x2="7" y2="17" />
    <line x1="17" y1="17" x2="22" y2="17" />
    <line x1="17" y1="7" x2="22" y2="7" />
  </>,
);

export const TreePine = icon(
  <>
    <path d="M17 14l-5-8-5 8h3v6h4v-6h3z" />
    <line x1="12" y1="2" x2="12" y2="6" />
  </>,
);

export const Star = icon(
  <>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </>,
);

export const Home = icon(
  <>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </>,
);
