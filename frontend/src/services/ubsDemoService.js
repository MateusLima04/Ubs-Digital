import unidades from '../data/ubs_recife_demo.json'
export async function listUBS() { return unidades.filter(unidade => unidade.ativa) }
