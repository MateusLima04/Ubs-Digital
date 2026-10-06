import { ArrowUpRight, Clock3, MapPin, Phone, X, Navigation, Hash } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { formatDistance } from '../utils/distance'
export default function UBSDetailsModal({ unidade, onClose }) {
  const closeRef = useRef(null)
  useEffect(() => {
    closeRef.current?.focus()
    const escape = event => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [onClose])
  if (!unidade) return null
  const route = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${unidade.latitude},${unidade.longitude}`)}`
  return <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}><section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="details-title">
    <button ref={closeRef} className="modal-close" aria-label="Fechar detalhes" onClick={onClose}><X size={20}/></button>
    <div className="modal-icon"><MapPin size={25}/></div><span className="eyebrow">UNIDADE BÁSICA DE SAÚDE</span><h2 id="details-title">{unidade.nome}</h2><p className="modal-lead">Informações da unidade para planejar sua visita.</p>
    <div className="details-list"><div><MapPin size={19}/><span><small>ENDEREÇO</small><strong>{unidade.endereco}, {unidade.bairro}</strong></span></div><div><Hash size={19}/><span><small>CEP</small><strong>{unidade.cep}</strong></span></div><div><Phone size={19}/><span><small>TELEFONE</small><strong>{unidade.telefone}</strong></span></div><div><Clock3 size={19}/><span><small>FUNCIONAMENTO</small><strong>{unidade.horario_funcionamento}</strong></span></div><div><Navigation size={19}/><span><small>DISTÂNCIA APROXIMADA</small><strong>{formatDistance(unidade.distance)}</strong></span></div></div>
    <a className="primary-button route-button" href={route} target="_blank" rel="noopener noreferrer">Ver rota no Google Maps <ArrowUpRight size={18}/></a><p className="demo-note">Dados fictícios para demonstração. Confirme horários e contato antes de visitar.</p>
  </section></div>
}
