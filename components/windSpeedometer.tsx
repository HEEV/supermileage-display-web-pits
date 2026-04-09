import { ArrowUp, Minus } from "lucide-react";

export default function WindSpeedometer(props: {
  windSpeed: number;
  relativeSpeed: number;
  speedType?: "real" | "relative" | "both";
  displayUnits?: boolean;
  windDir?: number;
  noBackground?: boolean;
}) {
  const {
    windSpeed,
    relativeSpeed,
    speedType = "both",
    displayUnits,
    windDir,
    noBackground,
  } = props;

  const arrowDeg = ((windDir ?? 0) + 180) % 360;

  const showReal = speedType === "real" || speedType === "both";
  const showRelative = speedType === "relative" || speedType === "both";

  const baseBox =
    "flex flex-col items-center justify-center font-bold text-[var(--color-text)] border-2 border-[var(--color-border-gray)] rounded-[10px] px-3 py-1";

  const transparentBox = "border-none bg-transparent";

  return (
    <div className="flex flex-col items-center gap-1">
      {showReal && (
        <div className="text-cyan-400 text-sm font-bold uppercase mb-1">
          Headwind Speed
        </div>
      )}
      {showRelative && (
        <div className="text-cyan-400 text-sm font-bold uppercase mb-1">
          Relative Speed
        </div>
      )}
      <div className="flex items-center justify-center gap-2">
        {showReal && (
          <div
            className={`${baseBox} ${
              noBackground ? transparentBox : "bg-[var(--color-panel-background)]"
            } text-[2.5rem]`}
          >
            {windSpeed}
          </div>
        )}
        {showRelative && (
          <div
            className={`${baseBox} ${
              noBackground ? transparentBox : "bg-[var(--color-panel-background)]"
            } text-[2.5rem]`}
          >
            {relativeSpeed}
          </div>
        )}
        {windDir != null ? (
          windSpeed !== 0 ? (
            <ArrowUp
              width={32}
              height={36}
              strokeWidth={3.25}
              color={"var(--color-text)"}
              style={{ transform: `rotate(${arrowDeg}deg)` }}
            />
          ) : (
            <Minus
              strokeWidth={3.25}
              color={"var(--color-text)"}
            />
          )
        ) : null}
      </div>
      {displayUnits && (
        <span className="text-[var(--color-text)] text-sm tracking-wide">
          MPH
        </span>
      )}
    </div>
  );
}