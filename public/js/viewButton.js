class ViewButton {
  constructor(x, y, width, height, type = 'ellipse', label = '', colorCode = '#FFB4B4') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.label = label;
    this.drawFrame = true;
    this.isPush = false;
    this.passPushFrame = 0;
    // this.frameNum = -1;
    this.color = color(colorCode);//color(255, 180, 180);
    // this.color = color('#FFB4B4');
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
      this.drawGrapics(this.width, this.height, this.type);
    }

    // 残像
    if (!this.isPush) {
      if (this.passPushFrame > 0 && this.passPushFrame < 60) {
        const rf = this.passPushFrame / 60;
        // fill(255, rf * 255, rf * 255);
        fill(this.color);
        noStroke();
        // ellipse(0, 0, this.width - rf * this.width, this.height - rf * this.height);
        this.drawGrapics(this.width - rf * this.width, this.height - rf * this.height, this.type);
      }
    }

    // label
    if (this.label) {
      textAlign(CENTER, CENTER);
      textSize(18);
      fill(0);
      noStroke();
      text(this.label, 0, 0);
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

  drawGrapics(width, height, type) {
    switch (type) {
      case 'ellipse':
        ellipse(0, 0, width, height);
        break;
      case 'rect':
        rect(-width / 2, -height / 2, width, height);
        break;
    }
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