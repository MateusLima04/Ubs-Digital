import { useEffect, useMemo, useState } from 'react'
import ExplorerScreen from './components/ExplorerScreen'
import InstallPrompt from './components/InstallPrompt'
import NameScreen from './components/NameScreen'
import UBSDetailsModal from './components/UBSDetailsModal'
import WelcomeScreen from './components/WelcomeScreen'
import { useGeolocation } from './hooks/useGeolocation'
import { useUBSSearch } from './hooks/useUBSSearch'
import { listUBS } from './services/ubsService'

const NAME_KEY = 'ubs-digital-name'
const initialFilters = { query: '', bairro: '', street: '', specialty: '' }

function readName() {
  try {
    return localStorage.getItem(NAME_KEY) || ''
  } catch {
    return ''
  }
}

export default function App() {
  const [name, setName] = useState(readName)
  const [draftName, setDraftName] = useState('')
  const [page, setPage] = useState(name ? 'map' : 'welcome')
  const [mobileView, setMobileView] = useState('map')
  const [unidades, setUnidades] = useState([])
  const [dataError, setDataError] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [selected, setSelected] = useState(null)
  const { location, error: locationError, loading: locating, locate, reset: resetLocation } = useGeolocation()

  useEffect(() => {
    listUBS().then(setUnidades).catch(error => setDataError(error.message))
  }, [])

  const bairros = useMemo(
    () => [...new Set(unidades.map(unit => unit.bairro))].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [unidades],
  )
  const results = useUBSSearch(unidades, filters.query, location, filters.bairro, filters)

  function enter(value) {
    const clean = value.trim().replace(/\s+/g, ' ').slice(0, 40)
    if (clean) {
      try { localStorage.setItem(NAME_KEY, clean) } catch {}
    }
    setName(clean)
    setPage('map')
  }

  function switchView(view) {
    setMobileView(view)
    window.scrollTo?.({ top: 0, behavior: 'smooth' })
  }

  function updateFilter(field, value) {
    setFilters(current => ({ ...current, [field]: value }))
  }

  function clearFilters() {
    setFilters(initialFilters)
  }

  function logout() {
    try { localStorage.removeItem(NAME_KEY) } catch {}
    setName('')
    setDraftName('')
    setSelected(null)
    setFilters(initialFilters)
    setMobileView('map')
    resetLocation()
    setPage('welcome')
    window.scrollTo?.({ top: 0 })
  }

  return <>
    <InstallPrompt />
    {page === 'welcome' && <WelcomeScreen onStart={() => setPage('name')} onGuest={() => enter('')} />}
    {page === 'name' && <NameScreen value={draftName} onChange={setDraftName} onSubmit={event => { event.preventDefault(); enter(draftName) }} onGuest={() => enter('')} />}
    {page === 'map' && <ExplorerScreen
      name={name}
      unidades={unidades}
      results={results}
      bairros={bairros}
      filters={filters}
      onFilterChange={updateFilter}
      onClearFilters={clearFilters}
      location={location}
      locationError={locationError}
      locating={locating}
      locate={locate}
      dataError={dataError}
      selected={selected}
      onSelect={setSelected}
      mobileView={mobileView}
      onSwitchView={switchView}
      onLogout={logout}
    />}
    {selected && <UBSDetailsModal unidade={selected} onClose={() => setSelected(null)} />}
  </>
}
