import React, { forwardRef } from "react";
import BoxContent from "./BoxContent";
import DropZone, { IDropZoneProps } from "./DropZone";

const Box = forwardRef<HTMLDivElement, IDropZoneProps>(
  (props: IDropZoneProps, ref) => (
    <div ref={ref}>
      <DropZone id={props.id} key={props.id} reorder={props.reorder}>
        <BoxContent id={props.id} />
      </DropZone>
    </div>
  )
);

export default Box;
