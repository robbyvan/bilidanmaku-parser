const STATE_PAUSE = 0;
const STATE_PLAYING = 1;

function noop () {
}

export default class Danmaku {
  constructor (rawJson, handler = noop, truncateTime = -1) {
    this.rawJson = rawJson;
    this.truncateTime = truncateTime; // 因为视频是mock, 加一个truncate防止超出视频长度

    this.danmu = [];
    this.handler = handler;
    this.state = STATE_PAUSE;
    this.currentDanmuIndex = 0;

    this._initDanmu();
  }

  _initDanmu () {
    this.danmu = this.rawJson.i.d
      .map(obj => {
        const configs = obj._attributes.p.split(',');
        const text = obj._text;
        return {
          content: text,
          time: Number(configs[0]) * 1000, // ms
          mode: configs[1],
          fontSize: configs[2],
          color: '#' + parseInt(configs[3]).toString(16),
          timestamp: configs[4],
          danmuPool: configs[5],
          user: configs[6],
        };
      })
      .sort((a, b) => Number(a.time) - Number(b.time));
    if (this.truncateTime !== -1) {
      this.danmu = this.danmu.filter(d => d.time < this.truncateTime);
    }
  }

  _findCurDanmuIndex (time) {
    // 找到在time时刻的弹幕index
    for (let i = 0; i < this.danmu.length; ++i) {
      if (time <= this.danmu[i].time) {
        return i;
      }
    }
    return this.danmu.length - 1;
  }

  _callHandler (i) {
    if (i < 0) {
      return;
    }
    this.handler({
      item: this.danmu[i],
      index: this.currentDanmuIndex
    });
  }

  _playRest () {
    const currentDanmu = this.danmu[this.currentDanmuIndex]; // 当前弹幕
    // 延迟: 实际再过delay毫秒就到了下一条弹幕: Date时间差 + 首条时间
    const delay = currentDanmu.time - (+new Date() - this.startStamp); //

    this.timer = setTimeout(() => {
      this._callHandler(this.currentDanmuIndex++); // 实际到了第currentDanmuIndex行弹幕, 调用处理函数handler
      if (this.currentDanmuIndex < this.danmu.length && this.state === STATE_PLAYING) {
        this._playRest();
      }
    }, delay);
  }

  play (startTime = 0, skipLast) {
    if (!this.danmu.length) {
      // 没有弹幕
      return;
    }

    this.state = STATE_PLAYING;

    this.currentDanmuIndex = this._findCurDanmuIndex(startTime); // 找到首条弹幕index
    this.startStamp = +new Date() - startTime; // 开始时间戳: 当前时间 - 首条弹幕时间

    if (!skipLast) {
      this._callHandler(this.currentDanmuIndex - 1);
    }

    // 如果弹幕还没有play完, 继续播放(_playRest)
    if (this.currentDanmuIndex < this.danmu.length) {
      clearTimeout(this.timer);
      this._playRest();
    }
  }

  togglePlay () {
    const now = +new Date(); // toggle的时间
    if (this.state === STATE_PLAYING) {
      this.stop(); // 暂停
      this.pauseStamp = now; // 记录暂停时的时刻
    } else {
      this.state = STATE_PLAYING;
      this.play((this.pauseStamp || now) - (this.startStamp || now), true); // 暂停时刻 - 开始时刻: 实际播放到的位置
      this.pauseStamp = 0;
    }
  }

  stop () {
    this.state = STATE_PAUSE;
    clearTimeout(this.timer);
  }

  seek (offset) {
    this.play(offset);
  }
}
