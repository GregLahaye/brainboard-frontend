// @refresh reset

import React, { createRef, useEffect, useMemo, useState } from "react";
import { createEditor, Node } from "slate";
import { withReact, Slate, Editable, ReactEditor } from "slate-react";
import AnimateNotes, { ForwardRefElement } from "./AnimateNotes";
import Note from "./Note";
import { INote } from "./NoteContent";
import { Quadrant } from "./math";
import { useParams } from "react-router";

interface IBoardProps {
  noteId?: number;
}

const EMPTY = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const Board = (props: IBoardProps) => {
  const params = useParams();
  const { noteId } = params.noteId ? params : props;

  const [notes, setNotes] = useState<INote[]>([]);

  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Node[]>(EMPTY);

  const fetchNotes = async () => {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${process.env.REACT_APP_TOKEN}`);

    const url = `http://localhost:8000/notes/${noteId}/`;
    const response = await fetch(url, { headers });

    const note = await response.json();

    setNotes(note.notes);
  };

  const drop = async (srcId: number, dstId: number) => {
    const src = notes.find(({ id }) => id === srcId)!;
    const dst = notes.find(({ id }) => id === dstId)!;

    const srcIndex = notes.map(({ id }) => id).indexOf(src.id); // find index of src note
    const dstIndex = notes.map(({ id }) => id).indexOf(dst.id); // find index of dst note

    if (srcIndex !== dstIndex) {
      const array = [...notes]; // create a copy of the notes

      array.splice(srcIndex, 1); // remove the src note

      setNotes(array);

      console.log(srcId + " was dropped inside " + dstId);

      const url = `http://localhost:8000/notes/${src.id}/`;

      const token = process.env.REACT_APP_TOKEN;

      const method = "PATCH";

      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", `Bearer ${token}`);

      const body = JSON.stringify({
        note: dst.id,
      });

      await fetch(url, { method, headers, body });

      // TODO: update state
    }
  };

  const reorder = (srcId: number, dstId: number, quadrant: Quadrant) => {
    const src = notes.find(({ id }) => id === srcId)!;
    const dst = notes.find(({ id }) => id === dstId)!;

    const srcIndex = notes.map(({ id }) => id).indexOf(src.id); // find index of src note
    const dstIndex = notes.map(({ id }) => id).indexOf(dst.id); // find index of dst note

    // before before dst if top or left of note, otherwise after
    const moveBefore = quadrant === Quadrant.LEFT || quadrant === Quadrant.TOP;

    // same dst if moving to before next note
    const sameDst = moveBefore && srcIndex + 1 === dstIndex && false;

    // ignore if same index or same dst
    if (srcIndex !== dstIndex && !sameDst) {
      const array = [...notes]; // create a copy of the notes

      if (moveBefore) {
        array.splice(dstIndex, 0, src); // insert src before dst
      } else {
        array.splice(dstIndex + 1, 0, src); // insert src after dst
      }

      if (srcIndex > dstIndex) {
        array.splice(srcIndex + 1, 1); // remove the src note
      } else {
        array.splice(srcIndex, 1); // remove the src note
      }

      console.log(
        `${src} was dropped ${moveBefore ? "before" : "after"} ${dst}`
      );

      setNotes(array); // update notes
    }
  };

  const handleEditorBlur = async () => {
    const serialize = (nodes: Node[]) => {
      return nodes.map((n) => Node.string(n)).join("\n");
    };

    const content = serialize(value);

    if (content) {
      const url = "http://localhost:8000/notes/";

      const token = process.env.REACT_APP_TOKEN;

      const method = "POST";

      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", `Bearer ${token}`);

      const body = JSON.stringify({
        content,
        note: noteId,
      });

      const response = await fetch(url, { method, headers, body });

      const note = await response.json();

      setNotes([...notes, note]);
      setValue(EMPTY);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.currentTarget.blur();
      setTimeout(() => ReactEditor.focus(editor), 100);
    }
  };

  useEffect(() => {
    if (noteId) {
      fetchNotes();
    }
  }, [noteId]);

  const elements: ForwardRefElement[] = notes.map(
    (note) =>
      (
        <Note
          key={note.id}
          {...note}
          ref={createRef()}
          drop={drop}
          reorder={reorder}
        ></Note>
      ) as any
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const id = +e.dataTransfer.getData("id");

    const index = notes.map(({ id }) => id).indexOf(id); // find index of src note

    const array = [...notes];
    array.splice(index, 1); // remove the src note
    setNotes(array);

    const url = `http://localhost:8000/notes/${id}/`;

    const token = process.env.REACT_APP_TOKEN;

    const method = "DELETE";

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);

    await fetch(url, { method, headers });
  };

  return (
    <div>
      <div className={"flex pt-5"}>
        <div className="m-auto w-5/6 sm:w-3/4 md:w-1/2 lg:w-1/3">
          <Slate
            editor={editor}
            value={value}
            onChange={(newValue) => setValue(newValue)}
          >
            <Editable
              autoFocus={true}
              className="px-3 py-2 text-base font-semibold ring-2 ring-blue-500 focus:ring-offset-1 focus:ring-offset-blue-300 rounded-sm"
              placeholder="Take a note..."
              onBlur={handleEditorBlur}
              onKeyDown={handleKeyDown}
            />
          </Slate>
        </div>
      </div>

      <div className="grid grid-flow-row grid-cols-3 grid-rows-5">
        <AnimateNotes>{elements}</AnimateNotes>
        <div className="p-5">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="bg-red-500 w-full h-full rounded-lg"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Board;
