import UIPoker from "../Poker/UIPoker"

var GameView = cc.Class({
    extends: cc.Component,

    properties: {
        pokerPrefab: cc.Prefab,

        sendArea: cc.Node,
        setArea: cc.Node,

        player1List: [cc.Node],

        player2List: [cc.Node],

    },

    CreatePokers(pokers){
        // 创建所有扑克牌UI
        pokers.forEach((poker, index)=>{
            let uiPoker = this.CreateUIPoker(poker);
            uiPoker.node.x = 0.5*index;
            this.sendArea.addChild(uiPoker.node);
        });

    },

    CreateUIPoker(poker){
        let uiPokerNode = cc.instantiate(this.pokerPrefab);
        let uiPoker = uiPokerNode.getComponent(UIPoker);
        uiPoker.Init(poker);
        uiPoker.node.setPosition(0,0);

        return uiPoker;
    },

});
