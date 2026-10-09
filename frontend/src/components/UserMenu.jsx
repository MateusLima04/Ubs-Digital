import { ChevronDown, LogOut } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function UserMenu({ name, onLogout }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const label = name || 'Visitante'

  useEffect(() => {
    function closeMenu(event) {
      if (event.key === 'Escape' || (event.type === 'mousedown' && !menuRef.current?.contains(event.target))) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', closeMenu)
    document.addEventListener('keydown', closeMenu)
    return () => {
      document.removeEventListener('mousedown', closeMenu)
      document.removeEventListener('keydown', closeMenu)
    }
  }, [])

  return <div className="user-menu" ref={menuRef}>
    <button className="user-menu-trigger" type="button" aria-label={`Menu do usuário ${label}`} aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen(current => !current)}>
      <span className="avatar" aria-hidden="true">{label.charAt(0).toUpperCase()}</span>
      <span className="header-name">{label}</span>
      <ChevronDown className={open ? 'user-menu-chevron open' : 'user-menu-chevron'} size={15} />
    </button>
    {open && <div className="user-menu-panel" role="menu">
      <span className="user-menu-label">Navegação do visitante</span>
      <button type="button" role="menuitem" onClick={onLogout}><LogOut size={16} /> Sair</button>
    </div>}
  </div>
}
