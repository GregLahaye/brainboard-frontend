/* credit to: https://itnext.io/animating-list-reordering-with-react-hooks-aca5e7eeafba */

import React, {
  useState,
  useLayoutEffect,
  useEffect,
  MutableRefObject,
} from "react";
import usePrevious from "./hooks/usePrevious";

export interface ForwardRefElement {
  key: string;
  ref: MutableRefObject<HTMLElement>;
}

interface IBoundingRectMap {
  [key: string]: DOMRect;
}

/* create a dict of keys mapping to their element's bounding rect */
const calculateBoundingRects = (children: ForwardRefElement[]) => {
  const boundingRects: IBoundingRectMap = {};

  React.Children.forEach(children, (child) => {
    const element = child.ref.current;

    if (element) {
      const rect = element.getBoundingClientRect();
      boundingRects[child.key] = rect;
    }
  });

  return boundingRects;
};

const AnimateBoxes = ({ children }: { children: ForwardRefElement[] }) => {
  const [boundingRects, setBoundingRects] = useState<IBoundingRectMap>({});
  const [prevBoundingRects, setPrevBoundingRects] = useState<IBoundingRectMap>(
    {}
  );
  const prevChildren = usePrevious<ForwardRefElement[]>(children);

  useLayoutEffect(() => {
    // update the current bounding rects
    const newBoundingRects = calculateBoundingRects(children);
    setBoundingRects(newBoundingRects);
  }, [children]);

  useLayoutEffect(() => {
    // update the previous bounding rects
    const prevBoundingRects = calculateBoundingRects(prevChildren);
    setPrevBoundingRects(prevBoundingRects);
  }, [prevChildren]);

  useEffect(() => {
    const hasPrevBoundingRects = Object.keys(prevBoundingRects).length;

    if (hasPrevBoundingRects) {
      React.Children.forEach(children, (child) => {
        const element = child.ref.current;
        const prevRect = prevBoundingRects[child.key];
        const currentRect = boundingRects[child.key];
        const changeInX = prevRect.left - currentRect.left;
        const changeInY = prevRect.top - currentRect.top;

        const distance = Math.sqrt(
          Math.pow(prevRect.left - currentRect.left, 2) +
            Math.pow(prevRect.top - currentRect.top, 2)
        );

        if (changeInX || changeInY) {
          requestAnimationFrame(() => {
            // move child to previous position before DOM paints
            element.style.transform = `translateX(${changeInX}px) translateY(${changeInY}px)`;
            element.style.transition = "transform 0s";

            requestAnimationFrame(() => {
              // remove transformation to let transition play
              element.style.transform = "";
              element.style.transition = `transform ${distance + 250}ms`;
            });
          });
        }
      });
    }
  }, [boundingRects, prevBoundingRects, children]);

  return <>{children.map((child) => child)}</>;
};

export default AnimateBoxes;
