import React, { useState, useEffect, useMemo } from "react";
import { createEditor, Node } from "slate";
import { Editable, Slate, withReact } from "slate-react";

const activeColor = "blue-300";
const inactiveColor = "gray-300";

const BoxContent = (props: any) => {
  const [color, setColor] = useState(inactiveColor);
  const [count, setCount] = useState(0); // workaround for unstable drag events

  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Node[]>([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const id = (e.target as HTMLDivElement).id;
    e.dataTransfer.setData("id", id);
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
      setColor(activeColor);
    } else {
      setColor(inactiveColor);
    }
  }, [count]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // don't trigger event on parent

    setCount(0);

    const data = e.dataTransfer.getData("id"); // get id of srrc
    console.log(data + " was dropped inside " + props.id);
  };

  return (
    <div
      id={props.id}
      className={`bg-${color} p-5`}
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
