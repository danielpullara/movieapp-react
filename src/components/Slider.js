import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css'

export default function Slider(props) {
    let [value, setValue] = useState({min:0, max:10})
    let onChange = (value) => {
        console.log(value)
        setValue(value)
        props.onFilterRating(value)
    }
    return (
        <div className=" w-50 text-center">
            <InputRange classname="w-100 "
                maxValue={10}
                minValue={0}
                value={value}
                onChange={(value) => onChange(value)} />
                <span>Rating</span>
        </div>
    )
}
