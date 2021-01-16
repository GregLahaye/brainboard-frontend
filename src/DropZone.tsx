import { useState } from "react";
import { Quadrant, Point, Rectangle } from "./math";

export interface IDropZoneProps {
  id: string;
  reorder: (start: string, end: string, quadrant: Quadrant) => void;
}

interface IDropZonePropsInternal extends IDropZoneProps {
  children: JSX.Element;
}

const DropZone = (props: IDropZonePropsInternal) => {
  const [quadrant, setQuadrant] = useState<Quadrant>();

  const handleDrop = (e: any) => {
    e.preventDefault();

    const data = e.dataTransfer.getData("id"); // get id of src

    props.reorder(data, props.children.props.id, quadrant!);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();

    const x = e.pageX;
    const y = e.pageY;

    const point = new Point(x, y);

    const rect = e.target.getBoundingClientRect();

    const x1 = rect.x;
    const y1 = rect.y;

    const x2 = rect.x + rect.width;
    const y2 = rect.y + rect.height;

    const box = new Rectangle(new Point(x1, y1), new Point(x2, y2));

    const quadrant = box.quadrant(point);

    setQuadrant(quadrant);
  };

  return (
    <div
      className="p-5 dropzone"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {props.children}
    </div>
  );
};

export default DropZone;
