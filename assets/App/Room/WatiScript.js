import global from "../Global/global";
import {URL} from "../Global/ConfigEsum"

const t = cc.tween;

cc.Class({
    extends: cc.Component,

    properties: {
        MosterNodes: [cc.Node],
        roomID: cc.Label,
        tips: cc.Label,

        returnBtn: cc.Button,
    },

    onLoad(){
      this.roomID.string = this.roomID.string + global.selfRoomInfo;
      this.tips.string = global.waitTips;
    },

    start () {

      this.returnBtn.node.on('touchend',this.returnRoom,this);

        // 事件监听 2s/次
        // 等待玩家加入
      this.schedule(()=>{
        // 这里的 this 指向 component
        this.checkPlayer();
      },2);
    
      let nodes = this.MosterNodes;
      for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i];
          t(node)
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

    checkPlayer(){
      let url = URL.fetchOpUrl + global.selfRoomInfo + '/last'
      let xhr = new XMLHttpRequest();
      xhr.open('GET',url);
      xhr.setRequestHeader('Authorization', 'Bearer ' + global.selfInfo.token);
      xhr.send();
      xhr.onreadystatechange = ()=>{
          if(xhr.readyState == 4 && xhr.status == 200){
              let returnData = JSON.parse(xhr.responseText);
              // cc.log(returnData);
              if(returnData.data.last_msg == '对局刚开始'){
                  global.yourTurn = returnData.data.your_turn;
                  cc.director.loadScene('GameScene');
              }
              
          }
      }

    },

    returnRoom(){
      cc.director.loadScene('RoomScene');
    },
});
