class Arcade extends Layout {
  createStick() {
    let cx, cy;
    cx = width / 4 - 10;
    cy = height / 2;
    return new ViewStick(cx, cy, 70);
  }
  createButtons() {
    const btns = [];
    let sz = 35;
    let cx = width / 2 - 10;
    let cy = height / 2;

    // stick button
    // for (let i = 0; i < 8; i++) {
    //   const x = cx + cos(radians(i / 8.0 * 360 - 90)) * d * 1.1;
    //   const y = cy + sin(radians(i / 8.0 * 360 - 90)) * d * 1.1;
    //   const vb = new ViewButton(x, y, sz);
    //   // vb.drawFrame = false;
    //   btns.push(vb);
    // }
    // const vb = new ViewButton(cx, cy, sz);
    // // vb.drawFrame = false;
    // btns.push(vb);

    // buttons
    // sz = 35;
    // cx = width / 2 - 10;
    // cy = height / 2;
    for (let i = 0; i < 8; i++) {
      const x = cx + (i % 4) * sz;
      const y = cy + int(i / 4) * sz - 15;
      const vb = new ViewButton(x, y, sz, sz);
      if (i % 4 == 0) vb.color = color(180, 180, 255);
      else if (i % 4 == 1) vb.color = color(250, 250, 80);
      else if (i % 4 == 2) vb.color = color(255, 180, 180);
      else if (i % 4 == 3) vb.color = color(180, 255, 180);
      // vb.drawFrame = false;
      // btns.push(vb);
      btns[i + 9] = vb;
    }
    return btns;
  }
}