import Poker from "../View/Poker/Poker";
import GameView from "../View/GameView/GameView"

var GameCtrl = cc.Class({
    extends: cc.Component,
    
    properties:{
    
        pokers: [Poker],

        _gameView: GameView,

    },


    Init(gameView){
        this._gameView = gameView;
    },


    Start(){
        console.log('Start');

        for(let point = 1;point<=13;point++){
            for(let suit = 0;suit<4;suit++){
                let temp_poker = new Poker(point, suit);
                this.pokers.push(temp_poker);
            }
        }
        this._gameView.CreatePokers(this.pokers);
        console.log(this.pokers);

    },

});