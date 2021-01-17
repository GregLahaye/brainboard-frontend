import React, { forwardRef } from "react";
import BoxContent from "./BoxContent";
import DropZone, { IDropZoneProps } from "./DropZone";

const Box = forwardRef<HTMLDivElement, IDropZoneProps>(
  (props: IDropZoneProps, ref) => (
    <div ref={ref}>
      <DropZone key={props.id} {...props} reorder={props.reorder}>
        <BoxContent {...props} />
      </DropZone>
    </div>
  )
);

export default Box;
