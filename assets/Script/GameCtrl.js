import Poker from "./Poker";
import UIPoker from "./UIPoker"

var GameCtrl = cc.Class({
    extends: cc.Component,
    
    properties:{
        pokerPrefab: cc.Prefab,
        pokerContainer: cc.Prefab,
    
        pokers: [Poker],

    },


    Init(pokerContainer,pokerPrefab){
        this.pokerContainer = pokerContainer;
        this.pokerPrefab = pokerPrefab;
    },


    Start(){
        console.log('Start');

        for(let point of ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2']){
            for(let suit of ['hearts', 'clubs', 'diamonds', 'spade']){
                let temp_poker = new Poker(point, suit);
                this.pokers.push(temp_poker);
            }
        }
        console.log(this.pokers);

        // 创建所有扑克牌UI
        this.pokers.forEach(poker=>{
            let uiPoker = this.CreateUIPoker(poker);
            this.pokerContainer.addChild(uiPoker.node);
        });
    },

    CreateUIPoker(poker){
        let uiPokerNode = cc.instantiate(this.pokerPrefab);
        let uiPoker = uiPokerNode.getComponent(UIPoker);
        uiPoker.Init(poker);
        uiPoker.node.setPosition(Math.random()*400, Math.random()*400);

        return uiPoker;
    },
});