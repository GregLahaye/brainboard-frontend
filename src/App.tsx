// @refresh reset

import React, { createRef, useEffect, useMemo, useState } from "react";
import { createEditor, Node } from "slate";
import { withReact, Slate, Editable } from "slate-react";
import AnimateBoxes, { ForwardRefElement } from "./AnimateBoxes";
import "./App.css";
import Box from "./Box";
import { IBox } from "./BoxContent";
import { Quadrant } from "./math";

const EMPTY = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const App = () => {
  const [boxes, setBoxes] = useState<IBox[]>([]);

  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Node[]>(EMPTY);

  const fetchBoxes = () => {
    const numBoxes = 14;

    const array: IBox[] = [];

    for (let i = 0; i < numBoxes; i++) {
      array.push({
        id: String(i),
        content: "text",
        boxes: Math.random() > 0.5,
      });
    }

    setBoxes(array);
  };

  const drop = (srcId: string, dstId: string) => {
    const src = boxes.find(({ id }) => id === srcId)!;
    const dst = boxes.find(({ id }) => id === dstId)!;

    const srcIndex = boxes.map(({ id }) => id).indexOf(src.id); // find index of src box
    const dstIndex = boxes.map(({ id }) => id).indexOf(dst.id); // find index of dst box

    if (srcIndex !== dstIndex) {
      const array = [...boxes]; // create a copy of the boxes

      array.splice(srcIndex, 1); // remove the src box

      setBoxes(array);

      console.log(srcId + " was dropped inside " + dstId);
    }
  };

  const reorder = (srcId: string, dstId: string, quadrant: Quadrant) => {
    const src = boxes.find(({ id }) => id === srcId)!;
    const dst = boxes.find(({ id }) => id === dstId)!;

    const srcIndex = boxes.map(({ id }) => id).indexOf(src.id); // find index of src box
    const dstIndex = boxes.map(({ id }) => id).indexOf(dst.id); // find index of dst box

    // before before dst if top or left of box, otherwise after
    const moveBefore = quadrant === Quadrant.LEFT || quadrant === Quadrant.TOP;

    // same dst if moving to before next box
    const sameDst = moveBefore && srcIndex + 1 === dstIndex && false;

    // ignore if same index or same dst
    if (srcIndex !== dstIndex && !sameDst) {
      const array = [...boxes]; // create a copy of the boxes

      if (moveBefore) {
        array.splice(dstIndex, 0, src); // insert src before dst
      } else {
        array.splice(dstIndex + 1, 0, src); // insert src after dst
      }

      if (srcIndex > dstIndex) {
        array.splice(srcIndex + 1, 1); // remove the src box
      } else {
        array.splice(srcIndex, 1); // remove the src box
      }

      console.log(
        `${src} was dropped ${moveBefore ? "before" : "after"} ${dst}`
      );

      setBoxes(array); // update boxes
    }
  };

  const handleEditorBlur = () => {
    const serialize = (nodes: Node[]) => {
      return nodes.map((n) => Node.string(n)).join("\n");
    };

    const content = serialize(value);

    if (content) {
      setBoxes([
        ...boxes,
        { id: String(Math.random()), content, boxes: false },
      ]);
      setValue(EMPTY);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.currentTarget.blur();
    }
  };

  useEffect(() => {
    fetchBoxes();
  }, []);

  const elements: ForwardRefElement[] = boxes.map(
    (box) =>
      (
        <Box
          key={box.id}
          {...box}
          ref={createRef()}
          drop={drop}
          reorder={reorder}
        ></Box>
      ) as any
  );

  return (
    <div>
      <div className={"flex p-5"}>
        <div className="m-auto w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
          <Slate
            editor={editor}
            value={value}
            onChange={(newValue) => setValue(newValue)}
          >
            <Editable
              className="px-3 py-2 text-base font-semibold ring-2 ring-blue-500 focus:ring-offset-1 focus:ring-offset-blue-300 rounded-sm"
              placeholder="Take a note..."
              onBlur={handleEditorBlur}
              onKeyDown={handleKeyDown}
            />
          </Slate>
        </div>
      </div>

      <div className="grid grid-flow-row grid-cols-3 grid-rows-5">
        <AnimateBoxes>{elements}</AnimateBoxes>
      </div>
    </div>
  );
};

export default App;
