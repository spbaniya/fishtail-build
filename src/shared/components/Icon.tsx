import React, { useEffect, useState } from "react";

function toPascalCase(str) {
    if (!str) return str;
    // If already PascalCase-like, return as-is
    if (/^[A-Z][A-Za-z0-9]*$/.test(str)) return str;
    // Replace non-alphanum with space, split and capitalize
    return (
        str
            .replace(/[^a-zA-Z0-9]+/g, " ")
            .split(" ")
            .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : ""))
            .join("")
    );
}

export default function Icon({
    name,
    size = 24,
    strokeWidth = 2,
    color = "currentColor",
    className = "",
    title,
    ariaLabel,
    fallback = null,
    ...rest
}) {
    const [LoadedIcon, setLoadedIcon] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let mounted = true;
        setLoadedIcon(null);
        setError(false);

        if (!name) {
            setError(true);
            return () => (mounted = false);
        }

        if (typeof window === "undefined") {
            return () => (mounted = false);
        }

        import("lucide-react")
            .then((mod) => {
                if (!mounted) return;
                let Comp = mod[name];
                if (!Comp) {
                    const pascal = toPascalCase(name);
                    Comp = mod[pascal];
                }
                if (!Comp) {
                    const camelGuess = name
                        .split(/[^a-zA-Z0-9]+/)
                        .map((p, idx) => (idx === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p.charAt(0).toUpperCase() + p.slice(1)))
                        .join("");
                    Comp = mod[camelGuess];
                }

                if (Comp) setLoadedIcon(() => Comp);
                else setError(true);
            })
            .catch(() => {
                if (mounted) setError(true);
            });

        return () => (mounted = false);
    }, [name]);

    if (LoadedIcon) {
        const aria = ariaLabel || (title ? undefined : name);
        return (
            <LoadedIcon
                size={size}
                strokeWidth={strokeWidth}
                color={color}
                className={className}
                title={title}
                aria-label={aria}
                role={aria ? "img" : undefined}
                {...rest}
            />
        );
    }

    if (fallback) return fallback;

    if (error) {
        return (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label={ariaLabel || `missing icon ${name}`}
                role="img"
                className={className}
                {...rest}
            >
                {title ? <title>{title}</title> : null}
                <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth={strokeWidth} />
                <text
                    x="12"
                    y="15"
                    textAnchor="middle"
                    fontSize={Math.max(8, size / 3)}
                    fill={color}
                    fontFamily="Arial, Helvetica, sans-serif"
                >
                    ?
                </text>
            </svg>
        );
    }

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className={className}
            {...rest}
        />
    );
}

// Example usage:
// <Icon name="Activity" />
// <Icon name="alert-circle" size={20} color="#ff0000" />
// <Icon name="arrow-right" fallback={<span>loading...</span>} />
