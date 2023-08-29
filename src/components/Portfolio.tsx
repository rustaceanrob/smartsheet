import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Header from './Header'
import axios from 'axios'
import { CgSpinner } from 'react-icons/cg'
import Stock from './Stock'

interface Asset {
  symbol: string,
  risk: string,
  price: string,
  approved: boolean,
}

type Props = {
  setSymbol: Dispatch<SetStateAction<string>>
}

const Portfolio = ({ setSymbol }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [portfolio, setPortfolio] = useState<Asset[]>([])
  const [approved, setApproved] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    axios({
      method: 'get',
      url: 'http://localhost:5002/all_approved',
      withCredentials: false, 
      headers: {
        'Content-Type': 'application/json'
      }}).then(res => {
        let p: Asset[] = []
        res.data.forEach((stock: any) => {
          let symbol = stock[0]
          let risk = stock[2]
          let price = stock[4]
          let approved = stock[5]
          p.push({ symbol, risk, price, approved } as Asset)
        })
        setPortfolio(p)
      }
    ).catch(err => {
        console.warn(err)
    }).finally(() => {
        setLoading(false)
    })
  }, [])

  const toggleApproval = () => {
    setLoading(true)
    if (!approved) {
      axios({
        method: 'get',
        url: 'http://localhost:5002/all_approved',
        withCredentials: false, 
        headers: {
          'Content-Type': 'application/json'
        }}).then(res => {
          let p: Asset[] = []
          res.data.forEach((stock: any) => {
            let symbol = stock[0]
            let risk = stock[2]
            let price = stock[4]
            let approved = stock[5]
            p.push({ symbol, risk, price, approved } as Asset)
          })
          setPortfolio(p)
        }
      ).catch(err => {
          console.warn(err)
      }).finally(() => {
          setLoading(false)
      })
    } else {
      axios({
        method: 'get',
        url: 'http://localhost:5002/all',
        withCredentials: false, 
        headers: {
          'Content-Type': 'application/json'
        }}).then(res => {
          let p: Asset[] = []
          res.data.forEach((stock: any) => {
            let symbol = stock[0]
            let risk = stock[2]
            let price = stock[4]
            let approved = stock[5]
            p.push({ symbol, risk, price, approved } as Asset)
          })
          setPortfolio(p)
        }
      ).catch(err => {
          console.warn(err)
      }).finally(() => {
          setLoading(false)
      })
    }
    setApproved(!approved)
  }

  return (
    <div>
      <Header/>
      <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-row justify-between items-center pt-5 pb-5 w-full pl-40 pr-40'>
        </div>
        {loading && <div className='flex flex-col justify-center items-center'><CgSpinner className="animate-spin" size={20}/></div>}
        {!loading && portfolio?.length === 0 && <h1 className='pt-10 font-semibold text-sm'>No assets approved yet.</h1>}
        {portfolio && !loading && portfolio.length !== 0 && <div className='border border-zinc-300 px-5 py-5 bg-zinc-100 rounded-md space-y-5'>
        <button onClick={() => toggleApproval()} className='flex flex-row justify-center items-center text-white font-bold bg-blue-500 px-2 py-2 rounded-md w-full'>
              Toggle Approval
            </button>
          {
            portfolio.map((stock: Asset) => {
              return <Stock symbol={stock.symbol} price={stock.price} risk={stock.risk} approved={stock.approved} setSymbol={setSymbol}/>
            })
          }
        </div>}
      </div>
    </div>
  )
}

export default Portfolio