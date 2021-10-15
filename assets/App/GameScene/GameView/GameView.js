import UIUtil from "../../../GameFramework/Util/UIUtil";
import UIPoker from "../../View/UIPoker/UIPoker"
import View from "../../../GameFramework/MVC/View";
import { Area } from "../../Global/ConfigEsum";

var GameView = cc.Class({
    extends: View,

    properties: {

        _Model: null,
        _gameRound: null,
        // _player: [],

        pokerPrefab: cc.Prefab,
        initPokerArea: cc.Node,

        sendArea: cc.Node,
        setArea: cc.Node,

        player1List: [cc.Node],

        player2List: [cc.Node],

        homeBtn: cc.Button,

        AiManageBtn: cc.Button,

        playerTurn: 0,
    },

    onLoad(){
        this.homeBtn.node.on('touchend', this.backHomeScene,this);
        this.AiManageBtn.node.on('touchend',this.AiContrl,this);
    },

    start(){
        
        // this.sendArea.on('touchend',this.sendOnTouchEnd, this);
    },

    AiContrl(){
        this.emit('AIManageBtnOnTouch',this._gameRound.round);
    },

    BindModel(model){
        this._Model = model;
        this._Model.on('init_poker', this.InitPokers, this);
        this._Model.on('toSendArea', this.toSendArea, this);
        this._Model.on('clickToSetArea',this.toSetArea, this);
        this._Model.on('toPlayList', this.toPlayList, this);
        this._Model.on('GameOver',this.showResult,this);
    },

    UnBindModel(){
        this._Model.off('init_poker', this.InitPokers, this);
        this._Model.off('toSendArea', this.toSendArea, this);
        this._Model.off('clickToSetArea',this.toSetArea, this);
        this._Model.off('toPlayList', this.toPlayList, this);
    },

    BindRound(gameRound){
        this._gameRound = gameRound;
    },

    UnBindRound(){
        this._gameRound = null;
    },

    // BindPlayer(player1,player2){
    //     this._player.push(player1);
    //     this._player.push(player2);
    // },

    // UnBindPlayer(){
    //     this._player = [];
    // },

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
        poker.view.Area = Area.sendArea;

        cc.tween(node)
            .delay(0.1*index)
            .to(0.5, {position: cc.v2(0.25*index,0.25*index)})
            .start();
    },

    toSetArea(poker,index, fromArea){

        // this.offSendTouch();
        cc.log('gameView toSetArea()')
        
        let node = poker.view.node;
        UIUtil.move(node, this.setArea);
        poker.view.Area = Area.setArea;

        if(fromArea === Area.sendArea){

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
        }
        else{

            cc.tween(node)
            .delay(0.1)
            .to(0.5, {position: cc.v2(0,0)})
            .start();
        }

        // setTimeout(()=>{
        //     this.openSendTouch();
        // },1600);
    },

    toPlayList(poker, index, time, playerID){

        // this.offSendTouch();
        
        let node = poker.view.node;
        if(playerID === 1){
            UIUtil.move(node, this.player1List[poker.suit]);
            poker.view.Area = Area.player1List;
        }
        else {
            UIUtil.move(node,this.player2List[poker.suit]);
            poker.view.Area = Area.player2List;
        }

        cc.tween(node)
            .delay(time-0.1*index)
            .to(0.5, {position: cc.v2(0,0)})
            .start();
        
        // setTimeout(()=>{
        //     this.openSendTouch();
        // },1600);
    },

    UIPokerOnTouch(poker,pokerArea){
        // 1.这张牌是抽牌区或玩家出牌区的
        // 2.这种牌是最上方的
        // 3.这张牌是玩家X翻开的
        if(!this._gameRound.judgePlayerActive()) return;
        // if(!this._player[this._gameRound.round].active) return;
        if(pokerArea === Area.sendArea || pokerArea === this._gameRound.round){
            if(this._Model.isTopIndexPoker(poker,this._gameRound.round,pokerArea)){
                this.emit('UIPokerOnTouch',pokerArea,this._gameRound.round,poker);
                this._gameRound.roundTurn();
                // this._player[this.playerTurn].active = false;
                // this.playerTurn = (this.playerTurn+1) % 2;
                // this._player[this.playerTurn].active = true;
            }
        }
    },

    CreateUIPoker(poker){
        let uiPokerNode = cc.instantiate(this.pokerPrefab);
        let uiPoker = uiPokerNode.getComponent(UIPoker);
        uiPoker.Init(poker,this);
        //uiPoker.node.setPosition(0,0);
        return uiPoker;
    },

    backHomeScene(){
        cc.log('ok');
        // cc.director.loadScene('StartScene');
    },

    showResult(winner){
        this.emit('gameOver',winner);
    }



});
