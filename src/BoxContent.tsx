// @refresh reset

import React, { useState, useEffect, useMemo } from "react";
import { createEditor, Node } from "slate";
import { Editable, Slate, withReact } from "slate-react";

interface IBoxContentProps {
  id: string;
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
      children: [{ text: "A line of text in a paragraph." }],
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

    const id = e.dataTransfer.getData("id"); // get id of srrc
    console.log(id + " was dropped inside " + props.id);
  };

  return (
    <div
      id={props.id}
      className={`flex-shrink-0 bg-${color} text-white text-base font-semibold py-4 px-5 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200`}
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
        <Editable />
      </Slate>
    </div>
  );
};

export default BoxContent;
