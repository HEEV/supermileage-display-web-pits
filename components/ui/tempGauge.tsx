"use client";

export default function TempGauge({
  label,
  value
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center w-32">
      <div className="text-xs uppercase text-[var(--color-text-secondary)]">
        {label}
      </div>
      <div className="text-3xl font-bold text-[var(--color-text)]">
        {Math.round(value)}°
      </div>
    </div>
  );
}