import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Room, RoomKeys } from '../types';
import { roomDefaultValues } from '../constants';

const initialValue = {...roomDefaultValues};

const subscribers = new Set<(value: Room) => void>();

const useRoomValue = () => {
  const stateRef = useRef(initialValue);

  const setState = (newRoom: Partial<Room>) => {
    stateRef.current = { ...stateRef.current, ...newRoom };
    subscribers.forEach((listener) => {
      listener(stateRef.current);
    });
  };

  const getState = () => stateRef.current;

  const subscribe = (listener: (value: Room) => void) => {
    subscribers.add(listener);
    return () => subscribers.delete(listener);
  };

  return { getState, setState, subscribe };
};

type RoomValue = ReturnType<typeof useRoomValue>;

const RoomContext = createContext<RoomValue | null>(null);

interface RoomProviderProps {
  children: ReactNode;
}

export function RoomProvider(props: RoomProviderProps) {
  const value = useRoomValue();
  return (
    <RoomContext.Provider value={value}>
      {props.children}
    </RoomContext.Provider>
  );
}

export const useRoomStore = <T,>(
  selector: (state: Room) => T
): [T, (newValue: Partial<Room>) => void] => {
  const context = useContext(RoomContext)!;
  const [localState, setLocalState] = useState(() =>
    selector(context.getState())
  );

  useEffect(() => {
    context.subscribe((value) => setLocalState(selector(value)));
  }, []);

  return [localState, context.setState];
};