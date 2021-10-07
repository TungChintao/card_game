import GameView from "./GameView/GameView"
import GameDB from "GameDB"
import Player from 'Player'

var GameCtrl = cc.Class({
    extends: cc.Component,
    
    properties:{

        _gameDB: GameDB,

        _gameView: GameView,

        _player1: Player,

        _player2: Player,

    },

    onload(){
    },

    Init(gameView){
        this._gameView = gameView;
        this._gameDB = new GameDB();
        this._gameView.BindModel(this._gameDB);

        this._player1 = new Player();
        this._player2 = new Player();
        this._player1.Create(true,1);
        this._player2.Create(false,2);

        this._gameView.BindPlayer(this._player1,this._player2);
       
        // this._gameDB.on('init_poker', this._gameView.InitPokers, this._gameView);
        // this._gameDB.on('toSendArea', this._gameView.toSendArea, this._gameView);
        // this._gameDB.on('clickToSetArea',this._gameView.toSetArea, this._gameView);
        // this._gameDB.on('open_clickToSetArea', this._gameView.openSendTouch, this._gameView);
        // this._gameDB.on('off_clickToSetArea',this._gameView.offSendTouch, this._gameView);
        // this._gameDB.on('toPlayList', this._gameView.toPlayList, this._gameView);

        // this._gameView.on('sendArea_OnTouchedEnd',this._gameDB.toSetArea, this._gameDB);
        this._gameView.on('UIPokerOnTouch',this._gameDB.toSetArea,this._gameDB);
        this._gameDB.shuffle();
    },

    Play(){
        this._gameDB.toSendArea();
    },

    runGame(){

    },


    Exit(){
        this._gameView.UnbinModel();
        this._gameView.UnbindPlayer();
        this._gameDB.off('init_poker', this._gameView.OnEventInit);
        this._gameDB.off('toSendArea',this._gameView.toSendArea,this._gameView);
    },

});