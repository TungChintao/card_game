import Model from "../../GameFramework/MVC/Model";
import OnLine from "OnLine";
import global from "../Global/global";
import { Mode } from "../Global/ConfigEsum";

export default class GameRound extends Model{
    round = 0;
    _player = [];
    _AIplayer = null;
    _online = null;
    roundTurnMessage = ['你的回合','对手回合'];

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
        this.emit('TurnRoundMessage', this.roundTurnMessage[this.round]);
        if(this._player[this.round].AIcontrl) {
            // this.emit('AiDealCard',this.round);
            // cc.log('contrl round');
            setTimeout(()=>{this._AIplayer.DealCard(this.round)},1600);
            // this._AIplayer.DealCard(this.round);
        }
    };

    onlineRoundTurn(){
        this._player[0].active = !this._player[0].active;
        global.yourTurn = this._player[0].active;
        let roundMessage = this._player[0].active ? this.roundTurnMessage[0]: this.roundTurnMessage[1];
        this.emit('TurnRoundMessage', roundMessage);
        if(this._player[0].AIcontrl){
             setTimeout(()=>{this._AIplayer.DealCard(0)},900);
        }
    };

    Refresh(playerID){
        if(this._player[playerID].active)
            this._AIplayer.DealCard(this.round);//setTimeout(()=>{this._AIplayer.DealCard(this.round)},3000);
    };

    judgePlayerActive(){
        if(this._player[this.round].active) return true;
        return false;
        
    };

    
}