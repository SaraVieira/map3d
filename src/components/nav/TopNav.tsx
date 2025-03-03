import { DetailedHTMLProps, ButtonHTMLAttributes, useState } from "react"
import { Modal } from "../modal/Modal"
import { Column } from "../flex/Column"
import { Title } from "../text/Title"

const TOP_PANEL_HEIGHT = "3rem"
const BORDER_COLOR = "#ededf290"

const breakpoints = [768]

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  isShow?: boolean
}

export function TopNav() {
  return (
    <>
      <NavButton
        isShow={true}
        onClick={() => window.open("https://github.com/cartesiancs/map3d")}
      >
        GitHub
      </NavButton>
    </>
  )
}

export function NavButton(props: ButtonProps) {
  return (
    <button
      style={{
        display: props.isShow ? "" : "none",
      }}
      {...props}
    >
      {props.children}
    </button>
  )
}
