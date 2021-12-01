import React from 'react'
import { ACTIONS } from '../App'

const OperationButton = ({ dispatch, operation, className}) => {
    return (
        <button className={className} onClick={() => dispatch({ type: ACTIONS.OPERATION , payload: operation})}>
            {operation}
        </button>
    )
}

export default OperationButton
