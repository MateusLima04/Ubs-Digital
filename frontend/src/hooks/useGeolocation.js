import { useState } from 'react'
export function useGeolocation() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  function locate() {
    if (!navigator.geolocation) { setError('Seu navegador não oferece localização. Você ainda pode buscar por nome ou bairro.'); return }
    setLoading(true); setError('')
    navigator.geolocation.getCurrentPosition(position => {
      setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude })
      setLoading(false)
    }, err => {
      setError(err.code === 1 ? 'Permissão de localização negada. Você ainda pode buscar por nome ou bairro.' : 'Não foi possível obter sua localização. Tente novamente ou busque por bairro.')
      setLoading(false)
    }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 })
  }
  return { location, error, loading, locate }
}
