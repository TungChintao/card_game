import UIUtil from "../../../GameFramework/Util/UIUtil";
import UIPoker from "../../View/UIPoker/UIPoker"
import View from "../../../GameFramework/MVC/View";
import { Area, Mode } from "../../Global/ConfigEsum";
import global from "../../Global/global";

var GameView = cc.Class({
    extends: View,

    properties: {

        _Model: null,
        _gameRound: null,
        _onLineManager: null,

        pokerPrefab: cc.Prefab,
        initPokerArea: cc.Node,

        sendArea: cc.Node,
        setArea: cc.Node,

        player1List: [cc.Node],

        player2List: [cc.Node],

        roundMessage: cc.Label,
        pokerMessageBtn: cc.Button,

        homeBtn: cc.Button,

        AiManageBtn: cc.Button,
        AiBtnLabel: cc.Label,
        AiManageLabel: cc.Label,
        _touchAIBtnFirst: true,

    },

    onLoad(){
        this.AiManageLabel.node.active = false;
        this.homeBtn.node.on('touchend', this.backHomeScene,this);
        this.AiManageBtn.node.on('touchend',this.AiContrl,this);
        if(global.gameMode === Mode.PVP) 
            this.AiManageBtn.node.active = false;
        
    },

    AiContrl(){
        if(this._touchAIBtnFirst){
            this.emit('AIManageBtnOnTouch');
            this.AiManageLabel.node.active = true;
            this.AiBtnLabel.string = '取消';
            this._touchAIBtnFirst = false;
        }
        else{
            this.emit('CancelAIManage');
            this.AiBtnLabel.string = '托管';
            this.AiManageLabel.node.active = false;
            this._touchAIBtnFirst = true;
        }
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
        this._gameRound.on('TurnRoundMessage',this.turnRoundMessage,this);
    },

    UnBindRound(){
        this._gameRound = null;
        this._gameRound.off('TurnRoundMessage',this.turnRoundMessage,this);
    },

    BindOnline(online){
        this._onLineManager = online;
    },

    UnBindOnline(){
        this._onLineManager = null;
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

    RefreshPokerNum(pokerSuit,RefreshFlag){
        let childName = 'numLabel'
        let childNode;
        if(RefreshFlag == 0)
            childNode = this.player1List[pokerSuit].getChildByName(childName);
        else
            childNode = this.player2List[pokerSuit].getChildByName(childName);
        childNode.getComponent(cc.Label).string = this._Model.playerGroupPokerNum(RefreshFlag, pokerSuit)
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
                .delay(0.3)
                .to(0.5, {position: cc.v2(0.25*index,0.25*index)})  // .to(0.5, {position: cc.v2(index*30,0)})
                .start();
        }
        else{

            cc.tween(node)
            .delay(0.1)
            .to(0.5, {position: cc.v2(0,0)})
            .start();

            this.RefreshPokerNum(poker.suit,fromArea);
        }

    },

    toPlayList(poker, index, time, playerID){
        
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
        
        this.RefreshPokerNum(poker.suit,playerID-1);
       
        
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
                if(global.gameMode == Mode.Online){
                   
                    if(pokerArea === Area.sendArea)
                        this.emit('DealPokerOnTouch');
                    else{
                        this.emit('UIPokerOnTouch',pokerArea,this._gameRound.round,poker);
                        this._onLineManager.DealSelfPoker(poker.suit,poker.point,pokerArea);
                    }
                    // this._onLineManager.DealSelfPoker(poker.suit,poker.point,pokerArea);
                    this._gameRound.onlineRoundTurn();
                    this._onLineManager.DealOpponentPoker();
                }
                else{
                    this.emit('UIPokerOnTouch',pokerArea,this._gameRound.round,poker);
                    this._gameRound.localRoundTurn();
                }
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

    turnRoundMessage(roundMessage){
        this.roundMessage.string = roundMessage;
    },

    backHomeScene(){
        cc.director.loadScene(global.fromWhichScene);
    },

    showResult(winner){
        this.emit('gameOver',winner);
    }



});
