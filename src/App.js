import React, { useReducer } from "react";
import "./App.css";
import DigitButton from "./components/DigitButton";
import OperationButton from "./components/OperationButton";

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  OPERATION: 'operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

const evaluate = (previousOperand, currentOperand, operation) => {
  let prev = parseFloat(previousOperand);
  let current = parseFloat(currentOperand);
  let result = '';

  if (isNaN(prev) || isNaN(current)) return result;

  switch (operation) {
    case '+':
      result = prev + current;
      break;
    case '÷':
      result = prev / current;
      break;
    case 'x':
      result = prev * current;
      break;
    case '-':
      result = prev - current;
      break;
  }

  return result.toString();
}

const integerFormater = new Intl.NumberFormat('en-us' , {
  maximumFractionDigits: 0,
})

const formatOperand = (operand) => {
  if(operand == null) return;
  const [integer, decimal] = operand.split('.');
  if(decimal == null) return integerFormater.format(integer);
  return `${integerFormater.format(integer)}.${decimal}`;
}

const reducer = (state, action) => {

  switch (action.type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return{
          ...state,
          currentOperand: action.payload,
          overwrite: false
        }
      }
      if (action.payload === '.' && state.currentOperand === undefined) return state
      if (action.payload === '0' && state.currentOperand === '0') return state
      if (state.currentOperand && action.payload === '.' && state.currentOperand.includes('.')) return { ...state }
      if (state.currentOperand === '0' && action.payload !== '.') return { ...state, currentOperand: parseFloat(action.payload) }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${action.payload}`
      };

    case ACTIONS.OPERATION:

      if (state.currentOperand == null && state.previousOperand == null) return state;
      if (state.currentOperand == null) {// override the operation
        return {
          ...state,
          operation: action.payload
        }
      }
      if (state.previousOperand == null) {
        return {
          previousOperand: state.currentOperand,
          currentOperand: null,
          operation: action.payload
        };
      }
      return {
        currentOperand: null,
        operation: action.payload,
        previousOperand: evaluate(state.previousOperand, state.currentOperand, state.operation),
      }

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.EVALUATE:
      if (state.operation == null || state.previousOperand == null || state.currentOperand == null){
        return state
      }

      return {
        operation: null,
        currentOperand: evaluate(state.previousOperand , state.currentOperand , state.operation),
        previousOperand: null,
        overwrite: true
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.currentOperand == null ) return state
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null}
      }

      return {
        ...state, 
        currentOperand: state.currentOperand.slice(0 , -1)
      };

    default:
      return {};
  }
}

const App = () => {

  const [{ previousOperand, currentOperand, operation }, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator">
      <div className="calculator__container">
        <div className="calculator__output">
          <p>{formatOperand(previousOperand)} {operation}</p>
          <p>{formatOperand(currentOperand)}</p>
        </div>
        <button className="span--btn bg--red" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>Clear</button>
        <button className='text--orange' onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>Del</button>
        <OperationButton operation='÷' dispatch={dispatch} className='bg--violet' />
        <DigitButton digit='1' dispatch={dispatch} />
        <DigitButton digit='2' dispatch={dispatch} />
        <DigitButton digit='3' dispatch={dispatch} />
        <OperationButton operation='x' dispatch={dispatch} className='bg--violet' />
        <DigitButton digit='4' dispatch={dispatch} />
        <DigitButton digit='5' dispatch={dispatch} />
        <DigitButton digit='6' dispatch={dispatch} />
        <OperationButton operation='+' dispatch={dispatch} className='bg--violet' />
        <DigitButton digit='7' dispatch={dispatch} />
        <DigitButton digit='8' dispatch={dispatch} />
        <DigitButton digit='9' dispatch={dispatch} />

        <OperationButton operation='-' dispatch={dispatch} className='bg--violet' />
        <DigitButton digit='.' dispatch={dispatch} />
        <DigitButton digit='0' dispatch={dispatch} />
        <button className="span--btn bg--faint-red" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      </div>
    </div>
  );
};

export default App;
