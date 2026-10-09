import { lazy, Suspense } from 'react'
import { ArrowRight, Compass, Cross, LocateFixed, MapPin, Navigation, Search, SlidersHorizontal, X } from 'lucide-react'
import Brand from './Brand'
import DemoModeBadge from './DemoModeBadge'
import UBSCard from './UBSCard'

const MapView = lazy(() => import('./MapView'))

const careOptions = [
  { label: 'Clínica médica', value: 'clinica' },
  { label: 'Pediatria', value: 'pediatria' },
  { label: 'Odontologia', value: 'odontologia' },
]

export default function ExplorerScreen({
  name,
  unidades,
  results,
  bairros,
  filters,
  onFilterChange,
  onClearFilters,
  location,
  locationError,
  locating,
  locate,
  dataError,
  selected,
  onSelect,
  mobileView,
  onSwitchView,
}) {
  const { query, bairro, street, specialty } = filters
  const activeFilters = [query, bairro, street, specialty].filter(Boolean)

  return <div className={`app-shell view-${mobileView}`}>
    <header className="app-header"><div className="header-inner">
      <Brand />
      <nav aria-label="Navegação principal">
        <a href="#mapa" onClick={() => onSwitchView('map')}><Compass size={17} /> Explorar</a>
        <a href="#unidades" onClick={() => onSwitchView('search')}>Unidades</a>
      </nav>
      <div className="header-right"><DemoModeBadge /><span className="avatar" aria-hidden="true">{(name || 'V').charAt(0).toUpperCase()}</span><span className="header-name">{name || 'Visitante'}</span></div>
    </div></header>

    <main>
      <section className="dashboard-intro">
        <div className="intro-copy"><span className="eyebrow">ENCONTRE UMA UBS PERTO DE VOCÊ</span><h1>Olá, {name || 'visitante'}</h1><p>Seu cuidado começa com uma boa informação.</p></div>
        <div className="intro-stat"><span><Cross size={23} /></span><div><strong>{unidades.length} unidades</strong><small>na base recebida para Recife</small></div></div>
      </section>

      <section className="explorer" id="mapa">
        <div className="explorer-header"><div><span className="eyebrow">SUA BUSCA</span><h2>Encontre uma UBS perto de você</h2></div><span className="recife-tag"><MapPin size={15} /> Recife, PE</span></div>
        <div className="prototype-filter-heading"><SlidersHorizontal size={16} /> Escolha suas opções</div>
        <div className="care-options" role="group" aria-label="Tipo de atendimento">
          {careOptions.map(option => <button key={option.value} type="button" className={specialty === option.value ? 'active' : ''} aria-pressed={specialty === option.value} onClick={() => onFilterChange('specialty', specialty === option.value ? '' : option.value)}>{option.label}</button>)}
        </div>
        <div className="search-row">
          <div className="search-field"><Search size={20} /><input aria-label="Buscar por nome, bairro ou endereço" placeholder="Busque por nome, bairro ou endereço..." value={query} onChange={event => onFilterChange('query', event.target.value)} />{query && <button aria-label="Limpar busca" onClick={() => onFilterChange('query', '')}><X size={18} /></button>}</div>
          <label className="select-field"><span className="sr-only">Filtrar por bairro</span><select value={bairro} onChange={event => onFilterChange('bairro', event.target.value)}><option value="">Todos os bairros</option>{bairros.map(item => <option key={item}>{item}</option>)}</select></label>
          <div className="street-field"><input aria-label="Filtrar por rua" placeholder="Nome da rua" value={street} onChange={event => onFilterChange('street', event.target.value)} /></div>
          <button className="location-button" disabled={locating} onClick={locate}><LocateFixed size={18} />{locating ? 'Localizando...' : 'Usar minha localização'}</button>
        </div>
        <div className="search-status" aria-live="polite">
          <span><strong>{results.length}</strong> {results.length === 1 ? 'unidade encontrada' : 'unidades encontradas'}</span>
          {activeFilters.length > 0 && <button type="button" onClick={onClearFilters}>Limpar filtros <X size={14} /></button>}
        </div>
        {locationError && <p className="feedback" role="alert">{locationError}</p>}
        {dataError && <p className="feedback" role="alert">{dataError}</p>}
        <div className="mobile-map-top"><span>Olá, {name || 'visitante'}</span><strong>Encontre uma UBS perto de você</strong></div>
        <Suspense fallback={<div className="map-frame map-loading" role="status">Carregando mapa...</div>}>
          <MapView unidades={results} location={location} selected={selected} onSelect={onSelect} />
        </Suspense>
        <div className="map-caption">
          <span><span className="legend-dot" /> Unidades de saúde <span className="legend-dot blue" /> Sua localização</span>
          <span><a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer">OpenFreeMap</a> · <a href="https://openmaptiles.org" target="_blank" rel="noopener noreferrer">© OpenMapTiles</a> · Dados: <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a></span>
        </div>
        <button className="mobile-results-button" onClick={() => onSwitchView('search')}>Ver {results.length} {results.length === 1 ? 'opção' : 'opções'} <ArrowRight size={17} /></button>
      </section>

      <section className="units-section" id="unidades">
        <div className="units-head"><div><span className="eyebrow">UNIDADES BÁSICAS DE SAÚDE</span><h2>{location ? 'Unidades mais próximas' : 'Unidades no Recife'}</h2><p>{location ? 'Ordenadas pela distância aproximada da sua posição.' : 'Busque por nome, bairro ou rua. Permita a localização para ordenar por distância.'}</p></div><div className="results-count">{results.length} {results.length === 1 ? 'resultado' : 'resultados'}</div></div>
        {results.length ? <div className="units-grid">{results.map((unit, index) => <UBSCard key={unit.id} unidade={unit} index={index} onClick={onSelect} />)}</div> : <div className="empty-state"><Search size={27} /><strong>Nenhuma unidade encontrada</strong><span>Tente outro nome, endereço, bairro ou atendimento.</span></div>}
      </section>
    </main>

    <footer className="app-footer"><Brand /><p>Uma forma simples de encontrar cuidado perto de você.</p><span>Dados do CSV fornecido · Confirme antes de visitar</span><a href="/admin/" target="_blank" rel="noopener noreferrer">Admin</a></footer>
    <nav className="bottom-nav" aria-label="Navegação móvel">
      <button className={mobileView === 'map' ? 'active' : ''} onClick={() => onSwitchView('map')}><Compass size={20} /> Início</button>
      <button className={mobileView === 'search' ? 'active' : ''} onClick={() => onSwitchView('search')}><Search size={20} /> Busca</button>
      <button onClick={locate}><Navigation size={20} /> Localizar</button>
    </nav>
  </div>
}
