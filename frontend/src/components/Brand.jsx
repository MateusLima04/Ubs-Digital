import { HeartPulse } from 'lucide-react'
export default function Brand({ light = false }) {
  return <div className={`brand ${light ? 'brand-light' : ''}`}><span className="brand-mark"><HeartPulse size={24} strokeWidth={2.3} /></span><span>UBS <strong>Digital</strong><small>SAÚDE PERTO DE VOCÊ</small></span></div>
}
