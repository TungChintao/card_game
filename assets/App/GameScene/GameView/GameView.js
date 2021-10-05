import UIUtil from "../../../GameFramework/Util/UIUtil";
import UIPoker from "../../View/UIPoker/UIPoker"
import View from "../../../GameFramework/MVC/View";

var GameView = cc.Class({
    extends: View,

    properties: {
        pokerPrefab: cc.Prefab,
        initPokerArea: cc.Node,

        sendArea: cc.Node,
        setArea: cc.Node,

        player1List: [cc.Node],

        player2List: [cc.Node],

        playerTurn: 1,
    },

    onLoad(){
    },

    start(){
        // this.sendArea.on('touchend',this.sendOnTouchEnd, this);
    },

    openSendTouch(){
        cc.log('open');
        this.sendArea.on('touchend', this.sendOnTouchEnd, this);
    },

    offSendTouch(){
        this.sendArea.off('touchend', this.sendOnTouchEnd, this);
    },

    sendOnTouchEnd(){
        this.emit('sendArea_OnTouchedEnd', this.playerTurn);
        this.playerTurn = (this.playerTurn % 2) + 1;
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
        UIUtil.move(node,this.sendArea);

        cc.tween(node)
            .delay(0.1*index)
            .to(0.5, {position: cc.v2(0.25*index,0.25*index)})
            .start();
    },

    toSetArea(poker,index){
        this.offSendTouch();
        let node = poker.view.node;
        UIUtil.move(node, this.setArea);

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
        setTimeout(()=>{
            this.openSendTouch();
        },1800);
    },

    toPlayList(poker, index, time, playerID){
        
        let node = poker.view.node;
        if(playerID === 1)
            UIUtil.move(node, this.player1List[poker.suit]);
        else 
            UIUtil.move(node,this.player2List[poker.suit]);

        cc.tween(node)
            .delay(time-0.1*index)
            .to(0.5, {position: cc.v2(0,0)})
            .start();
    },

    CreateUIPoker(poker){
        let uiPokerNode = cc.instantiate(this.pokerPrefab);
        let uiPoker = uiPokerNode.getComponent(UIPoker);
        uiPoker.Init(poker);
        uiPoker.node.setPosition(0,0);

        return uiPoker;
    },



});
