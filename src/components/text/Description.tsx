import { DESC_COLOR } from "@/theme/color"

export function Description({ children }: { children?: React.ReactNode }) {
  return (
    <p
      style={{
        color: DESC_COLOR,
      }}
    >
      {children}
    </p>
  )
}
