import { withDisplayName } from '../utils/unitName'

export async function listUBS() {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
  const response = await fetch(`${base}/api/ubs/`)
  if (!response.ok) throw new Error('Não foi possível carregar as unidades. Tente novamente.')
  const data = await response.json()
  return (Array.isArray(data) ? data : data.results || []).map(withDisplayName)
}
