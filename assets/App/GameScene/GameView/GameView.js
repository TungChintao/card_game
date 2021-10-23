import UIUtil from "../../../GameFramework/Util/UIUtil";
import UIPoker from "../../View/UIPoker/UIPoker"
import View from "../../../GameFramework/MVC/View";
import { Area, Mode } from "../../Global/ConfigEsum";
import global from "../../Global/global";
import PokerMessage from "../../Panel/PokerMessage"


// 采用MVC架构  GameView类负责前台界面UI----------

var GameView = cc.Class({
    extends: View,

    properties: {

        _Model: null,
        _gameRound: null,
        _onLineManager: null,
        _exitFlag: false,

        // 计数器预制，控制类，按钮---------------
        pokerMessagePrefab: cc.Prefab,
        _pokerMessage: PokerMessage,
        MessageButton: cc.Button,
        _touchMessageBtnFirst: true,

        // 卡牌预制-------------
        pokerPrefab: cc.Prefab,

        // 节点信息 -------------

        initPokerArea: cc.Node,

        sendArea: cc.Node,
        setArea: cc.Node,

        player1List: [cc.Node],

        player2List: [cc.Node],

        // 回合信息参数------------

        roundMessage: cc.Label,
        pokerMessageBtn: cc.Button,

        // 返回button---------------

        homeBtn: cc.Button,

        // 托管控制参数---------------
        AiManageBtn: cc.Button,
        AiBtnLabel: cc.Label,
        AiManageLabel: cc.Label,
        _touchAIBtnFirst: true,

    },

    // 初始化
    onLoad(){
        this.AiManageLabel.node.active = false;
        this.homeBtn.node.on('touchend', this.backHomeScene,this);
        this.AiManageBtn.node.on('touchend',this.AiContrl,this);
        this.MessageButton.node.on('touchend',this.switchPancel,this);
        if(global.gameMode === Mode.PVP) 
            this.AiManageBtn.node.active = false;
        
        this.CreatePokerPancel();       // 创建计数板
        
    },

    // 托管UI变化
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

    // 记牌器UI变化
    switchPancel(){
        if(this._touchMessageBtnFirst){
            this._touchMessageBtnFirst = false;
            this.MessageButton.node.getChildByName('Label').getComponent(cc.Label).string = '关闭';
            this._pokerMessage.showPancel();
        }
        else{
            this._touchMessageBtnFirst = true;
            this.MessageButton.node.getChildByName('Label').getComponent(cc.Label).string = '记牌器';
            this._pokerMessage.hidePancel();
        }
    },

    BindModel(model){
        this._Model = model;
        this._Model.on('init_poker', this.InitPokers, this);
        this._Model.on('toSendArea', this.toSendArea, this);
        this._Model.on('clickToSetArea',this.toSetArea, this);
        this._Model.on('toPlayList', this.toPlayList, this);
        this._Model.on('StopGameTouch',this.offTouchPoker,this);
        this._Model.on('GameOver',this.showResult,this);
    },

    UnBindModel(){
        this._Model.off('init_poker', this.InitPokers, this);
        this._Model.off('toSendArea', this.toSendArea, this);
        this._Model.off('clickToSetArea',this.toSetArea, this);
        this._Model.off('toPlayList', this.toPlayList, this);
        this._Model.off('GameOver',this.showResult,this);
        this._Model = null;
    },

    BindRound(gameRound){
        this._gameRound = gameRound;
        this._gameRound.on('TurnRoundMessage',this.turnRoundMessage,this);
    },

    UnBindRound(){
        this._gameRound.off('TurnRoundMessage',this.turnRoundMessage,this);
        this._gameRound = null;
       
    },

    BindOnline(onlineManager){
        this._onLineManager = onlineManager;
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

    // UI界面刷新显示玩家手牌数
    RefreshPokerNum(pokerSuit,RefreshFlag){
        let childName = 'numLabel'
        let childNode;
        if(RefreshFlag == 0)
            childNode = this.player1List[pokerSuit].getChildByName(childName);
        else
            childNode = this.player2List[pokerSuit].getChildByName(childName);
        childNode.getComponent(cc.Label).string = this._Model.playerGroupPokerNum(RefreshFlag, pokerSuit)
    },

    // 更新卡牌计数板   参数为数组
    UpdatePokerPancel(playerArea=false, setArea=false, sendArea=false){
           
        if(playerArea){ 
            let playerMessage = this._Model.playerPokersNum;
            this._pokerMessage.updatePlayerLabel(playerMessage);
        }
        if(setArea){ 
            let setMessage = this._Model.setPokerSuitNum.concat();
            setMessage.push(this._Model.setPokerNum());
            this._pokerMessage.updateSetLabel(setMessage);
        }
        
        if(sendArea) {
            let sendMessage =  this._Model.sendPokerSuitNum.concat();
            sendMessage.push(this._Model.sendPokerNum());
            this._pokerMessage.updateSendLabel(sendMessage);
        }
    },


    // 卡牌移动至抽牌区
    toSendArea(poker, index){
        let node = poker.view.node;
        UIUtil.move(node,this.sendArea);
        poker.view.Area = Area.sendArea;

        cc.tween(node)
            .delay(0.1*index)
            .to(0.5, {position: cc.v2(0.25*index,0.25*index)})
            .start();
    },

    // 卡牌移动至放置区
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
            this.UpdatePokerPancel(false,true,true);
        }
        else{

            cc.tween(node)
            .delay(0.1)
            .to(0.5, {position: cc.v2(0,0)})
            .start();

            this.RefreshPokerNum(poker.suit,fromArea);
            this.UpdatePokerPancel(true,true,false);
        }
    },

    // 卡牌移动至玩家手牌区
    // toPlayList(poker, index, time, playerID){
        
    //     let node = poker.view.node;
    //     if(playerID === 1){
    //         UIUtil.move(node, this.player1List[poker.suit]);
    //         poker.view.Area = Area.player1List;
    //     }
    //     else {
    //         UIUtil.move(node,this.player2List[poker.suit]);
    //         poker.view.Area = Area.player2List;
    //     }

    //     cc.tween(node)
    //         .delay(time-0.1*index)
    //         .to(0.5, {position: cc.v2(0,0)})
    //         .start();
        
    //     this.RefreshPokerNum(poker.suit,playerID-1);
    //     this.UpdatePokerPancel(true,true,false);
       
    // },
    toPlayList(pokerGroup, indexLen, time, playerID){
        
        for(let i = 0;i<indexLen;i++){
            let poker = pokerGroup[i];
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
                .delay(time-0.1*i)
                .to(0.5, {position: cc.v2(0,0)})
                .start();
            
            this.RefreshPokerNum(poker.suit,playerID-1);
            this.UpdatePokerPancel(true,true,false);
        }
       
    },

    // 卡牌被点击后判断如何显示动画
    UIPokerOnTouch(poker,pokerArea){

        // 1.这张牌是抽牌区或玩家出牌区的
        // 2.这张牌是目前牌堆最上方的
        // 3.这张牌是玩家X翻开的

        if(this._exitFlag) return;

        if(!this._gameRound.judgePlayerActive()) return;    // 判断是否为该玩家的回合
     
        if(pokerArea === Area.sendArea || pokerArea === this._gameRound.round){
            if(this._Model.isTopIndexPoker(poker,this._gameRound.round,pokerArea)){  
                if(global.gameMode == Mode.Online){

                    if(pokerArea === Area.sendArea)
                        this.emit('DealPokerOnTouch');
                    else{
                        this.emit('UIPokerOnTouch',pokerArea,this._gameRound.round,poker, poker.suit);
                        this._onLineManager.DealSelfPoker(poker.suit,poker.point,pokerArea);
                    }
                    // this._onLineManager.DealSelfPoker(poker.suit,poker.point,pokerArea);
                    this._gameRound.onlineRoundTurn();
                    this._onLineManager.DealOpponentPoker();
                }
                else{
                    this.emit('UIPokerOnTouch',pokerArea,this._gameRound.round,poker,poker.suit);
                    this._gameRound.localRoundTurn();
                }
            }
        }
    },

    offTouchPoker(){
        this._exitFlag = true;
    },

    // 创建卡牌UI
    CreateUIPoker(poker){
        let uiPokerNode = cc.instantiate(this.pokerPrefab);
        let uiPoker = uiPokerNode.getComponent(UIPoker);
        uiPoker.Init(poker,this);
        //uiPoker.node.setPosition(0,0);
        return uiPoker;
    },

    CreatePokerPancel(){
        this._pokerMessage = cc.instantiate(this.pokerMessagePrefab).getComponent(PokerMessage);
        this.node.addChild(this._pokerMessage.node);
        this._pokerMessage.hidePancel();
    },

    turnRoundMessage(roundMessage){
        setTimeout(()=>{this.roundMessage.string = roundMessage;},1000);
    },

    backHomeScene(){
        this.emit('BackHomeOnTouch');
        cc.director.loadScene(global.fromWhichScene);
    },

    showResult(){
        this.emit('gameOver');
    },

    Exit(){
        // this.UnBindModel();
        // this.UnBindOnline();
        // this.UnBindRound();
    }
    
});
