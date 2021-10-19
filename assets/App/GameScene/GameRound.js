import Model from "../../GameFramework/MVC/Model";
import OnLine from "OnLine";
import global from "../Global/global";
import { Mode } from "../Global/ConfigEsum";

export default class GameRound extends Model{
    round = 0;
    _player = [];
    _AIplayer = null;
    _online = null;

    constructor(){
        super();
        this.round = 0;
        this._online = new OnLine();
        this.on('GameOver', this.roundOver,this);
    };

    BindPlayer(player1,player2){
        this._player.push(player1);
        this._player.push(player2);
    };

    UnBindPlayer(){
        this._player = [];
    };

    BindAI(ai){
        this._AIplayer = ai;
        this._AIplayer.on('AiDealCard', this._AIplayer.DealCard, this._AIplayer);
    };

    UnBindAI(){
        this._AIplayer.on('AiDealCard', this._AIplayer.DealCard, this._AIplayer);
        this._AIplayer = null;
    };

    localRoundTurn(){
        this._player[this.round].active = false;
        this.round = (this.round+1) % 2;
        this._player[this.round].active = true;
        if(this._player[this.round].AIcontrl) {
            // this.emit('AiDealCard',this.round);
            // cc.log('contrl round');
            setTimeout(()=>{this._AIplayer.DealCard(this.round)},3000);
        }
    };

    onlineRoundTurn(){
        this._player[0].active = !this._player[0].active;
        global.yourTurn = this._player[0].active;
    };

    Refresh(playerID){
        if(this._player[playerID].active)
            setTimeout(()=>{this._AIplayer.DealCard(this.round)},3000);
    };

    judgePlayerActive(){
        if(this._player[this.round].active) return true;
        return false;
        
    };

    
}