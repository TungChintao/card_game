import GameView from "./GameView/GameView"
import GameDB from "GameDB";

var GameCtrl = cc.Class({
    extends: cc.Component,
    
    properties:{

        _gameDB: GameDB,

        _gameView: GameView,

    },

    Init(gameView){
        this._gameView = gameView;
        this._gameDB = GameDB.Create();
        this._gameDB.shuffle();
        this._gameView.InitPokers(this._gameDB.pokers);
    },

    Play(){
        for(let i = 0;i<52;i++){
            poker = this._gameDB.toSendArea();
            this._gameView.toSendArea(poker, i);
        }

    },

    // Exit(){

    // },

});