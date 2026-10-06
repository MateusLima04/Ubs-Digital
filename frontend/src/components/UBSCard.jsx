import { ArrowUpRight, Clock3, MapPin } from 'lucide-react'
import { formatDistance } from '../utils/distance'
export default function UBSCard({ unidade, onClick, index }) {
  return <button className="ubs-card" onClick={() => onClick(unidade)} aria-label={`Ver detalhes de ${unidade.nome}`}>
    <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
    <span className="card-main"><strong>{unidade.nome}</strong><span className="card-address"><MapPin size={14}/>{unidade.bairro} · {unidade.endereco}</span><span className="card-hours"><Clock3 size={14}/>{unidade.horario_funcionamento}</span></span>
    <span className="card-side"><span className="distance-pill">{unidade.distance == null ? 'Ver local' : formatDistance(unidade.distance)}</span><span className="card-arrow"><ArrowUpRight size={18}/></span></span>
  </button>
}
