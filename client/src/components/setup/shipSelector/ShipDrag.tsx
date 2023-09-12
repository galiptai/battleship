import { useDrag } from "react-dnd";
import { Ship } from "../../../logic/Ship";
import { useEffect } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";
import { usePreview } from "react-dnd-multi-backend";

export type ShipPlacement = {
  ship: Ship;
  vertical: boolean;
};
export type ShipDrop = {
  shipPlacement: ShipPlacement;
  afterDrop: () => void;
};

type ShipDragProps = {
  ship?: Ship;
  vertical: boolean;
  setDragging: (dragging: boolean) => void;
  afterDrop: () => void;
};

export function ShipDrag({ ship, vertical, setDragging, afterDrop }: ShipDragProps) {
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: "ship",
      item: { shipPlacement: { ship: ship, vertical: vertical }, afterDrop: afterDrop },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [ship, vertical]
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: false });
  }, [preview]);

  useEffect(() => {
    setDragging(isDragging);
    return () => setDragging(false);
  }, [setDragging, isDragging]);

  return <div className="ship-drag" ref={ship ? drag : undefined}></div>;
}

export function DraggedShipPreview(): JSX.Element | null {
  const preview = usePreview<ShipDrop>();
  if (!preview.display) {
    return null;
  }
  const { style, item } = preview;
  return (
    <div
      className="ship-sel-opt ship-sel-highlight"
      style={{ ...style, width: "fit-content", zIndex: "101", opacity: "0.7" }}
    >
      {item.shipPlacement.ship.type.name}
    </div>
  );
}
