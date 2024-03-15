import { ACTIONS } from './App';

interface Props {
  digit: string;
  dispatch: React.Dispatch<{ type: string; payload?: { digit?: string } }>;
}

export default function DigitButton({ digit, dispatch }: Props) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}>
      {digit}
    </button>
  );
}
