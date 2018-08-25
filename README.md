# bilidanmaku-parser
一个简易的b站弹幕parser

## 安装
```
 yarn bilidanmaku-parser
```

## 使用

```js
import Danmaku from 'bilidanmaku-parser';
/* 
** Params
** // b站原始弹幕数据
** rawJson: Object
** // callback. 处理当前时刻下的弹幕:item, 其对应的在this.danmu[]中的索引为index
** handler: hanlder({ item, index })
** // 过滤时间点, 使原始弹幕只剩下包含在指定的时间之前的弹幕
** truncateTime: number 
**/

const danmu = new Danmaku(rawJson, handler, truncateTime);
function hanlder({ item, index }){
   // 在这里对当前弹幕(item) 进行操作
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
