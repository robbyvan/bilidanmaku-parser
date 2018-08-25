# bilidanmaku-parser
一个简易的b站弹幕parser

## 安装
```
 yarn bilidanmaku-parser
```

## 使用

```
 import Danmaku from 'bilidanmaku-parser'
 let danmu = new Danmaku(rawJson, handler)

 function hanlder({ currentDanmu, currentDanmuIndex }){
   // 对当前弹幕(currentDanmu)进行的操作
 }
```

## API

#### play(time: number)
从time(毫秒)处开始播放弹幕, 默认为0

#### stop()
停止播放弹幕

#### seek(time)
从time(毫秒)处开始播放弹幕

#### togglePlay()
暂停/继续播放弹幕
