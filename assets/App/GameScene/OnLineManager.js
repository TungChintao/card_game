import global from "../Global/global";
import { URL } from "../Global/ConfigEsum";
import { Area } from "../Global/ConfigEsum";
import { PokerSuit } from "../Global/ConfigEsum";
import { POINT_MAP } from "../Global/ConfigEsum";
import { REVERSE_POINT_MAP } from "../Global/ConfigEsum";
import Model from "../../GameFramework/MVC/Model";


export default class OnLineManager extends Model{

    _gameModel = null;
    _gameRound = null;

    _timeID = null;

    _dataStr = null;
    _lastMessageFlag = false;
 

    BindModel(model){
        this._gameModel = model;
    };

    UnBindModel(){
        this._gameModel = null;
    };

    BindRound(gameRound){
        this._gameRound = gameRound;
    };

    UnBindRound(){
        this._gameRound = null;
    };

    // 自己点击抽牌区卡牌
    DealPokerOnTouch(){
        this.executeOperation();
    };


    // 处理获得的response  获取想要的信息
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

    // 处理对方操作，反应到前端界面上
    DealOpponentPoker(){
        this._timeID = setInterval(()=>{
            this.GetOpponentPoker();
            if(global.yourTurn){ 
                clearInterval(this._timeID);
                this._gameRound.onlineRoundTurn();  
            }
        },900);
    };


    // 获取对方操作
    GetOpponentPoker(){
        this.fetchOperation();      
        // cc.log(global.yourTurn);
        if(global.yourTurn){
            let data = this.parseData();
            data.point = REVERSE_POINT_MAP[data.point];
            let dealPoker = null;
            if(data.area == Area.sendArea){ 
                this._gameModel.drawPoker(data.suit,data.point)
                dealPoker = this._gameModel.sendTopPoker();
            }
            else if(data.area == Area.player2List) 
                dealPoker = this._gameModel.playerGroupTopPoker(1,data.suit);
            this._gameModel.toSetArea(data.area,1,dealPoker,data.suit);
        }
    };

    DealSelfPoker(pokerSuit,pokerPoint,pokerArea){
        // this._gameRound.onlineRoundTurn();
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
        if(this._lastMessageFlag) url = URL.fetchOpUrl + global.selfRoomInfo
        let xhr = this.InitXhr(url,'GET');
        xhr.send();

        xhr.onreadystatechange = ()=>{
            if(xhr.readyState == 4 && xhr.status == 200){
                let returnData = JSON.parse(xhr.responseText);
                //cc.log(returnData);
                if(returnData.code == 200){
                    if(this._lastMessageFlag){
                        global.yourTurn = true;
                        this._dataStr = returnData.data.last;
                        return;
                    }
                    if(returnData.data.your_turn){
                        global.yourTurn = returnData.data.your_turn;
                        this._dataStr = returnData.data.last_code;
                    }
                }
                else if(returnData.code == 400){
                    this._lastMessageFlag = true;
                }
            }
        }
    };

    // 执行操作
    executeOperation(type=-1,suit=-1,point=-1){
        let data = null;
        if(type == 0)
            data = `type=${type}`;
        else if(type == 1){
            let tempdata = suit+point;
            data = `type=${type}&card=${tempdata}`;
        }
        // cc.log(data);
        let url = URL.executeOpUrl + global.selfRoomInfo;
        let xhr = this.InitXhr(url,'PUT',true);
        xhr.send(data);
        xhr.onreadystatechange = () =>{
            if(xhr.readyState == 4 && xhr.status == 200){
                let returnData = JSON.parse(xhr.responseText);
                // cc.log(returnData);
                if(returnData.code === 200){
                 
                    if(data == null){
                        //cc.log(returnData);
                        this._dataStr = returnData.data.last_code;
                        let data = this.parseData();
                        data.point = REVERSE_POINT_MAP[data.point];
                        this._gameModel.drawPoker(data.suit,data.point);
                        let dealPoker = this._gameModel.sendTopPoker();
                        this._gameModel.toSetArea(data.area,0,dealPoker, data.suit);
                    }
                }
            }
        }
    };

    Exit(){
        clearInterval(this._timeID);
        this.UnBindRound();
        this.UnBindModel();
    }

}
