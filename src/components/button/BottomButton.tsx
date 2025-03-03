import { ButtonHTMLAttributes, DetailedHTMLProps } from "react"

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  isShow?: boolean
}

export function NextButton(props: ButtonProps) {
  return (
    <button
      style={{
        display: props.isShow ? "flex" : "none",
      }}
      {...props}
    >
      {props.children}
    </button>
  )
}

export function PrevButton(props: ButtonProps) {
  return <button {...props}>{props.children}</button>
}

export function Button(props: ButtonProps) {
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
