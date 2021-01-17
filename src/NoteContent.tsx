// @refresh reset

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { createEditor, Node } from "slate";
import { Editable, Slate, withReact } from "slate-react";

import "./NoteContent.css";

export interface INote {
  id: number;
  content: string;
  position: number;
  notes: INote[];
  note?: number;
}

export interface INoteContentProps extends INote {
  drop: (src: number, dst: number) => void;
}

const defaultColor = "purple-600";
const dropColor = "blue-600";

const NoteContent = (props: INoteContentProps) => {
  const navigate = useNavigate();

  const [color, setColor] = useState(defaultColor);
  const [count, setCount] = useState(0); // workaround for unstable drag events

  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Node[]>([
    {
      type: "paragraph",
      children: [{ text: props.content }],
    },
  ]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("id", String(props.id));
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    setCount(count + 1);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    setCount(count - 1);
  };

  useEffect(() => {
    if (count > 0) {
      setColor(dropColor);
    } else {
      setColor(defaultColor);
    }
  }, [count]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // don't trigger event on parent

    setCount(0);

    const id = +e.dataTransfer.getData("id"); // get id of src

    props.drop(id, props.id);
  };

  const handleClick = () => {
    navigate(`/notes/${props.id}`);
  };

  const patchNote = async () => {
    const serialize = (nodes: Node[]) => {
      return nodes.map((n) => Node.string(n)).join("\n");
    };

    const content = serialize(value);

    const url = `http://localhost:8000/notes/${props.id}/`;

    const token = process.env.REACT_APP_TOKEN;

    const method = "PATCH";

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);

    const body = JSON.stringify({
      content,
    });

    await fetch(url, { method, headers, body });
  };

  useEffect(() => {
    patchNote();
  }, [value]);

  return (
    <div
      id={String(props.id)}
      className={`flex flex-shrink-0 bg-${color} text-white text-base font-semibold py-1 pl-3 pr-2 md:py-4 md:pl-5 md:pr-4 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200`}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      >
        <Editable className="flex-1 float-left" />
      </Slate>

      {props.notes.length ? (
        <button
          className="w-5 float-right hover:blue-300"
          onClick={handleClick}
        >
          <svg
            id="enter"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
};

export default NoteContent;
