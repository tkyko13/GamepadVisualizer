class ViewStick {
  constructor(x, y, sz) {
    this.x = x;
    this.y = y;
    this.sz = sz;
    this.stickVec = { x: 0, y: 0 }; // -1~1
    this.stickVecHistory = [];
    this.historyLength = 6;
  }

  update(stickVec) {
    if (this.stickVec.x != stickVec.x || this.stickVec.y != stickVec.y) {
      this.stickVecHistory.unshift(stickVec);
      if (this.stickVecHistory.length > this.historyLength) {
        this.stickVecHistory.pop();
      }
    }

    this.stickVec = stickVec;
  }

  draw() {
    let d = this.sz / 3;
    const pt = this.getPt(this.stickVec, d);

    push();
    translate(this.x, this.y);
    noStroke();
    stroke(0);
    fill(255);
    rect(-this.sz / 2, -this.sz / 2, this.sz, this.sz);

    fill(150);
    ellipse(pt.x, pt.y, this.sz / 3);

    this.stickVecHistory.forEach((e, i, a) => {
      if (i == 0) return;
      const pt = this.getPt(e, d);
      const ppt = this.getPt(a[i - 1], d);
      strokeWeight(3 - i / this.historyLength * 3);
      // stroke(230, 100, 100);
      line(pt.x, pt.y, ppt.x, ppt.y);
    });

    pop();
  }

  getPt(vec, d) {
    const retVec = { x: vec.x * d, y: vec.y * d };
    const isDiagonal = (vec.x != 0 && vec.y != 0);
    if (isDiagonal) {
      retVec.x = retVec.x / 1.2;
      retVec.y = retVec.y / 1.2;
    }
    return retVec;
  }
}
