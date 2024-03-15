import { useReducer } from 'react';
import './styles.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  CHOOSE_OPERATION: 'choose-operation',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
};

interface State {
  currentOperand?: string;
  previousOperand?: string;
  operation?: string;
  overwrite?: boolean;
}

interface Action {
  type: string;
  payload?: {
    digit?: string;
    operation?: string;
  };
}

function reducer(state: State, action: Action): State {
  const { type, payload } = action;

  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload?.digit === '.' ? '0.' : payload?.digit,
          overwrite: false,
        };
      }

      if (payload?.digit === '0' && state.currentOperand === '0') {
        return state;
      }
      if (
        (payload?.digit === '.' && state.currentOperand === undefined) ||
        (payload?.digit === '.' && state.currentOperand?.includes('.'))
      ) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload?.digit}`,
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.CHOOSE_OPERATION:
      if (
        state.currentOperand === undefined &&
        state.previousOperand === undefined
      ) {
        return state;
      }

      if (state.currentOperand === undefined) {
        return {
          ...state,
          operation: payload?.operation,
        };
      }

      if (state.previousOperand === undefined) {
        return {
          ...state,
          operation: payload?.operation,
          previousOperand: state.currentOperand,
          currentOperand: undefined,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload?.operation,
        currentOperand: undefined,
      };

    case ACTIONS.EVALUATE:
      if (
        state.operation === undefined ||
        state.currentOperand === undefined ||
        state.previousOperand === undefined
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: undefined,
        operation: undefined,
        currentOperand: evaluate(state),
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: undefined,
        };
      }

      if (state.currentOperand === undefined) return state;

      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: undefined,
        };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    default:
      return state;
  }
}

function evaluate({
  currentOperand,
  previousOperand,
  operation,
}: State): string {
  const prev = parseFloat(previousOperand || '');
  const current = parseFloat(currentOperand || '');
  if (isNaN(prev) || isNaN(current)) {
    return '';
  }
  let computation = '';
  switch (operation) {
    case '+':
      computation = (prev + current).toString();
      break;
    case '-':
      computation = (prev - current).toString();
      break;
    case '*':
      computation = (prev * current).toString();
      break;
    case '/':
      computation = (prev / current).toString();
      break;
    default:
      computation = '';
      break;
  }

  return computation;
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
});

function formatOperand(operand?: string): string | undefined {
  if (operand === undefined) return;
  const [integer, decimal] = operand.split('.');
  if (decimal === undefined) return INTEGER_FORMATTER.format(parseInt(integer));
  return `${INTEGER_FORMATTER.format(parseInt(integer))}.${decimal}`;
}

export default function App(): JSX.Element {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}>
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation={'/'} dispatch={dispatch} />
      <DigitButton digit={'1'} dispatch={dispatch} />
      <DigitButton digit={'2'} dispatch={dispatch} />
      <DigitButton digit={'3'} dispatch={dispatch} />
      <OperationButton operation={'*'} dispatch={dispatch} />
      <DigitButton digit={'4'} dispatch={dispatch} />
      <DigitButton digit={'5'} dispatch={dispatch} />
      <DigitButton digit={'6'} dispatch={dispatch} />
      <OperationButton operation={'+'} dispatch={dispatch} />
      <DigitButton digit={'7'} dispatch={dispatch} />
      <DigitButton digit={'8'} dispatch={dispatch} />
      <DigitButton digit={'9'} dispatch={dispatch} />
      <OperationButton operation={'-'} dispatch={dispatch} />
      <DigitButton digit={'.'} dispatch={dispatch} />
      <DigitButton digit={'0'} dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>
        =
      </button>
    </div>
  );
}
