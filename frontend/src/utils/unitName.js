export function formatUnitName(name = '') {
  return name.replace(/^US\s*\d+\s*(?:CS\s*)?/i, '').trim() || name
}

export function withDisplayName(unit) {
  const officialName = unit.nome_oficial || unit.nome || ''
  return {
    ...unit,
    nome: formatUnitName(officialName),
    nome_oficial: officialName,
  }
}
