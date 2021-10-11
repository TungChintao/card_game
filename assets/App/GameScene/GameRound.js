import Model from "../../GameFramework/MVC/Model";

export default class GameRound extends Model{
    round = 0;
    _player = [];
    _AIplayer = null;

    constructor(){
        super();
        this.round = 0;
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

    roundTurn(){
        this._player[this.round].active = false;
        this.round = (this.round+1) % 2;
        this._player[this.round].active = true;
        if(this._player[this.round].AIcontrl) {
            // this.emit('AiDealCard',this.round);
            // cc.log('contrl round');
            setTimeout(()=>{this._AIplayer.DealCard(this.round)},3500);
        }
    };

    judgePlayerActive(){
        if(this._player[this.round].active) return true;
        return false;
    };

    
}