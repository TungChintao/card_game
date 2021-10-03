import PlayerView from "./GameView/PlayerView"
import GameView from "./GameView/GameView"
import GameDB from "GameDB";
import EventManger from "../../GameFramework/Event/EventManager"
import EventManager from "../../GameFramework/Event/EventManager";

var GameCtrl = cc.Class({
    extends: cc.Component,
    
    properties:{

        _gameDB: GameDB,

        _gameView: GameView,

        _playerView1: PlayerView,

        _playerView2: PlayerView,

    },

    onload(){
        this.node.on('gameview_onTouchEnd', this.gameview_onTouchEnd, this);
    },

    gameview_onTouchEnd(){
        cc.log('GameCtrl');
        this._gameCtrl.dealPoker();
    },

    Init(gameView){
        this._gameView = gameView;
        EventManger.getInstance().on('init_poker', this._gameView.OnEventInit, this._gameView);
        EventManger.getInstance().on('toSendArea', this._gameView.toSendArea, this._gameView);
        this._gameDB = GameDB.Create();
        this._gameDB.shuffle();
        // this._gameView.InitPokers(this._gameDB.pokers);
    },

    Play(){
        // for(let i = 0;i<52;i++){
        //     poker = this._gameDB.toSendArea();
        //     this._gameView.toSendArea(poker, i);
        // }
        this._gameDB.toSendArea();
    },

    dealPoker(){
        let [poker,index,sendPokerLen] = this._gameDB.toSetArea();
        cc.log(poker);
        this._gameView.toSetArea(poker,index);
        if(sendPokerLen === 0)  return true;
        return false;
    },

    Exit(){
        EventManager.getInstance().off('init_poker', this._gameView.OnEventInit);
    },

});