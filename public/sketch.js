let gamepad = new Gamepad();
let btns = null;

function setup() {
  createCanvas(250, 100);
  frameRate(60);

  window.addEventListener("gamepadconnected", (e) => {
    gamepad.connect(e.gamepad.index);
    console.log(
      'Gamepad connected at index %d: %s. %d buttons, %d axes.',
      e.gamepad.index,
      e.gamepad.id,
      e.gamepad.buttons.length,
      e.gamepad.axes.length
    );
  });
  window.addEventListener("gamepaddisconnected", (e) => {
    gamepad.disconnect();
    console.log('Gamepad disconnected');
  });
}

function draw() {
  background(230);

  gamepad.update();
  if (gamepad.info) {
    if (btns == null) {
      createBtns();
    }

    btns.forEach((vb, i) => {
      vb.update(gamepad.pushes[i]);
      vb.frameNum = -1;
    });
    gamepad.history.forEach(hi => {
      hi.pushesIndex.forEach(pi => {
        if (btns[pi].frameNum == -1) {
          btns[pi].frameNum = hi.passFrame;
        }
      });
    });

    const sz = 35;
    const cx = width / 4 - 8, cy = height / 2;
    noStroke();
    fill(255);
    rect(cx - sz, cy - sz, sz * 2, sz * 2);
    btns.forEach(e => {
      e.draw();
    });
  }

  // text('fps: ' + String(getFrameRate()).slice(0, 6), 5, 15);
}

function createBtns() {
  btns = [];
  const d = 25;
  const sz = 30;
  let cx = width / 4 - 8, cy = height / 2;
  // stick
  for (let i = 0; i < 8; i++) {
    const x = cx + cos(radians(i / 8.0 * 360 - 90)) * d * 1.1;
    const y = cy + sin(radians(i / 8.0 * 360 - 90)) * d * 1.1;
    const vb = new ViewButton(x, y, sz);
    vb.drawFrame = false;
    btns.push(vb);
  }
  const vb = new ViewButton(cx, cy, sz);
  vb.drawFrame = false;
  btns.push(vb);
  // buttons
  cx = width / 2;
  cy = height / 2;
  for (let i = 0; i < gamepad.info.buttons.length; i++) {
    const x = cx + (i % 4) * sz;
    const y = cy + int(i / 4) * sz - 15;
    const vb = new ViewButton(x, y, sz);
    // vb.drawFrame = false;
    btns.push(vb);
  }
}