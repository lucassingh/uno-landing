export interface AsteriskIconProps {
    size?: number;
    color?: string;
    className?: string;
}

/** Marca "asterisco" (lucide) — bullet de features en Pricing, acento decorativo en CircularGallery. */
export function AsteriskIcon({ size = 16, color = "currentColor", className }: AsteriskIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M12 6v12" />
            <path d="M17.196 9 6.804 15" />
            <path d="m6.804 9 10.392 6" />
        </svg>
    );
}

export default AsteriskIcon;
