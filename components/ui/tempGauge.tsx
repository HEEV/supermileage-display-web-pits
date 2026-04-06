"use client";

export default function TempGauge({
  label,
  value
}: {
  label: string;
  value: number;
}) {
  const sanitizedValue = (value < 0 && Math.abs(value) > 100) ? 0 : value; 
  return (
    <div className="flex flex-col items-center w-32">
      <div className="text-xs uppercase text-cyan-400">
        {label}
      </div>
      <div className="text-3xl font-bold text-[var(--color-text)]">
        {Math.round(sanitizedValue)}°
      </div>
    </div>
  );
}