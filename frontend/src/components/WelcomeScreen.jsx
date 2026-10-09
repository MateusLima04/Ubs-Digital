import { ArrowRight, ShieldCheck } from 'lucide-react'
import Brand from './Brand'
import ClinicIllustration from './ClinicIllustration'
import DemoModeBadge from './DemoModeBadge'

export default function WelcomeScreen({ onStart, onGuest }) {
  return <div className="welcome-page prototype-welcome">
    <div className="welcome-left">
      <header><Brand light /><DemoModeBadge /></header>
      <div className="welcome-content">
        <span className="welcome-kicker">CUIDADO QUE ENCONTRA VOCÊ</span>
        <h1>Encontre uma UBS<br /><em>perto de você.</em></h1>
        <p>Acesse as unidades básicas de saúde do Recife na palma da mão.</p>
        <div className="welcome-actions">
          <button className="light-button" onClick={onStart}>Começar agora <ArrowRight size={19} /></button>
          <button className="text-button" onClick={onGuest}>Entrar como visitante <ArrowRight size={16} /></button>
        </div>
        <div className="welcome-trust"><ShieldCheck size={18} /> Sua localização não é armazenada</div>
      </div>
      <footer>UBS DIGITAL <span>·</span> RECIFE, PERNAMBUCO</footer>
    </div>
    <div className="welcome-right">
      <div className="welcome-illustration"><ClinicIllustration /><span>Saúde pública mais perto de você.</span></div>
    </div>
  </div>
}
