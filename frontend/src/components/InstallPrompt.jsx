import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'
export default function InstallPrompt() {
  const [prompt, setPrompt] = useState(null)
  const [dismissed, setDismissed] = useState(false)
  useEffect(() => {
    const handler = event => { event.preventDefault(); setPrompt(event) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])
  if (!prompt || dismissed) return null
  return <div className="install-banner" role="status"><Download size={20} /><span>Leve a UBS Digital com você.</span><button onClick={async () => { await prompt.prompt(); setPrompt(null) }}>Instalar</button><button className="icon-button" aria-label="Dispensar aviso de instalação" onClick={() => setDismissed(true)}><X size={18}/></button></div>
}
