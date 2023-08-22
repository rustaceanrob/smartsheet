import { Route, Routes } from 'react-router-dom'
import Search from './Search'
import Portfolio from './Portfolio'

function Root() {
  return (
    <div>
        <Routes>
            <Route path="/search" element={<Search/>}/>
            <Route path="/portfolio" element={<Portfolio/>}/>
        </Routes>
    </div>

    

          
  )

}

export default Root