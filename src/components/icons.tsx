import type { SVGProps } from 'react'

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: number
}

// Concave 4-point sparkle centered at (cx,cy) with outer radius r
function spark(cx: number, cy: number, r: number): string {
  const c = r * 0.22
  return `M${cx} ${cy - r} Q${cx + c} ${cy - c} ${cx + r} ${cy} Q${cx + c} ${cy + c} ${cx} ${cy + r} Q${cx - c} ${cy + c} ${cx - r} ${cy} Q${cx - c} ${cy - c} ${cx} ${cy - r} Z`
}

/**
 * Rocket with sparkles — used for the "GTM Plan Generator" sidebar tool.
 * lucide-react has no sparkle-rocket, so this is hand-authored in the same
 * line style (24×24, 2px stroke, currentColor) as the rest of the icon set,
 * so it inherits size/color exactly like a lucide component.
 */
export function RocketSparkIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* rocket (lucide Rocket paths) at full size for crispness at small icon sizes */}
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      {/* sparkle tucked into the empty top-left corner */}
      <path d={spark(4.3, 4.6, 2)} />
    </svg>
  )
}
