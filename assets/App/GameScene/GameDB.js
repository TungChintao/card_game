// import EventManger from "../../GameFramework/Event/EventManger";
import Model from "../../GameFramework/MVC/Model"
import UIUtil from "../../GameFramework/Util/UIUtil";
class Poker{
    // status 背面:true 正面：false
    // 0: heitao 1:hongtao 2:heimei 3:fangkuai

    _view = null;

    constructor(point, suit, status=true){
        this.point = point;
        this.suit = suit;
        this.status = status;
    };

    Bind(view){
        this._view = view;
    };

    unBind(){
        this._view = null;
    };

    get view(){
        return this._view;
    };
};

class PokerGroup{
    _pokers = [];

    AddPoker(poker){
        this._pokers.push(poker);
    }

    get pokers(){ return this._pokers;};
};


export default class GameDB extends Model{

    static CONST_PLAY_GROUPS = 4;
    
    // 原始扑克
    _pokers = [];
    // 抽牌区扑克
    _sendPokers = [];
    // 放置区扑克
    _setPokers = [];
    // 玩家扑克组
    _playerPokers = [[],[]];

    constructor(){
        super();
        for(let p = 0;p<2;p++){
            for(let i = 0;i<GameDB.CONST_PLAY_GROUPS; i++){
                let pokerGroup = new PokerGroup();
                this._playerPokers[p].push(pokerGroup);
            }
        }

        for(let point = 1;point<=13;point++){
            for(let suit = 0;suit<4;suit++){
                let temp_poker = new Poker(point, suit);
                this._pokers.push(temp_poker);
            }
        }
        console.log(this._pokers);
    };

    // 洗牌
    shuffle(){
        let i = this._pokers.length;
        while (i) {
            let j = Math.floor(Math.random() * i--);
            [this._pokers[j], this._pokers[i]] = [this._pokers[i], this._pokers[j]];
        } 
        this.emit('init_poker', this._pokers);
    };

    // 从初始位置到抽牌区
    toSendArea(){
        for(let i = 0;i<52;i++){
            // let poker = this._pokers[this._pokers.length-1];
            let poker = this._pokers.pop();
            this._sendPokers.push(poker);
            this.emit('toSendArea',poker,i);
            console.log(poker);
            // return this._pokers.pop();
        }
    };

    toSetArea(playerID){
        let sendLen = this._sendPokers.length-1;
        let setLen = this._setPokers.length-1;
        let poker = this._sendPokers[sendLen];
        let setSuit = -1;
        poker.status = !poker.status;
        if(setLen >= 0){
            setSuit = this._setPokers[setLen].suit;
        }
        if(sendLen <= 0)
            this.emit('off_clickToSetArea');

        this._setPokers.push(poker);

        this.emit('clickToSetArea',poker,this._setPokers.length);

        setTimeout(()=>{
            if(this._sendPokers.pop().suit === setSuit) {
                console.log(poker.suit,setSuit);
                this.toPlayList(playerID-1);
            }
        },1000);

       
        // return [this._sendPokers.pop(),this._setPokers.length,sendLen,suit];
    };

    toPlayList(id){
        setLen = this._setPokers.length;
        for(let i = 0;i < setLen; i++){
            let poker = this._setPokers.pop();
            console.log(poker);
            this._playerPokers[id][poker.suit].AddPoker(poker);
            this.emit('toPlayList', poker, i,setLen*0.1,id+1);
        }
    };


    get pokers() { return this._pokers; };
    get sendPokers() { return this._sendPokers; };
    get setPokers() { return this._setPokers; };
    get player1Pokers()　{ return this._player1Pokers; };
    get player2Pokers() { return this._player2Pokers; };

};
