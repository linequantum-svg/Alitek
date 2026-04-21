type IconName = "phone" | "telegram" | "mail" | "chat" | "close" | "chevron" | "whatsapp" | "viber" | "callback";

export function ContactIcon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  } as const;

  switch (name) {
    case "phone":
      return (
        <svg {...common}>
          <path
            d="M7.5 4.5C7.9 4.1 8.5 4 9 4.3L11.3 5.6C11.8 5.9 12 6.6 11.8 7.1L10.9 9.2C11.8 11 13 12.2 14.8 13.1L16.9 12.2C17.4 12 18.1 12.2 18.4 12.7L19.7 15C20 15.5 19.9 16.1 19.5 16.5L18.3 17.7C17.6 18.4 16.6 18.7 15.6 18.4C13.1 17.6 10.8 16.2 8.8 14.2C6.8 12.2 5.4 9.9 4.6 7.4C4.3 6.4 4.6 5.4 5.3 4.7L7.5 4.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "telegram":
      return (
        <svg {...common}>
          <path
            d="M20 5L4 11.2L9.1 13.1L11 19L14 14.8L17.8 17.6L20 5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M9.1 13.1L20 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common}>
          <path
            d="M12 20C16.4 20 20 16.6 20 12.4C20 8.3 16.4 5 12 5C7.6 5 4 8.3 4 12.4C4 13.8 4.4 15.1 5.2 16.2L4.5 19L7.4 18.3C8.7 19.4 10.2 20 12 20Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.3 9.4C9.6 9.1 10 9 10.3 9.2L11.5 9.9C11.8 10.1 11.9 10.5 11.8 10.8L11.3 11.9C11.7 12.8 12.4 13.4 13.2 13.8L14.3 13.3C14.6 13.2 15 13.3 15.2 13.6L15.9 14.8C16.1 15.1 16 15.5 15.7 15.8L15.3 16.2C14.9 16.6 14.4 16.7 13.8 16.6C12.5 16.1 11.3 15.4 10.3 14.4C9.3 13.4 8.6 12.2 8.1 10.9C8 10.3 8.1 9.8 8.5 9.4H9.3Z"
            fill="currentColor"
          />
        </svg>
      );
    case "viber":
      return (
        <svg {...common}>
          <path
            d="M12 4.8C7.9 4.8 4.5 7.8 4.5 11.7C4.5 13.7 5.4 15.4 6.9 16.6V19.2L9.5 17.8C10.3 18 11.1 18.1 12 18.1C16.1 18.1 19.5 15.1 19.5 11.2C19.5 7.3 16.1 4.8 12 4.8Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M10 9.2L11.1 11.1L9.8 12.2C10.5 13.5 11.5 14.4 12.8 15.1L13.9 13.8L15.8 14.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.4 8.8C15.1 9 15.8 9.7 16 10.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3.5" y="6" width="17" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5 8L12 13L19 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "callback":
      return (
        <svg {...common}>
          <path d="M12 4.5V8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 15.5V19.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M4.5 12H8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M15.5 12H19.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common}>
          <path
            d="M6 7.5C6 6.1 7.1 5 8.5 5H15.5C16.9 5 18 6.1 18 7.5V12.5C18 13.9 16.9 15 15.5 15H10L6.5 18V15.9C5.6 15.5 5 14.6 5 13.5V7.5H6Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...common}>
          <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}
