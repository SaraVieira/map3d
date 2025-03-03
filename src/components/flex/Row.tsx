import { Properties } from "csstype"

export function Row({
  children,
  gap = "0.25rem",
  justify = "unset",
  overflow = "visible",
}: {
  children?: React.ReactNode
  gap?: string
  justify?: string
  overflow?: Properties["overflow"]
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: gap,
        justifyContent: justify,
        overflow: overflow,
      }}
    >
      {children}
    </div>
  )
}
