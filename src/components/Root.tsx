import { Route, Routes } from 'react-router-dom'
import Search from './Search'
import Portfolio from './Portfolio'
import Comment from './Comment'
import { useState } from 'react'

function Root() {
  const [symbol, setSymbol] = useState<string>("")
  return (
    <div>
        <Routes>
            <Route path="/search" element={<Search/>}/>
            <Route path="/portfolio" element={<Portfolio setSymbol={setSymbol}/>}/>
            <Route path="/comment" element={<Comment symbol={symbol}/>}/>
        </Routes>
    </div>

    

          
  )

}

export default Root