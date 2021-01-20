// @refresh reset

import React, { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate } from "react-router";
import { createEditor, Node } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { Network } from "./network/network";

import "./NoteContent.css";
import { UserContext } from "./user/UserContext";

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

  const { state } = useContext(UserContext);

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

  useEffect(() => {
    const patchNote = async () => {
      const serialize = (nodes: Node[]) => {
        return nodes.map((n) => Node.string(n)).join("\n");
      };

      const content = serialize(value);

      const body = {
        content,
      };

      await Network.patch(`notes/${props.id}`, body, state.token);
    };

    patchNote();
  }, [value, props.id, state.token]);

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

      <button className="w-5 float-right hover:blue-300" onClick={handleClick}>
        {props.notes.length ? (
          <svg
            id="enter"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
            />
          </svg>
        ) : (
          <svg
            id="add"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default NoteContent;
