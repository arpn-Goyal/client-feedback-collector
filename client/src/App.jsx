import { useState } from 'react'
import './App.css'
import ClientFeedbackForm from './pages/feedback/ClientFeedbackForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <ClientFeedbackForm></ClientFeedbackForm>
    </>
  )
}

export default App
