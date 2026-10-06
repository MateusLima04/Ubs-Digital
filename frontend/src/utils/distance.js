const toRadians = degrees => degrees * Math.PI / 180
export function distanceKm(from, to) {
  if (!from || !to) return null
  const deltaLatitude = toRadians(Number(to.latitude) - Number(from.latitude))
  const deltaLongitude = toRadians(Number(to.longitude) - Number(from.longitude))
  const a = Math.sin(deltaLatitude / 2) ** 2 + Math.cos(toRadians(Number(from.latitude))) * Math.cos(toRadians(Number(to.latitude))) * Math.sin(deltaLongitude / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
export const formatDistance = km => km == null ? 'Distância indisponível' : `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(km)} km`
