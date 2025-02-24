import { css } from "@emotion/react";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  isShow?: boolean;
}

export function NextButton(props: ButtonProps) {
  return (
    <button
      css={css({
        position: "absolute",
        zIndex: 9999,
        right: "2rem",
        bottom: "2rem",
        color: "#000000",
        backgroundColor: "#ffffff96",
        backdropFilter: "blur(8px)",
        border: "none",
        padding: "0.75rem 1.25rem",
        borderRadius: "8px",
        fontWeight: "300",
        fontSize: "14px",
        outline: "rgba(240, 240, 244, 0.51) solid 0.1rem",
        cursor: "pointer",
        transition: "0.2s",
        display: props.isShow ? "" : "none",
        ":hover": {
          backgroundColor: "#ebeef0c2",
        },
        ":disabled": {
          backgroundColor: "#ebeef0c2",
          cursor: "not-allowed",
        },
      })}
      {...props}
    >
      {props.children}
    </button>
  );
}

export function PrevButton(props: ButtonProps) {
  return (
    <button
      css={css({
        position: "absolute",
        zIndex: 9999,
        left: "2rem",
        bottom: "2rem",
        color: "#000000",
        backgroundColor: "#ffffff96",
        backdropFilter: "blur(8px)",
        border: "none",
        padding: "0.75rem 1.25rem",
        borderRadius: "8px",
        fontWeight: "300",
        fontSize: "14px",
        outline: "rgba(240, 240, 244, 0.51) solid 0.1rem",
        cursor: "pointer",
        transition: "0.2s",
        display: props.isShow ? "" : "none",

        ":hover": {
          backgroundColor: "#ebeef0c2",
        },
        ":disabled": {
          backgroundColor: "#ebeef0c2",
          cursor: "not-allowed",
        },
      })}
      {...props}
    >
      {props.children}
    </button>
  );
}
