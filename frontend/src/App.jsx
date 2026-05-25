import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css';
import LeadDetail from './LeadDetail.jsx';


function App() {
  const [count, setCount] = useState(0)

  return (<>
      <LeadDetail />
  </>)
}

export default App
