import { useGamePausedDocState, useTilesDocState } from '../Contexts/FirestoreContext';
import Tile from './Tile';
import { memo } from 'react';
import Space from './Space';
import { direction, HeroPawn, DBTile, DBHeroPawn, DBPlayer, TeleporterSpace, ExplorationSpace, WeaponSpace, ExitSpace, TimerSpace } from '../types';
import { tileWallSize, spaceSize } from '../constants';
import { usePawn, usePawnDispatch } from '../Contexts/PawnContext';
import { usePlayerState, usePlayerDispatch } from '../Contexts/PlayerContext';
import isEqual from 'lodash/isEqual';
import { 
  usePlayerDocState,
  useGreenDocState,
  useYellowDocState,
  useOrangeDocState,
  usePurpleDocState,
  usePlayerHeldPawnDocState 
} from '../Contexts/FirestoreContext';

const Test = () => {
  // const { player } = usePlayerDocState();
  
  const pawnState = usePawn(); // 2x extra re render
  
  const playerHeldPawn = usePlayerHeldPawnDocState()
  console.log('Test re render (((((', {pawnState, playerHeldPawn})
  // console.log('$$$ re rendering tile', {tileIndex, tileData, pawnState, playerHeldPawn, player})

  console.log('Test component re render')
  return (
    <>
      Test
    </>
  );
}

export default Test;