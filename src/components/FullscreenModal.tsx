import { css } from "@emotion/react";
import React from "react";

export function FullscreenModal({
  children,
  isOpen = false,
}: {
  children: React.ReactNode;
  isOpen?: boolean;
}) {
  return (
    <div
      css={css({
        width: "100%",
        height: "100%",
        position: "fixed",
        zIndex: 999,
        backgroundColor: "#ffffffc9",
        backdropFilter: "blur(12px)",
        display: isOpen ? "flex" : "none",
      })}
    >
      <div
        css={css({
          padding: "2rem",
          width: "100%",
        })}
      >
        {children}
      </div>
    </div>
  );
}
