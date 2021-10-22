import View from '../../GameFramework/MVC/View'

cc.Class({
    extends: View,

    properties: {
        id: 1,
        nickName: undefined,
        active: false,
        AIcontrl: false,
    },

    Create(active,id,nickName=undefined){
        this.active = active;
        this.id = id;
        if(nickName === undefined) this.nickName = 'Player'+this.id.toString();
        else this.nickName = nickName;
    },

    SetName(name){
        this.nickName = name;
    }

});
