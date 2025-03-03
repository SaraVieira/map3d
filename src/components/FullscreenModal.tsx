import React from "react"

export function FullscreenModal({
  children,
  isOpen = false,
}: {
  children: React.ReactNode
  isOpen?: boolean
}) {
  return (
    <div
      style={{
        display: isOpen ? "flex" : "none",
      }}
    >
      <div>{children}</div>
    </div>
  )
}
