import View from '../../GameFramework/MVC/View'

var Player = cc.Class({
    extends: View,

    properties: {
        id: 1,
        uid: 0,
        nickName: undefined,
        active: false,
        AIcontrl: false,
    },

    start(){

    },

    Create(active,id,nickName=undefined){
        this.active = active;
        this.id = id;
        if(nickName === undefined) this.nickName = 'Player'+this.id.toString();
        else this.nickName = nickName;
    },

    SetUid(uid){
        this.uid = uid;
    },

    SetName(name){
        this.nickName = name;
    }

});
