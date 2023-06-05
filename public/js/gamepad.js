class Gamepad {
  constructor() {
    this.type = 'ps'; //'xbox';
    this.init();
  }

  init() {
    this.index = -1;
    // this.cacheGamepad = null;
    this.pushes = null;
    this.info = null;
    // this.preInfo = null;
    // this.pushIntervalFrame = 0; //0は同時押し
    // this.pushIntervalFrameCount = 0;
    this.history = [];
    this.historyFrame = 0;

    this.btnLine = [];

    this.testMode = false; //false;
  }

  connect(index) {
    this.index = index;

    // osならaxes[9]を使うためなかったら回避
    const gamepad = this.getGamepad();
    if (gamepad.axes.length < 9) {
      this.type = 'xbox';
      this.btnLine =
        this.type == 'ps' ? [0, 3, 5, 4, 1, 2, 7, 6] : [2, 3, 5, 4, 0, 1, 7, 6];
    }
  }

  connectTest() {
    this.testMode = true;
  }

  disconnect() {
    this.init();
  }

  getGamepad() {
    if (!this.testMode) {
      if (this.index == -1) return null;
      else return navigator.getGamepads()[this.index];
    } else {
      const r = () => random();
      const testData = {};
      return testData;
    }
  }

  update() {
    if (this.index == -1 && this.testMode == false) return;

    let cInfo;
    if (!this.testMode) {
      const cGamepad = navigator.getGamepads()[this.index];
      // this.cacheGamepad = cGamepad;
      cInfo = this.createInfo(cGamepad, this.info);
    } else {
      cInfo = this.createInfoTest(this.info);
    }

    const cPushes = this.createPushes(cInfo);

    if (this.info) {
      this.pushHistory(cPushes, this.pushes);

      // this.preInfo = this.info;
      // this.preInfo = {};
      // this.preInfo.stick = this.info.stick;
      // this.preInfo.buttons = this.info.buttons;//.map(e => e);
    }
    this.info = cInfo;
    this.pushes = cPushes;
  }

  createInfo(gamepad, preInfo = null) {
    if (!gamepad) return null;

    const info = {
      stick: {
        dir: 0,
        dir4: [false, false, false, false],
        dir8: [
          {
            pressed: false,
            push: false,
            // release: false,
            pushPassFrame: 0,
            // releasePassFrame: 0,
          },
        ],
        vec: { x: 0, y: 0 },
        tenkey: 5,
      },
      buttons: [
        {
          pressed: false,
          push: false,
          // release: false,
          pushPassFrame: 0,
          // releasePassFrame: 0,
        },
      ],
    };

    const g = gamepad;
    // stick(ps)
    // info.stick = {};

    let dir = 8;
    if (this.type == 'ps') {
      const sa = g.axes[9];
      dir = round(((sa + 1) / 2) * 7);
    } else {
      const up = g.buttons[12].pressed;
      const down = g.buttons[13].pressed;
      const left = g.buttons[14].pressed;
      const right = g.buttons[15].pressed;
      if (up && !down) {
        if (left) dir = 7;
        else if (right) dir = 1;
        else dir = 0;
      } else if (right && !left) {
        if (down) dir = 3;
        else dir = 2;
      } else if (down) {
        if (left) dir = 5;
        else dir = 4;
      } else if (left) {
        dir = 6;
      }
    }
    info.stick = this.dirToStickInfo(dir, preInfo);

    // buttons
    // info.buttons = [];
    this.btnLine.forEach((e, i) => {
      info.buttons[i] = {};
      info.buttons[i].pressed = g.buttons[e].pressed;
      if (preInfo) {
        info.buttons[i].push =
          g.buttons[e].pressed == true && preInfo.buttons[i].pressed == false;
        if (info.buttons[i].push) {
          info.buttons[i].pushPassFrame = 0;
        } else if (info.buttons[i].pushPassFrame < 255) {
          info.buttons[i].pushPassFrame = preInfo.buttons[i].pushPassFrame + 1;
        }
      }
    });

    return info;
  }

  createInfoTest(preInfo = null) {
    if (preInfo && random() < 0.8) {
      preInfo.stick.dir8.forEach((e) => {
        // e.pressed = false;
        e.push = false;
      });
      preInfo.buttons.forEach((e) => {
        // e.pressed = false;
        e.push = false;
      });
      return preInfo;
    }

    const info = {};
    info.stick = this.dirToStickInfo(floor(random(0, 9)), preInfo);
    info.buttons = [];
    this.btnLine.forEach((e, i) => {
      const btnInfo = {};
      btnInfo.pressed = random() < 0.1;
      if (preInfo) {
        btnInfo.push =
          preInfo.buttons[i].pressed == false && btnInfo.pressed == true;
      } else {
        btnInfo.push = true;
      }
      if (!preInfo || btnInfo.pressed) {
        btnInfo.pushPassFrame = 0;
      } else {
        btnInfo.pushPassFrame = preInfo.buttons[i].pushPassFrame + 1;
      }
      info.buttons[i] = btnInfo;
    });

    return info;
  }

  dirToStickInfo(dir, preInfo = null) {
    const stick = {};
    const getDir8 = (pressIndex, preInfo = null) => {
      const r = [];
      for (let i = 0; i < 9; i++) {
        r[i] = {};
        r[i].pressed = i == pressIndex;
        if (preInfo) {
          r[i].push =
            r[i].pressed == true && preInfo.stick.dir8[i].pressed == false;
          if (r[i].push) {
            r[i].pushPassFrame = 0;
          } else if (r[i].pushPassFrame < 255) {
            r[i].pushPassFrame = preInfo.stick.dir8[i].pushPassFrame + 1;
          }
        }
      }
      return r;
    };
    switch (dir) {
      case 0:
        stick.tenkey = 8;
        stick.dir4 = [true, false, false, false];
        stick.dir8 = getDir8(0, preInfo);
        stick.vec = { x: 0, y: -1 };
        break;
      case 1:
        stick.tenkey = 9;
        stick.dir4 = [true, true, false, false];
        stick.dir8 = getDir8(1, preInfo);
        stick.vec = { x: 1, y: -1 };
        break;
      case 2:
        stick.tenkey = 6;
        stick.dir4 = [false, true, false, false];
        stick.dir8 = getDir8(2, preInfo);
        stick.vec = { x: 1, y: 0 };
        break;
      case 3:
        stick.tenkey = 3;
        stick.dir4 = [false, true, true, false];
        stick.dir8 = getDir8(3, preInfo);
        stick.vec = { x: 1, y: 1 };
        break;
      case 4:
        stick.tenkey = 2;
        stick.dir4 = [false, false, true, false];
        stick.dir8 = getDir8(4, preInfo);
        stick.vec = { x: 0, y: 1 };
        break;
      case 5:
        stick.tenkey = 1;
        stick.dir4 = [false, false, true, true];
        stick.dir8 = getDir8(5, preInfo);
        stick.vec = { x: -1, y: 1 };
        break;
      case 6:
        stick.tenkey = 4;
        stick.dir4 = [false, false, false, true];
        stick.dir8 = getDir8(6, preInfo);
        stick.vec = { x: -1, y: 0 };
        break;
      case 7:
        stick.tenkey = 7;
        stick.dir4 = [true, false, false, true];
        stick.dir8 = getDir8(7, preInfo);
        stick.vec = { x: -1, y: -1 };
        break;
      case 8:
        stick.tenkey = 5;
        stick.dir4 = [false, false, false, false];
        stick.dir8 = getDir8(8, preInfo);
        stick.vec = { x: 0, y: 0 };
        break;
    }
    return stick;
  }

  createPushes(info) {
    return [
      info.stick.dir8[0].push,
      info.stick.dir8[1].push,
      info.stick.dir8[2].push,
      info.stick.dir8[3].push,
      info.stick.dir8[4].push,
      info.stick.dir8[5].push,
      info.stick.dir8[6].push,
      info.stick.dir8[7].push,
      info.stick.dir8[8].push,
      info.buttons[0].push,
      info.buttons[1].push,
      info.buttons[2].push,
      info.buttons[3].push,
      info.buttons[4].push,
      info.buttons[5].push,
      info.buttons[6].push,
      info.buttons[7].push,
    ];
  }

  pushHistory(pushes, prePushes) {
    if (prePushes == null) return;

    this.historyFrame++;
    const isChange = !pushes.every((e, i) => prePushes[i] == e || !e);

    if (!isChange) return;

    const pushesIndex = [];
    pushes.forEach((e, i) => {
      if (e) pushesIndex.push(i);
    });
    const historyItem = {
      passFrame: this.historyFrame,
      pushes: pushes,
      pushesIndex: pushesIndex,
    };
    this.history.unshift(historyItem);
    if (this.history.length > 10) {
      this.history.pop();
    }
    this.historyFrame = 0;
  }
}
