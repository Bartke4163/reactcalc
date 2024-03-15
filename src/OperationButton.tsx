import { ACTIONS } from './App';

interface Props {
  operation: string;
  dispatch: React.Dispatch<{ type: string; payload?: { operation?: string } }>;
}

export default function OperationButton({ operation, dispatch }: Props) {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })
      }>
      {operation}
    </button>
  );
}
