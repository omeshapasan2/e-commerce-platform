import { useState, useId } from "react";

export default function StarRating({
  value = 0,
  onChange,
  max = 5,
  disabled = false,
  id,
  className = "",
  size = 28,
}) {
  const [hover, setHover] = useState(0);
  const uid = useId();
  const groupId = id || `stars-${uid}`;
  const display = hover || value;

  const clamp = (n) => Math.max(0, Math.min(max, n));

  const onKeyDown = (e) => {
    if (disabled) return;
    let next = value;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = clamp(value + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = clamp(value - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = max;
    else if (e.key === " " || e.key === "Enter") next = display;
    else return;
    e.preventDefault();
    onChange?.(next);
  };

  return (
    <div
      id={groupId}
      role="radiogroup"
      aria-label="Rating"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={`flex items-center gap-1 outline-none ${disabled ? "opacity-60" : ""} ${className}`}
      onMouseLeave={() => setHover(0)}
    >
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const checked = n <= display;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
            disabled={disabled}
            onMouseEnter={() => !disabled && setHover(n)}
            onFocus={() => !disabled && setHover(n)}
            onClick={() => !disabled && onChange?.(n)}
            className={`p-1 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
          >
            <StarIcon
              filled={checked}
              size={size}
              className={checked ? "text-foreground" : "text-muted-foreground"}
            />
          </button>
        );
      })}

      <span className="sr-only">Selected: {value} out of {max}</span>
      
      <input type="hidden" name="rating" value={value} />
    </div>
  );
}

function StarIcon({ filled, size = 28, className = "" }) {
  // Single SVG star icon
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 17.27L6.18 20.2l1.11-6.5L2 9.24l6.55-.95L12 2l3.45 6.29 6.55.95-4.76 4.46 1.11 6.5z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}