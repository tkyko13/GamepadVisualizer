class ViewButton {
  constructor(x, y, sz) {
    this.x = x;
    this.y = y;
    this.sz = sz;
    this.drawFrame = true;
    this.isPush = false;
    this.passPushFrame = 0;
    this.frameNum = -1;
    this.color = color(255, 180, 180);
  }

  update(isPush) {
    this.isPush = isPush;
    if (isPush) {
      this.passPushFrame = 0;
    }
    else if (this.passPushFrame < 60) {
      this.passPushFrame++;
    }
  }

  draw() {
    push();
    translate(this.x, this.y);
    if (this.isPush) {
      fill(this.color);
    } else {
      fill(255);
    }
    if (this.drawFrame) {
      stroke(0);
      // noStroke();
      ellipse(0, 0, this.sz);
    }

    // 残像
    if (!this.isPush) {
      if (this.passPushFrame > 0 && this.passPushFrame < 60) {
        const rf = this.passPushFrame / 60;
        // fill(255, rf * 255, rf * 255);
        fill(this.color);
        noStroke();
        ellipse(0, 0, this.sz - rf * this.sz);
      }
    }

    // frame num
    // if (this.frameNum > 0) {
    //   let f = this.frameNum;
    //   if (f > 99) f = 99;
    //   textAlign(CENTER, CENTER);
    //   textSize(18);
    //   fill(0);
    //   noStroke();
    //   text(f, 0, 0);
    // }

    pop();
  }


  //   viewStick(stick) {
  //   const d = 15;
  //   const rectSz = 40;

  //   push();
  //   translate(width / 4 - d, height / 2);
  //   let x = 0;
  //   let y = 0;
  //   if (stick.dir4[3] && !stick.dir4[1]) x = -d;
  //   else if (stick.dir4[1] && !stick.dir4[3]) x = d;
  //   if (stick.dir4[0] && !stick.dir4[2]) y = -d;
  //   else if (stick.dir4[2] && !stick.dir4[0]) y = d;
  //   fill(255);
  //   rect(-rectSz / 2, -rectSz / 2, rectSz, rectSz);
  //   fill(230, 0, 0);
  //   ellipse(x, y, 12, 12);
  //   pop();
  // }
}