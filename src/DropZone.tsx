import { useState } from "react";
import { INoteContentProps } from "./NoteContent";
import { Quadrant, Point, Rectangle } from "./math";

export interface IDropZoneProps extends INoteContentProps {
  reorder: (start: number, end: number, quadrant: Quadrant) => void;
}

interface IDropZonePropsInternal extends IDropZoneProps {
  children: JSX.Element;
}

const DropZone = (props: IDropZonePropsInternal) => {
  const [quadrant, setQuadrant] = useState<Quadrant>();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const id = +e.dataTransfer.getData("id"); // get id of src

    props.reorder(id, props.children.props.id, quadrant!);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();

    const x = e.pageX;
    const y = e.pageY;

    const point = new Point(x, y);

    const rect = e.currentTarget.getBoundingClientRect();

    const x1 = rect.x;
    const y1 = rect.y;

    const x2 = rect.x + rect.width;
    const y2 = rect.y + rect.height;

    const note = new Rectangle(new Point(x1, y1), new Point(x2, y2));

    const quadrant = note.quadrant(point);

    setQuadrant(quadrant);
  };

  return (
    <div className="p-5" onDragOver={handleDragOver} onDrop={handleDrop}>
      {props.children}
    </div>
  );
};

export default DropZone;
