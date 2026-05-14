import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Docs from './pages/Docs'
import Api from './pages/Api'
import Try from './pages/Try'
import Examples from './pages/Examples'
import Blog from './pages/Blog'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/docs/*" element={<Docs />} />
          <Route path="/api" element={<Api />} />
          <Route path="/try" element={<Try />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
