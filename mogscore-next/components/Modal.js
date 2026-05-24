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
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,.85)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border-md)',
          borderRadius: 'var(--r-lg)',
          width: '100%',
          maxWidth: maxWidth,
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflowY: 'auto',
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
