import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './shared/i18n'

createRoot(document.getElementById("root")!).render(<App />);
