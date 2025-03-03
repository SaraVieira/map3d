import { useEffect, useState } from "react"

type ModalType = {
  children?: any
  onClose?: any
  isOpen?: boolean
  isScroll?: boolean
}
function Modal({ children, onClose, isOpen, isScroll = false }: ModalType) {
  const [open, setOpen] = useState(false)

  const handleClose = (e: any) => {
    if (e.target.id != "modal") {
      return false
    }

    setTimeout(() => {
      onClose()
      setOpen(false)
    }, 280)
  }

  useEffect(() => {
    if (isOpen) {
      setOpen(true)
    } else {
      setTimeout(() => {
        onClose()
        setOpen(false)
      }, 280)
    }
  }, [isOpen])

  return (
    <div
      onClick={handleClose}
      id="modal"
      style={{
        display: open ? "flex" : "none",
      }}
    >
      <div style={{ height: isScroll ? "70vh" : "auto" }}>{children}</div>
    </div>
  )
}

export { Modal }
