import React, { useState } from 'react'
import Header from './Header'
import axios from 'axios'
import { CgSpinner } from 'react-icons/cg'
import { useNavigate } from 'react-router-dom'

type Props = {
    symbol: string
}

const Comment = ({ symbol }: Props) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [comment, setComment] = useState<string>("")
    const navigate = useNavigate()

    const submitComment = () => {
        setLoading(true)
        let payload = { "symbol": symbol, "comment": comment }
        axios({
            method: 'post',
            url: 'http://localhost:5002/discuss',
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
            navigate("/portfolio")
        })

    }

    return (
        <div>
            <Header/>
            {loading ? (
                <div className='pt-10 flex flex-col justify-center items-center w-full'><CgSpinner className="animate-spin" size={20}/></div>
            ): (
                <div className='w-full flex flex-col justify-center items-center'>
                    <div>
                        <h1 className='pt-5 pb-5 font-bold'>Adding a comment for {symbol}</h1>
                    </div>
                    <div className='flex flex-col justify-center items-center w-full pl-80 pr-80 space-y-5'>
                        <textarea className='bg-zinc-100 px-2 py-2 w-full' onChange={(event) => setComment(event.target.value)}/>
                        <button className='flex flex-row justify-center items-center text-white font-bold bg-blue-500 px-2 py-2 rounded-md w-full' onClick={() => submitComment()}>
                            Submit Comment
                        </button>
                    </div>
                </div>  
            )}
        </div>
    )
}

export default Comment