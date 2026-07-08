'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ onClose, children, maxWidth = 520 }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
