import React, { forwardRef } from "react";
import NoteContent from "./NoteContent";
import DropZone, { IDropZoneProps } from "./DropZone";

const Note = forwardRef<HTMLDivElement, IDropZoneProps>(
  (props: IDropZoneProps, ref) => (
    <div ref={ref}>
      <DropZone key={props.id} {...props} reorder={props.reorder}>
        <NoteContent {...props} />
      </DropZone>
    </div>
  )
);

export default Note;
