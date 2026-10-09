import { useMemo } from 'react'
import { distanceKm } from '../utils/distance'
export function filterAndSortUBS(unidades, query, location, bairro = '', options = {}) {
  const term = query.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const street = (options.street || '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const specialty = (options.specialty || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  return unidades.filter(unidade => {
    const searchable = [unidade.nome, unidade.nome_oficial, unidade.bairro, unidade.endereco].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    const address = unidade.endereco.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    const specialties = (unidade.especialidade || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    return searchable.includes(term) && address.includes(street) && specialties.includes(specialty) && (!bairro || unidade.bairro === bairro)
  }).map(unidade => ({ ...unidade, distance: distanceKm(location, unidade) }))
    .sort((a, b) => location ? a.distance - b.distance : a.nome.localeCompare(b.nome, 'pt-BR'))
}
export function useUBSSearch(unidades, query, location, bairro, options) {
  return useMemo(() => filterAndSortUBS(unidades, query, location, bairro, options), [unidades, query, location, bairro, options?.street, options?.specialty])
}
