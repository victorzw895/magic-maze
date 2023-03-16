import Tile from './Tile';
import './Board.scss';
import { useTilesDocState } from '../Contexts/FirestoreContext';

const Tiles = () => {
  const tiles = useTilesDocState();
  
  return (
    <>
      {tiles && tiles.length > 0 && tiles.map((newTile, tileIndex) => {
        return (
          <Tile 
            key={tileIndex} 
            tileIndex={tileIndex} 
            tileData={newTile} 
          />
        )
      })}
    </>
  );
};

// Tiles.whyDidYouRender = true

export default Tiles;