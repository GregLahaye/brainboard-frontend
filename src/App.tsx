import React, { createRef, useEffect, useState } from "react";
import AnimateBoxes, { ForwardRefElement } from "./AnimateBoxes";
import "./App.css";
import Box from "./Box";
import { Quadrant } from "./math";

const App = () => {
  const [boxes, setBoxes] = useState<string[]>([]);

  const fetchBoxes = () => {
    const numBoxes = 14;

    const array: string[] = [];

    for (let i = 0; i < numBoxes; i++) {
      array.push(String(i));
    }

    setBoxes(array);
  };

  const reorder = (src: string, dst: string, quadrant: Quadrant) => {
    const srcIndex = boxes.indexOf(src); // find index of src box
    const dstIndex = boxes.indexOf(dst); // find index of dst box

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

  useEffect(() => {
    fetchBoxes();
  }, []);

  const elements: ForwardRefElement[] = boxes.map(
    (id) =>
      (<Box key={id} id={id} ref={createRef()} reorder={reorder}></Box>) as any
  );

  return (
    <div className="grid grid-flow-row grid-cols-3 grid-rows-5">
      <AnimateBoxes>{elements}</AnimateBoxes>
    </div>
  );
};

export default App;
