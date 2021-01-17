// @refresh reset

import React, { useState, useEffect, useMemo } from "react";
import { createEditor, Node } from "slate";
import { Editable, Slate, withReact } from "slate-react";

import "./BoxContent.css";

export interface IBox {
  id: string;
  content: string;
  boxes: boolean;
}

export interface IBoxContentProps extends IBox {
  drop: (src: string, dst: string) => void;
}

const defaultColor = "purple-600";
const dropColor = "blue-600";

const BoxContent = (props: IBoxContentProps) => {
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
    e.dataTransfer.setData("id", props.id);
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

    const id = e.dataTransfer.getData("id"); // get id of src

    props.drop(id, props.id);
  };

  const handleClick = () => {
    // navigate to note
  };

  return (
    <div
      id={props.id}
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

      {props.boxes ? (
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

export default BoxContent;
