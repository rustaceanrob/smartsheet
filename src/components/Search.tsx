import { useState } from 'react'
import Header from './Header'
import { AiOutlineSearch } from 'react-icons/ai'
import axios from 'axios'
import { CgSpinner } from 'react-icons/cg'

interface StockInfo {
  name: string,
  description: string,
  price: string,
  institutions: string,
  beta: string,
  risk: string,
}

const Search = () => {
  const [searchText, setSearchText] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [info, setInfo] = useState<StockInfo>()

  const search = (symbol: string) => {
    setLoading(true)
    setInfo(undefined)
    let payload = { "symbol": symbol.toUpperCase() }
    axios({
      method: 'post',
      url: 'http://localhost:5002/search',
      withCredentials: false, 
      data: payload,
      headers: {
        'Content-Type': 'application/json'
      }}).then(res => 
        setInfo(res.data as StockInfo)
    ).catch(err => {
      console.warn(err)
    }).finally(() => {
      setLoading(false)
    })
  }

  const addToSheet = () => {
    setLoading(true)
    setInfo(undefined)
    let payload = { "symbol": searchText.toUpperCase() }
    axios({
      method: 'post',
      url: 'http://localhost:5002/add_row',
      withCredentials: false, 
      data: payload,
      headers: {
        'Content-Type': 'application/json'
      }}).then(res => 
        console.log(res)
    ).catch(err => {
      console.warn(err)
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <div className='w-full h-screen'>
        <Header/>
        <div className='px-5 py-5 bg-zinc-100 flex flex-row items-center space-x-2 pl-60 pr-60'>
          <AiOutlineSearch size={20}/>
          <input type='text' className='text-zinc-900 w-full px-2 py-2 font-semibold rounded-md' onChange={(event) => setSearchText(event.target.value)}></input>
          <button className='font-bold border border-zinc-300 px-2 py-2 bg-white text-black rounded-md' onClick={() => search(searchText)}>
            Search
          </button>
        </div>
        {loading && <div className='pt-10 flex flex-col justify-center items-center w-full'><CgSpinner className="animate-spin" size={20}/></div>}
        {info && <div className='p-5 pl-60 pr-60 justify-center items-center '>
                    <div className='flex flex-row justify-between items-center pb-5'>
                      <h1 className='font-extrabold'>{info.name}</h1>
                      <button className='flex flex-row justify-center items-center bg-blue-500 px-2 py-2 rounded-md' onClick={() => addToSheet()}>
                        <h1 className='font-bold text-white'>Add to Portfolio</h1>
                      </button>
                    </div>
                    <p className='pb-5'>{info.description}</p>
                    <div className='px-5 py-5 flex flex-row justify-center items-center space-x-5 border border-zinc-300 rounded-md bg-zinc-100'>
                      <div className='flex flex-row justify-start items-start space-x-1'>
                        <h1 className='font-semibold'>Price: </h1>
                        <h1 className=''>${info.price}</h1>
                      </div>
                      <div className='flex flex-row justify-center items-center space-x-1'>
                        <h1 className='font-semibold'>Percent Held By Institutions: </h1>
                        <h1>{info.institutions}</h1>
                      </div>
                      <div className='flex flex-row justify-center items-center space-x-1'>
                        <h1 className='font-semibold'>Market Correlation: </h1>
                        <h1>{info.beta}</h1>
                      </div>
                      <div className='flex flex-row justify-center items-center space-x-1'>
                        <h1 className='font-semibold'>Overall Risk: </h1>
                        <h1 className=''>{info.risk}</h1>
                      </div>
                    </div>
                  </div>}
    </div>
  )
}

export default Search