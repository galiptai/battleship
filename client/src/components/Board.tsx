import { Ship } from "../logic/Ship";
import { Tile, DrawTile } from "./Tile";

export type Board = {
  height: number;
  width: number;
  ships: Ship[];
  tiles: Tile[][];
};

export type Coordinate = {
  y: number;
  x: number;
};
type drawBoardProps = {
  board: Board;
  setBoard: (board: Board) => void;
};

export function DrawBoard({ board, setBoard }: drawBoardProps) {
  function registerHit(y: number, x: number) {
    const newTile: Tile = { ...board.tiles[y][x] };
    newTile.hit = true;
    board.tiles[y][x] = newTile;
    setBoard({ ...board });
  }

  return (
    <div
      className="board"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${board.width}, 1fr)`,
        height: "100%",
        aspectRatio: "1 / 1",
      }}
    >
      {board.tiles.map((row, i) => (
        <Row key={i} row={row} onClick={registerHit} />
      ))}
    </div>
  );
}

type RowProps = {
  row: Tile[];
  onClick: (y: number, x: number) => void;
};

function Row({ row, onClick }: RowProps) {
  return (
    <>
      {row.map((tile) => (
        <DrawTile key={`${tile.y}:${tile.x}`} tile={tile} onClick={onClick} />
      ))}
    </>
  );
}
