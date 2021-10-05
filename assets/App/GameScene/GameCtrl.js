import PlayerView from "./GameView/PlayerView"
import GameView from "./GameView/GameView"
import GameDB from "GameDB";

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
        this._gameDB = new GameDB();
       
  
        this._gameDB.on('init_poker', this._gameView.InitPokers, this._gameView);
        this._gameDB.on('toSendArea', this._gameView.toSendArea, this._gameView);
        this._gameDB.on('clickToSetArea',this._gameView.toSetArea, this._gameView);
        this._gameDB.on('open_clickToSetArea', this._gameView.openSendTouch, this._gameView);
        this._gameDB.on('off_clickToSetArea',this._gameView.offSendTouch, this._gameView);
        this._gameDB.on('toPlayList', this._gameView.toPlayList, this._gameView);

        this._gameView.on('sendArea_OnTouchedEnd',this._gameDB.toSetArea, this._gameDB);

        this._gameDB.shuffle();
        
        // this._gameView.InitPokers(this._gameDB.pokers);
    },

    Play(){
        this._gameDB.toSendArea();
    },

    Exit(){
        this._gameDB.off('init_poker', this._gameView.OnEventInit);
    },

});