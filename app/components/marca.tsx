import { useId } from "react";

export function Marca() {
  const gradiente = useId();
  return (
    <span className="inline-flex items-center gap-2 text-titulo-3 tracking-tight">
      <svg aria-hidden="true" viewBox="0 0 84 44" className="h-10 w-16" fill="none">
        <defs>
          <linearGradient id={gradiente} x1="55" y1="4" x2="55" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff3b30" /><stop offset=".17" stopColor="#ff9f0a" />
            <stop offset=".33" stopColor="#ffd60a" /><stop offset=".5" stopColor="#30d158" />
            <stop offset=".66" stopColor="#64d2ff" /><stop offset=".8" stopColor="#0a84ff" />
            <stop offset="1" stopColor="#bf5af2" />
          </linearGradient>
        </defs>
        <path d="M43 21 82 3v38L43 25Z" fill={`url(#${gradiente})`} />
        <path d="m23 37 17-31 17 31H23Z" fill="var(--papel)" stroke="currentColor" strokeWidth="2" />
        <path d="m2 22 29 0 13 3" stroke="currentColor" strokeWidth="2" />
      </svg>
      PRISMA
    </span>
  );
}
