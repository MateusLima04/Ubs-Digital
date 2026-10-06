import * as demo from './ubsDemoService'
import * as api from './ubsApiService'
export const isDemoMode = import.meta.env.VITE_DEMO_MODE !== 'false'
export const listUBS = () => (isDemoMode ? demo : api).listUBS()
