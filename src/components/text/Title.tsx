import { SUBTITLE_COLOR } from "@/theme/color"

export function Title({ children }: { children?: React.ReactNode }) {
  return (
    <p
      style={{
        color: SUBTITLE_COLOR,
      }}
    >
      {children}
    </p>
  )
}
