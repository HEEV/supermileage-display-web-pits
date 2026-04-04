"use client";

export default function TempGauge({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const percent = Math.min(100, (value / max) * 100);

  const getColor = () => {
    if (percent < 40) return "bg-green-500";
    if (percent < 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex flex-col items-center w-32">
      <div className="text-xs uppercase text-[var(--color-text-secondary)]">
        {label}
      </div>
      <div className="text-3xl font-bold text-[var(--color-text)]">
        {Math.round(value)}°
      </div>
      <div className="w-full h-2 bg-slate-700 rounded mt-1">
        <div
          className={`h-full rounded ${getColor()}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}