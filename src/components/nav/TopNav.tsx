import { useCarStore } from "@/state/carStore";
import { css } from "@emotion/react";

const TOP_PANEL_HEIGHT = "3rem";
const BORDER_COLOR = "#ededf290";

const breakpoints = [768];
const mq = breakpoints.map((bp) => `@media (max-width: ${bp}px)`);

export function TopNav({ step }: { step: number }) {
  const setThirdMode = useCarStore((state) => state.setThirdMode);

  return (
    <div
      css={css({
        display: "flex",
        transition: ".5s",
        transform: "translate(0px, 0px)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: TOP_PANEL_HEIGHT,
        backgroundColor: "#ffffff50",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${BORDER_COLOR}`,
        zIndex: 9999,
        justifyContent: "space-between",
        alignItems: "center",
      })}
    >
      <div
        css={css({
          paddingLeft: "2rem",
          alignItems: "center",
          flexDirection: "row",
          display: "flex",
          gap: "0.75rem",
        })}
      >
        <span
          css={css({
            fontSize: "14px",
            fontWeight: "600",
            color: "#5b5d63",
          })}
        >
          🗺️ Map3d
        </span>
      </div>

      <div
        css={css({
          padding: "0rem 0rem",
          [mq[0]]: {
            display: "none",
          },
        })}
      ></div>

      <div
        css={css({
          paddingRight: "1rem",
          display: "flex",
          flexDirection: "row",
          gap: "0.5rem",
          [mq[0]]: {
            display: "none",
          },
        })}
      >
        <button
          style={{
            display: step == 2 ? "" : "none",
            color: "#000000",
            backgroundColor: "#ffffff96",
            backdropFilter: "blur(8px)",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            fontWeight: "300",
            fontSize: "12px",
            outline: "rgba(240, 240, 244, 0.51) solid 0.1rem",
          }}
          onClick={() => setThirdMode(true)}
        >
          Car Mode
        </button>
      </div>
    </div>
  );
}
