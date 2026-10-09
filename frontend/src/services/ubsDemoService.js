import unidades from '../data/ubs_recife_demo.json'
import { withDisplayName } from '../utils/unitName'

export async function listUBS() {
  return unidades.filter(unidade => unidade.ativa).map(withDisplayName)
}
