import UIPoker from "../../View/UIPoker/UIPoker"
import GameDB from "../GameDB";

var GameView = cc.Class({
    extends: cc.Component,

    properties: {
        pokerPrefab: cc.Prefab,
        initPokerArea: cc.Node,

        sendArea: cc.Node,
        setArea: cc.Node,

        player1List: [cc.Node],

        player2List: [cc.Node],
    },

    onLoad(){
        // let poker = new cc.Node();
        // poker.position = new cc.Vec3(0.3*i,0.3*i,0);
        // this.sendArea.addChild(poker);
    },

    start(){
        this.sendArea.on('touchend',this.onTouchEnd, this);
    },

    onTouchEnd(){
        cc.log('GameView');
        this.node.dispatchEvent( new cc.Event.EventCustom('gameview_onTouchEnd', true) );
    },

    InitPokers(pokers){
        // 创建所有扑克牌UI
        pokers.forEach((poker, index)=>{
            let uiPoker = this.CreateUIPoker(poker);
            uiPoker.node.x = 0.25*index;
            uiPoker.node.y = 0.25*index;
            this.initPokerArea.addChild(uiPoker.node);
        });

    },


    toSendArea(poker, index){
        let node = poker.view.node;
        let wp = node.convertToWorldSpaceAR(cc.v2(0,0));
        
        let area = this.sendArea;
        let ar = area.convertToNodeSpaceAR(wp);

        node.removeFromParent(false);
        node.position = ar;
        area.addChild(node);

        cc.tween(node)
            .delay(0.1*index)
            .to(0.5, {position: cc.v2(0.25*index,0.25*index)})
            .start();
    },

    toSetArea(poker,index){
        let node = poker.view.node;
        let wp = node.convertToWorldSpaceAR(cc.v2(0,0));
        
        let area = this.setArea;
        let ar = area.convertToNodeSpaceAR(wp);

        node.removeFromParent(false);
        node.position = ar;
        area.addChild(node);

        cc.tween(node)
            .delay(0.1)
            .to(0.3,{scaleX:0})
            .call(()=>{
                poker.view.Refresh();
            })
            .to(0.3,{scaleX:1.2})
            .delay(0.5)
            .to(0.5, {position: cc.v2(0.25*index,0.25*index)})
            .start();
    },

    OnEventInit(pokers){
        this.InitPokers(pokers);
    }
,
    CreateUIPoker(poker){
        let uiPokerNode = cc.instantiate(this.pokerPrefab);
        let uiPoker = uiPokerNode.getComponent(UIPoker);
        uiPoker.Init(poker);
        uiPoker.node.setPosition(0,0);

        return uiPoker;
    },

});
