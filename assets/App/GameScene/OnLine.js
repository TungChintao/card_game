import global from "../Global/global";
import { URL } from "../Global/ConfigEsum";
import { Area } from "../Global/ConfigEsum";
import { PokerSuit } from "../Global/ConfigEsum";
import { POINT_MAP } from "../Global/ConfigEsum";
import { REVERSE_POINT_MAP } from "../Global/ConfigEsum";
import Model from "../../GameFramework/MVC/Model";


export default class OnLine extends Model{

    _gameModel = null;
    _gameRound = null;

    _dataStr = null;
    _firstCallModel = true;

    BindModel(model){
        this._gameModel = model;
    };

    UnBindModel(){
        this._gameModel = null;
    };

    BindRound(gameRound){
        this._gameRound = gameRound;
    };

    UnbindRound(){
        this._gameRound = null;
    };

    DealPokerOnTouch(){
        this.executeOperation();
       
    };

    parseData(){
        let [, area, poker] = this._dataStr.split(' ');
        let suit = poker[0];
        let data = {};
        if(poker.length == 3) data.point = poker[1]+poker[2];
        else data.point = poker[1];
        if(area == '0') data.area = Area.sendArea;
        else data.area = Area.player2List;
        if(suit == 'S') data.suit = PokerSuit.S;
        else if(suit == 'H') data.suit = PokerSuit.H;
        else if(suit == 'C') data.suit = PokerSuit.C;
        else data.suit = PokerSuit.D;
        // cc.log(`>>parse ${data}`);
        return data;
    };

    DealOpponentPoker(){
        let timeID = setInterval(()=>{
            this.GetOpponentPoker();
            if(global.yourTurn){ 
                clearInterval(timeID);
                this._gameRound.onlineRoundTurn();  
            }
        },600);
    };

    GetOpponentPoker(){
        // let timeID = setInterval(() => {this.fetchOperation();}, 3000);
        this.fetchOperation();
        // cc.log(global.yourTurn);
        if(global.yourTurn){
            // clearInterval(timeID);
            let data = this.parseData();
            data.point = REVERSE_POINT_MAP[data.point];
            let dealPoker = null;
            if(data.area == Area.sendArea){ 
                this._gameModel.exchangePoker(data.suit,data.point)
                poker = this._gameModel.sendTopPoker();
            }
            else if(data.area == Area.player2List) 
                dealPoker = this._gameModel.playerGroupTopPoker(1,data.suit);
            this._gameModel.toSetArea(data.area,1,dealPoker);
            this._firstCallModel = false;
        }
    };

    DealSelfPoker(pokerSuit,pokerPoint,pokerArea){
        cc.log('dealself')
        // this._gameRound.onlineRoundTurn();
        this._firstCallModel = true;
        let type = -1;
        let suit = '0';
        let point = pokerPoint;
        if(pokerPoint != 1) point = POINT_MAP[pokerPoint];
        if(pokerArea == Area.sendArea) type = 0;
        else type = 1;
        if(pokerSuit == 0) suit = 'S';
        else if(pokerSuit == 1) suit = 'H';
        else if(pokerSuit == 2) suit = 'C';
        else suit = 'D'; 
        this.executeOperation(type,suit,point);
    }

    InitXhr(url,method,parm=false){
        let xhr = new XMLHttpRequest();
        xhr.open(method,url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + global.selfInfo.token);
        if(parm) xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        return xhr;
    };

    fetchOperation(){
        let url = URL.fetchOpUrl + global.selfRoomInfo + '/last';
        let xhr = this.InitXhr(url,'GET');
        xhr.send();

        xhr.onreadystatechange = ()=>{
            if(xhr.readyState == 4 && xhr.status == 200){
                let returnData = JSON.parse(xhr.responseText);
                // cc.log(returnData);
                if(returnData.code == 200 && returnData.data.your_turn){             
                    global.yourTurn = returnData.data.your_turn;
                    this._dataStr = returnData.data.last_code;
                }
            }
        }
    };

    executeOperation(type=-1,suit=-1,point=-1){
        let data = null;
        if(type == 0)
            data = `type=${type}`;
        else if(type == 1){
            let tempdata = suit+point;
            data = `type=${type}&card=${tempdata}`;
        }
        cc.log(data);
        let url = URL.executeOpUrl + global.selfRoomInfo;
        let xhr = this.InitXhr(url,'PUT',true);
        xhr.send(data);
        xhr.onreadystatechange = () =>{
            if(xhr.readyState == 4 && xhr.status == 200){
                let returnData = JSON.parse(xhr.responseText);
                if(returnData.code === 200){
                    cc.log(returnData);
                    if(data == null){
                        this._dataStr = returnData.data.last_code;
                        let data = this.parseData();
                        data.point = REVERSE_POINT_MAP[data.point];
                        this._gameModel.exchangePoker(data.suit,data.point);
                        let dealPoker = this._gameModel.sendTopPoker();
                        this._gameModel.toSetArea(data.area,0,dealPoker);
                    }
                }
            }
        }
    };
    


}
