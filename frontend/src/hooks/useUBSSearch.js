import { useMemo } from 'react'
import { distanceKm } from '../utils/distance'
export function filterAndSortUBS(unidades, query, location, bairro = '') {
  const term = query.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  return unidades.filter(unidade => {
    const searchable = [unidade.nome, unidade.bairro, unidade.endereco].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    return searchable.includes(term) && (!bairro || unidade.bairro === bairro)
  }).map(unidade => ({ ...unidade, distance: distanceKm(location, unidade) }))
    .sort((a, b) => location ? a.distance - b.distance : a.nome.localeCompare(b.nome, 'pt-BR'))
}
export function useUBSSearch(unidades, query, location, bairro) {
  return useMemo(() => filterAndSortUBS(unidades, query, location, bairro), [unidades, query, location, bairro])
}
