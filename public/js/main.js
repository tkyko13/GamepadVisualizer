let gamepad = new Gamepad();
let stick = null;
let btns = null;
let layoutType = 'arcade';
let layout;

function setup() {

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const paramWidth = params.get('width');
  const paramHeight = params.get('height');
  if (paramWidth > 0 && paramHeight > 0) {
    console.log('width:' + paramWidth + ' height:' + paramHeight);
    createCanvas(paramWidth, paramHeight);
  }
  else {
    createCanvas(250, 100);
  }

  layoutType = params.get('layout') ? params.get('layout') : 'arcade';
  switch (layoutType) {
    case 'arcade':
      gamepad.type = 'xbox';
      layout = new Arcade();
      break;
    case 'pad':
      gamepad.type = 'ps';
      layout = new Ps4Pad();
      break;
    default:
      gamepad.type = 'xbox';
      layout = new Arcade();
      break;
  }

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
    if (stick == null) {
      stick = layout.createStick();
    }
    stick.update(gamepad.info.stick.vec);
    stick.draw();

    if (btns == null) {
      btns = layout.createButtons();
    }
    btns.forEach((vb, i) => {
      vb.update(gamepad.pushes[i]);
    });
    btns.forEach(e => {
      e.draw();
    });
  }

  // text('fps: ' + String(getFrameRate()).slice(0, 6), 5, 15);
}

function createStick() {
  let cx, cy;
  switch (layoutType) {
    case 0:
      cx = width / 4 - 10;
      cy = height / 2;
      stick = new ViewStick(cx, cy, 70);
      break;
    case 1:
      cx = width / 4 - 10;
      cy = height * 2 / 3;
      stick = new ViewStick(cx, cy, 35);
      break;
  }

}

function createBtns() {
  btns = [];
  let sz = 20;
  let cx = width / 2;
  let cy = height / 2;
  switch (layoutType) {
    case 0:
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
      sz = 35;
      cx = width / 2 - 10;
      cy = height / 2;
      for (let i = 0; i < gamepad.info.buttons.length; i++) {
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
      break;
    case 1:
      sz = 20;
      btns[9] = new ViewButton(cx, cy, sz, sz);
      break;
  }


}