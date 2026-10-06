import { FlaskConical } from 'lucide-react'
import { isDemoMode } from '../services/ubsService'
export default function DemoModeBadge() { return isDemoMode && <span className="demo-badge"><FlaskConical size={13} /> Modo demonstração</span> }
