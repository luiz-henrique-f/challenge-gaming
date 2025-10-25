// hooks/useTaskModal.ts
import { useState } from 'react'

export function useTaskModal() {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return {
    isOpen,
    open,
    close,
  }
}