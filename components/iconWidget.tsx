import React from 'react';

export default function IndicatorIcon(props: {
  on?: boolean;
  text?: string;
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  iconWidth?: number;
}) {
  const { on, text, Icon, iconWidth } = props;

  const isDisabled = on === undefined;

  const bgColor = Icon
    ? 'transparent'
    : isDisabled
      ? 'var(--color-icon-disabled)'
      : on
        ? 'var(--color-icon-on)'
        : 'var(--color-icon-off)';

  const imgColor = Icon
    ? isDisabled
      ? 'var(--color-icon-disabled)'
      : on
        ? 'var(--color-icon-on)'
        : 'var(--color-icon-off)'
    : 'var(--color-icon-text)';

  const spanContent =
    text || (Icon && <Icon width={30} height={30} fill="currentColor" />);

  return (
    <div
      className="flex items-center justify-center rounded p-1.5 w-[90%]"
      style={{
        width: iconWidth,
        backgroundColor: bgColor,
      }}
    >
      <span
        className="whitespace-nowrap font-bold text-[1em]"
        style={{ color: imgColor }}
      >
        {spanContent}
      </span>
    </div>
  );
}