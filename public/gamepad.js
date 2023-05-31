class Gamepad {
  constructor() {
    this.index = -1;
    this.cacheGamepad = null;
    this.pushes = null;
    this.info = null;
    // this.preInfo = null;
    // this.pushIntervalFrame = 0; //0は同時押し
    // this.pushIntervalFrameCount = 0;
    this.history = [];
    this.historyFrame = 0;
  }

  connect(index) {
    this.index = index;
  }

  disconnect() {
    this.index = -1;
  }

  update() {
    if (this.index == -1) return;

    const cGamepad = navigator.getGamepads()[this.index];
    this.cacheGamepad = cGamepad;
    const cInfo = this.createInfo(cGamepad, this.info);
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

    // コントローラーによって変える
    const type = 'ps'; //'xbox';
    const btnLine = type == 'ps' ? [0, 3, 5, 4, 1, 2, 7, 6] : [2, 3, 5, 4, 0, 1, 7, 6];

    const info = {
      stick: {
        dir4: [false, false, false, false],
        dir8: [{
          pressed: false,
          push: false,
          // release: false,
          pushPassFrame: 0,
          // releasePassFrame: 0,
        }],
        tenkey: 5,
      },
      buttons: [
        {
          pressed: false,
          push: false,
          // release: false,
          pushPassFrame: 0,
          // releasePassFrame: 0,
        }
      ],
    };

    const g = gamepad;
    // stick(ps)
    // info.stick = {};
    const getDir8 = (pressIndex, preInfo = null) => {
      const r = [];
      for (let i = 0; i < 9; i++) {
        r[i] = {};
        r[i].pressed = (i == pressIndex);
        if (preInfo) {
          r[i].push = (r[i].pressed == true && preInfo.stick.dir8[i].pressed == false);
          if (r[i].push) {
            r[i].pushPassFrame = 0;
          }
          else if (r[i].pushPassFrame < 255) {
            r[i].pushPassFrame = preInfo.stick.dir8[i].pushPassFrame + 1;
          }
        }
      }
      return r;
    };
    if (type == 'ps') {
      const sa = g.axes[9];
      const sar = round((sa + 1) / 2 * 7);
      switch (sar) {
        case 0:
          info.stick.tenkey = 8;
          info.stick.dir4 = [true, false, false, false];
          info.stick.dir8 = getDir8(0, preInfo);
          break;
        case 1:
          info.stick.tenkey = 9;
          info.stick.dir4 = [true, true, false, false];
          info.stick.dir8 = getDir8(1, preInfo);
          break;
        case 2:
          info.stick.tenkey = 6;
          info.stick.dir4 = [false, true, false, false];
          info.stick.dir8 = getDir8(2, preInfo);
          break;
        case 3:
          info.stick.tenkey = 3;
          info.stick.dir4 = [false, true, true, false];
          info.stick.dir8 = getDir8(3, preInfo);
          break;
        case 4:
          info.stick.tenkey = 2;
          info.stick.dir4 = [false, false, true, false];
          info.stick.dir8 = getDir8(4, preInfo);
          break;
        case 5:
          info.stick.tenkey = 1;
          info.stick.dir4 = [false, false, true, true];
          info.stick.dir8 = getDir8(5, preInfo);
          break;
        case 6:
          info.stick.tenkey = 4;
          info.stick.dir4 = [false, false, false, true];
          info.stick.dir8 = getDir8(6, preInfo);
          break;
        case 7:
          info.stick.tenkey = 7;
          info.stick.dir4 = [true, false, false, true];
          info.stick.dir8 = getDir8(7, preInfo);
          break;
        case 8:
          info.stick.tenkey = 5;
          info.stick.dir4 = [false, false, false, false];
          info.stick.dir8 = getDir8(8, preInfo);
          break;
      }
    }
    else {
      // TODO
    }
    // print(sa + ":" + info.stick.tenkey);
    // buttons
    // info.buttons = [];
    btnLine.forEach((e, i) => {
      info.buttons[i] = {};
      info.buttons[i].pressed = g.buttons[e].pressed;
      if (preInfo) {
        info.buttons[i].push = g.buttons[e].pressed == true && preInfo.buttons[i].pressed == false;
        if (info.buttons[i].push) {
          info.buttons[i].pushPassFrame = 0;
        }
        else if (info.buttons[i].pushPassFrame < 255) {
          info.buttons[i].pushPassFrame = preInfo.buttons[i].pushPassFrame + 1;
        }
      }
    });

    return info;
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
    const historyItem =
    {
      passFrame: this.historyFrame,
      pushes: prePushes,
      pushesIndex: pushesIndex
    };
    this.history.unshift(historyItem);
    if (this.history.length > 10) {
      this.history.pop();
    }
    this.historyFrame = 0;
  }

}