class Ps4Pad extends Layout {
  createStick() {
    let cx, cy;
    cx = width / 4 - 10;
    cy = height * 2 / 3;
    return new ViewStick(cx, cy, 40);
  }
  createButtons() {
    let cx = width * 3 / 4, cy = height * 2 / 3;
    const sz = 20;
    const btns = [];
    btns[9] = new ViewButton(cx, cy + 15, sz, sz, 'ellipse', '☓', '#00bfff');
    btns[10] = new ViewButton(cx, cy - 15, sz, sz, 'ellipse', '△', '#00fa9a');
    btns[14] = new ViewButton(cx - 15, cy, sz, sz, 'ellipse', '□', '#ee82ee');
    btns[13] = new ViewButton(cx + 15, cy, sz, sz, 'ellipse', '◯', '#ffb4b4');
    cx = width * 3 / 4 + sz * 1.5 / 2;
    cy = height / 3;
    btns[11] = new ViewButton(cx, cy, sz * 1.5, sz / 1.5, 'rect', 'R1', '#aaaaaa');
    btns[15] = new ViewButton(cx, cy - 20, sz * 1.5, sz / 1.5, 'rect', 'R2', '#aaaaaa');
    cx = cx = width * 1 / 4 - sz * 1.5 / 2;
    btns[12] = new ViewButton(cx, cy, sz * 1.5, sz / 1.5, 'rect', 'L1', '#aaaaaa');
    btns[16] = new ViewButton(cx, cy - 20, sz * 1.5, sz / 1.5, 'rect', 'L2', '#aaaaaa');

    return btns;
  }
}