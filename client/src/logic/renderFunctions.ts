export type Dimensions = {
  height: number;
  width: number;
};

export function convertCoordinateToLetter(coordinate: number): string {
  if (coordinate < 0 || coordinate > 25) {
    throw new Error("Coordinate can't be converted to letter");
  }
  const ASCIIShift = 65;
  return String.fromCharCode(coordinate + ASCIIShift);
}

export function createLetterArray(width: number): string[] {
  if (width > 26) {
    throw new Error("Max board width exceeded");
  }
  const letters: string[] = [];
  for (let i = 0; i < width; i++) {
    letters.push(convertCoordinateToLetter(i));
  }
  letters.unshift("");
  return letters;
}

export function calculateBoardDimensions(
  containerSize: Dimensions,
  height: number,
  width: number
): Dimensions {
  const requiredTileSizeHeight = containerSize.height / height;
  const requiredTileSizeWidth = containerSize.width / width;
  const tileSize = Math.floor(Math.min(requiredTileSizeHeight, requiredTileSizeWidth));
  console.log(tileSize);
  return {
    height: tileSize * height,
    width: tileSize * width,
  };
}
