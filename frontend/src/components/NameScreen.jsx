import { ArrowRight, ShieldCheck } from 'lucide-react'
import Brand from './Brand'
import ClinicIllustration from './ClinicIllustration'
import DemoModeBadge from './DemoModeBadge'

export default function NameScreen({ value, onChange, onSubmit, onGuest }) {
  return <div className="name-page prototype-name">
    <header className="simple-header"><Brand /><DemoModeBadge /></header>
    <main className="name-layout">
      <div className="name-visual"><ClinicIllustration /><span>Encontre uma UBS perto de você</span></div>
      <div className="name-form">
        <span className="eyebrow">BEM-VINDO À UBS DIGITAL</span>
        <h1>Como podemos<br /><em>chamar você?</em></h1>
        <p>Seu nome deixa a experiência mais pessoal. Você também pode continuar como visitante.</p>
        <form onSubmit={onSubmit}>
          <label htmlFor="name">Qual o seu nome?</label>
          <input id="name" value={value} onChange={event => onChange(event.target.value)} placeholder="Digite seu nome" maxLength={40} autoComplete="given-name" />
          <button className="primary-button" type="submit">Continuar <ArrowRight size={19} /></button>
        </form>
        <button className="name-guest" onClick={onGuest}>Prefiro entrar como visitante <ArrowRight size={16} /></button>
        <p className="name-privacy"><ShieldCheck size={16} /> Salvamos apenas seu nome neste dispositivo.</p>
      </div>
    </main>
  </div>
}
