import { AiOutlineCheckCircle } from 'react-icons/ai'
import { MdNotInterested } from 'react-icons/md'

type Props = {
  symbol: string,
  risk: string,
  price: string,
  approved: boolean,
}

const Stock = ({ symbol, risk, price, approved }: Props) => {
  return (
    <div className='flex flex-row justify-between items-center space-x-4'>
        <div className='flex flex-row justify-center items-center space-x-1'>
          <h1 className=''>Symbol:</h1>
          <h1 className='font-bold'>{symbol}</h1>
        </div>
        <div className='flex flex-row justify-center items-center space-x-1'>
          <h1 className=''>Risk:</h1>
          <h1 className='font-bold'>{risk}</h1>
        </div>
        <div className='flex flex-row justify-center items-center space-x-1'>
          <h1 className=''>Price:</h1>
          <h1 className='font-bold'>${price}</h1>
        </div>
        {approved ? (<div className='flex flex-row justify-center items-center space-x-1' ><AiOutlineCheckCircle color={"green"}/><h1>Approved</h1></div>): (<div className='flex flex-row justify-center items-center space-x-1' ><MdNotInterested color={"red"}/><h1>Not approved</h1></div>)}
    </div>
  )
}

export default Stock