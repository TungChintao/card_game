import {URL} from '../Global/ConfigEsum'
import global from '../Global/global'

cc.Class({
    extends: cc.Component,

    properties: {
        RoomPagePrefab: cc.Prefab,
        RoomInfoPrefab: cc.Prefab,
        // scrollView: cc.ScrollView,
        _spawnCount: 0, // how many items we actually spawn
        _totalCount: 0, // how many items we need for the whole list
        // _bufferZone: 0, // when item is away from bufferZone, we relocate it
        // _spacing: 0,
        // _topBottom: 0,

        curNum: 1,
        curTotal: 10,
        pageLabel: cc.Label,
        RoomPageView: cc.PageView,

        createBtn: cc.Button,
        returnBtn: cc.Button,
        nextPageBtn: cc.Button,
        lastPageBtn: cc.Button,
        toPageBtn: cc.Button,
        toRoomBtn: cc.Button,

        toPageNum: cc.EditBox,
        toRoomUuid: cc.EditBox,

        _private: false,
    },

    
    _createPage () {
        let page = cc.instantiate(this.RoomPagePrefab);
        page.position = new cc.v2(0, 0);
        return page;
    },

    onLoad(){
        global.fromWhichScene = 'RoomScene';
        this.createBtn.node.on('touchend', this.CreateRoom,this);
        this.returnBtn.node.on('touchend', this.returnStartScene, this);
        this.nextPageBtn.node.on('touchend',this.toNextPage,this);
        this.lastPageBtn.node.on('touchend',this.toLastPage,this);
        this.toPageBtn.node.on('touchend',this.toWantPage,this);
        this.toRoomBtn.node.on('touchend',this.JoinRoom,this);

        this._spawnCount = 6;
        this._totalCount = 30;
        this.curTotal = 1000;

        let page = this._createPage();
        this.addPageItem(page);
        this.RoomPageView.addPage(page);

        this._spawnCount = 5;

        let page2 = this._createPage();
        this.addPageItem(page2);
        this.RoomPageView.addPage(page2);
    },

    addPageItem(page){
        for(let i = 0;i<this._spawnCount;i++){
            let item = cc.instantiate(this.RoomInfoPrefab);
            page.addChild(item);
        }
    },

    addSingleItem(){

    },

    update () {
        // 当前页面索引
        this.pageLabel.string = `第${this.RoomPageView.getCurrentPageIndex()+1}/${this.curTotal}页`;
    },

    // 移动到固定页
    toWantPage() {
        if(this.toPageNume<0 || this.toPageNum>this.curTotal) return;
        // 第二个参数为滚动所需时间，默认值为 0.3 秒
        this.RoomPageView.scrollToPage(this.toPageNum.string-1);
    },


    // // 监听事件
    // onPageEvent (sender, eventType) {
    //     // 翻页事件
    //     if (eventType !== cc.PageView.EventType.PAGE_TURNING) {
    //         return;
    //     }
    //     console.log("当前所在的页面索引:" + sender.getCurrentPageIndex());
    // },

    toNextPage(){
        let nowPage = this.RoomPageView.getCurrentPageIndex();
        this.RoomPageView.scrollToPage(nowPage+1);
    },

    toLastPage(){
        let nowPage = this.RoomPageView.getCurrentPageIndex();
        this.RoomPageView.scrollToPage(nowPage-1);
    },


    CreateRoom(){
        global.waitTips = '等待对手加入中......'
        let data = `private=${this._private}`
        let xhr = new XMLHttpRequest();
        xhr.open('POST',URL.createRoomUrl, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + global.selfInfo.token);
        xhr.send(data);
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState == 4 && xhr.status == 200){
                let returnData = JSON.parse(xhr.responseText);
                global.selfRoomInfo = returnData.data.uuid;
                cc.log(returnData.data.uuid);
                this.toWaitScene();
            }
        }
        
    },

    JoinRoom(){
        cc.log(this.toRoomUuid.string);
        global.waitTips = '准备中......'
        global.selfRoomInfo = this.toRoomUuid.string;
        let xhr = new XMLHttpRequest();
        let url = URL.joinRoomUrl + this.toRoomUuid.string;
        xhr.open('POST',url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + global.selfInfo.token);
        xhr.send();
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState == 4 && xhr.status == 200){
                let returnData = JSON.parse(xhr.responseText);
                cc.log(returnData);
                this.toWaitScene();
            }
        }

    },

    judgeRoomStatus(){
        cc.log('ok');
    },

    returnStartScene(){
        cc.director.loadScene('StartScene');
    },

    toWaitScene(){
        cc.director.loadScene('WaitScene');
    },
});
