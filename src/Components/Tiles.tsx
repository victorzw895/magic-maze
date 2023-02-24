// import Tile from './Tile';
// import { DBTile } from '../types';
// import './Board.scss';
// import { useTilesDocState, useFirestore } from '../Contexts/FirestoreContext';

// const Tiles = () => {
//   // const tiles: DBTile[] = useTilesDocState();

//   // TODO if tile object value changes, should consider not using tiles.length as dependency
//   // otherwise wont trigger re-render
//   const [tiles] = useFirestore(({tiles}) => tiles, ({tiles}) => [tiles.length])

//   console.log('re render tiles')
  
//   return (
//     <>
//       {tiles && tiles.length > 0 && tiles.map((newTile, tileIndex) => {
//         return (
//           <Tile 
//             key={tileIndex} 
//             tileIndex={tileIndex} 
//             tileData={newTile} 
//           />
//         )
//       })}
//     </>
//   );
// };

// // Tiles.whyDidYouRender = true

// export default Tiles;

import Tile from './Tile';
import { DBTile } from '../types';
import './Board.scss';
import { useTilesDocState } from '../Contexts/FirestoreContext';

const Tiles = () => {
  const tiles: DBTile[] = useTilesDocState();
  
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