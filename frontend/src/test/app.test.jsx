import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import App from '../App'
import { distanceKm } from '../utils/distance'
import { filterAndSortUBS } from '../hooks/useUBSSearch'
import { formatUnitName } from '../utils/unitName'
import { listUBS, isDemoMode } from '../services/ubsService'
import * as demo from '../services/ubsDemoService'
import * as api from '../services/ubsApiService'

vi.mock('../components/MapView', () => ({ default: () => <div data-testid="map-view"/> }))
beforeEach(() => { localStorage.clear(); vi.restoreAllMocks() })

describe('modo demonstração', () => {
  it('carrega sem backend e alterna a fonte conforme a configuração', async () => {
    expect(isDemoMode).toBe(true)
    const demoSpy = vi.spyOn(demo, 'listUBS')
    const apiSpy = vi.spyOn(api, 'listUBS')
    expect((await listUBS()).length).toBe(22)
    expect(demoSpy).toHaveBeenCalledOnce()
    expect(apiSpy).not.toHaveBeenCalled()
  })
  it('busca na API quando o modo demonstração está desligado', async () => {
    vi.stubEnv('VITE_DEMO_MODE', 'false')
    vi.resetModules()
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [{ id: 42, nome: 'US 103 CS Prof Mário Ramos' }] })
    vi.stubGlobal('fetch', fetchMock)
    const service = await import('../services/ubsService.js')
    expect(service.isDemoMode).toBe(false)
    expect(await service.listUBS()).toEqual([{ id: 42, nome: 'Prof Mário Ramos', nome_oficial: 'US 103 CS Prof Mário Ramos' }])
    expect(fetchMock).toHaveBeenCalledWith('/api/ubs/')
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })
  it('mostra entrada, visitante, busca e detalhes', async () => {
    render(<App />)
    fireEvent.click(screen.getByText('Entrar como visitante'))
    expect(await screen.findByRole('heading', { name: /Olá, visitante/ })).toBeTruthy()
    expect(screen.getByTestId('map-view')).toBeTruthy()
    fireEvent.change(screen.getByLabelText('Buscar por nome, bairro ou endereço'), { target: { value: 'Beberibe' } })
    expect(screen.getByText('1 resultado')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Limpar filtros/ }))
    expect(screen.getByText('22 resultados')).toBeTruthy()
    fireEvent.click(screen.getByLabelText('Ver detalhes de Prof Monteiro de Morais'))
    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(screen.getByText(/GINECOLOGIA, PEDIATRIA/)).toBeTruthy()
    expect(screen.queryByText('CEP')).toBeNull()
    expect(screen.queryByText('COMO ACESSAR')).toBeNull()
    expect(screen.getByRole('link', { name: /Ver rota/ }).getAttribute('href')).toContain('google.com/maps/dir')
  })
  it('salva somente o nome e usa a saudação personalizada', async () => {
    render(<App />)
    fireEvent.click(screen.getByText('Começar agora'))
    fireEvent.change(screen.getByLabelText('Qual o seu nome?'), { target: { value: 'Ana' } })
    fireEvent.click(screen.getByText('Continuar'))
    expect(await screen.findByRole('heading', { name: /Olá, Ana/ })).toBeTruthy()
    expect(localStorage.getItem('ubs-digital-name')).toBe('Ana')
    expect(localStorage.length).toBe(1)
  })
  it('explica permissão de localização negada', async () => {
    Object.defineProperty(navigator, 'geolocation', { configurable: true, value: { getCurrentPosition: (_success, error) => error({ code: 1 }) } })
    render(<App />)
    fireEvent.click(screen.getByText('Entrar como visitante'))
    fireEvent.click(screen.getByText('Usar minha localização'))
    expect(await screen.findByRole('alert')).toHaveProperty('textContent', expect.stringContaining('Permissão de localização negada'))
  })
})

describe('busca e distância', () => {
  const units = [{ id: 1, nome: 'Alfa', bairro: 'Pina', endereco: 'Rua A', latitude: -8.08, longitude: -34.88 }, { id: 2, nome: 'Beta', bairro: 'Várzea', endereco: 'Rua B', latitude: -8.04, longitude: -34.95 }]
  it('calcula Haversine e retorna nulo sem localização', () => {
    expect(distanceKm(units[0], units[0])).toBe(0)
    expect(distanceKm(units[0], units[1])).toBeGreaterThan(8)
    expect(distanceKm(null, units[0])).toBeNull()
  })
  it('filtra com ou sem acentos e ordena pela distância', () => {
    expect(filterAndSortUBS(units, 'varzea', null).map(item => item.id)).toEqual([2])
    expect(filterAndSortUBS(units, '', units[1]).map(item => item.id)).toEqual([2, 1])
    expect(filterAndSortUBS(units, '', null, 'Pina').map(item => item.id)).toEqual([1])
  })
  it('filtra por rua e atendimento do CSV', () => {
    const rows = [{ ...units[0], especialidade: 'CLÍNICA MÉDICA' }, { ...units[1], especialidade: 'PEDIATRIA' }]
    expect(filterAndSortUBS(rows, '', null, '', { street: 'rua b', specialty: 'pediatria' }).map(item => item.id)).toEqual([2])
  })
  it('remove o código institucional do nome exibido e preserva nomes sem código', () => {
    expect(formatUnitName('US 103 CS Prof Mário Ramos')).toBe('Prof Mário Ramos')
    expect(formatUnitName('US 158 Pam Ceasa')).toBe('Pam Ceasa')
    expect(formatUnitName('UBS da API')).toBe('UBS da API')
  })
})
