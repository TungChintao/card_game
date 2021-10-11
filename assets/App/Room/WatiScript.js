import global from "../Global/global";

const t = cc.tween;

cc.Class({
  extends: cc.Component,

  properties: {
    MosterNodes: [cc.Node],
    roomID: cc.Label,
  },

  start () {
      //TODO  事件监听
      // 等待玩家加入
    
    this.roomID.string = this.roomID.string + global.selfRoomInfo;
    
    let nodes = this.MosterNodes;
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      t(node)
        // The defference delay should only eval once
        .delay(0.5 + i * 0.2)
        // repeat 1000 times
        .repeat(1000,
          t()
            // first reset node properties
            .set({ opacity: 0, scale: 10, x: 0, angle: 0 })
            // parallel exec tween
            .parallel(
              t().to(1, { opacity: 255, scale: 1 }, { easing: 'quintInOut' }),
              t().to(2.5, { x: node.x }, { easing: 'backOut' })
            )
            .delay(0.5)
            .to(0.8, { angle: 360 }, { easing: 'cubicInOut' })
            .delay(1)
            .to(0.3, { opacity: 0, scale: 3 }, { easing: "quintIn" })
            .delay(1)
        )
        .start()
    }
  },

});
