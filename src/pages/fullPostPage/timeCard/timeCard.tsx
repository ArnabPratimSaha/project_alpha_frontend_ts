import React, { FC } from 'react'
import './timeCard.css'
interface TimecardInterface{
    data:string,
    time:string
}
const Timecard:FC<TimecardInterface>=({data,time})=> {
    return (
        <div className='timecard-fulldiv'>
            <div className='timecard-detail'>
                <p>{data}</p>
            </div>
            <div className='timecard-time'>
                <p>{time}</p>
            </div>
        </div>
    )
}

export default Timecard
