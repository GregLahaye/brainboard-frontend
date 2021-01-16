export enum Quadrant {
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
}

export class Point {
  public constructor(public x: number, public y: number) {}
}

export class Rectangle {
  private A: Point;
  private B: Point;
  private C: Point;
  private D: Point;

  public constructor(from: Point, to: Point) {
    this.A = from;
    this.B = new Point(to.x, from.y);
    this.C = new Point(from.x, to.y);
    this.D = to;
  }

  public quadrant(P: Point) {
    /*
     *  A --------- B
     *   |         |
     *   |         |
     *   |         |
     *  C --------- D
     */

    const AD = this.slope(this.A, this.D);
    const CB = this.slope(this.C, this.B);

    const AP = this.slope(this.A, P);
    const CP = this.slope(this.C, P);

    const TR = AP < AD; // top right half
    const TL = CP < CB; // top left half

    if (TR && TL) {
      return Quadrant.TOP;
    } else if (TR && !TL) {
      return Quadrant.RIGHT;
    } else if (!TR && TL) {
      return Quadrant.LEFT;
    } else if (!TR && !TL) {
      return Quadrant.BOTTOM;
    }
  }

  private slope(p1: Point, p2: Point) {
    return (p2.y - p1.y) / (p2.x - p1.x);
  }
}
