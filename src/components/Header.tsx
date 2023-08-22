import { AiOutlinePieChart, AiOutlineSearch } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const navigate = useNavigate()
    return (
        <div className='flex flex-col w-full'>
            <div className='flex flex-row justify-between items-center p-5 border border-zinc-300'>
                <h1 className='font-link'>BlackRock</h1>
                <div className='flex flex-row justify-center items-center space-x-4'>
                    <button className='flex flex-row justify-center items-center' onClick={() => navigate("/portfolio")}>
                        <AiOutlinePieChart size={18}/>
                        <h1 className='font-extrabold text-md'>Portfolio</h1>
                    </button>
                    <button className='flex flex-row justify-center items-center' onClick={() => navigate("/search")}>
                        <AiOutlineSearch size={18}/>
                        <h1 className='font-extrabold text-md'>Search</h1>
                    </button>
                </div>    
            </div>
        </div>
    )
}

export default Header