import type { IconProps } from "@opal/types";
const SvgOnyxLogo = ({ size, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx={8} cy={8} r={2.4} strokeWidth={1.5} strokeOpacity={0.75} />
    <path
      d="M8 1.2V3.4M8 12.6V14.8M1.2 8H3.4M12.6 8H14.8M3.2 3.2L4.7 4.7M11.3 11.3L12.8 12.8M12.8 3.2L11.3 4.7M4.7 11.3L3.2 12.8"
      strokeOpacity={0.75}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SvgOnyxLogo;
