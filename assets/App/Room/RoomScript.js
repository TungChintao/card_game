import {URL} from '../Global/ConfigEsum'
import global from '../Global/global'
import View from '../../GameFramework/MVC/View'

cc.Class({
    extends: View,

    properties: {
        RoomPagePrefab: cc.Prefab,
        RoomInfoPrefab: cc.Prefab,

        _spawnCount: 0, // how many items we actually spawn
        _page: [],
        _pageTurn: 0,

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
        // this.node.on('JoinRoomOnTouch',this.judgeRoomStatus,this);

        this._spawnCount = 6;
        this._totalCount = 30;
        this.curTotal = global.page_num;

        this._page[0] = this._createPage();
        this.addPageItem();
        this.RoomPageView.addPage(this._page[0]);

        this._page[1] = this._createPage();
        this.addPageItem();
        this.RoomPageView.addPage(this._page[1]);

        this._pageTurn = 0;
        this._nowPageNum = 0;

        // this._spawnCount = 5;

        // let page2 = this._createPage();
        // this.addPageItem(page2);
        // this.RoomPageView.addPage(page2);

        this.pageLabel.string = `第${this._nowPageNum+1}/${this.curTotal}页`;
    },

    addPageItem(){
        this._spawnCount = global.roomInfoList.length;
        for(let i = 0;i<this._spawnCount;i++){
            let item = cc.instantiate(this.RoomInfoPrefab);
            this._page[this._pageTurn].addChild(item);
            let itemView = item.getComponent("RoomItemView");
            itemView.initItem(global.roomInfoList[i]);
            itemView.on('JoinRoomOnTouch',this.judgeRoomStatus,this);
        }
        this._pageTurn = (this._pageTurn+1)%2;
    },

    removePageItem(){
        // let allPageItem = this._page[this._pageTurn].children;
        // for(let i = 0;i<allPageItem.length;i++){
        //     let itemView = allPageItem[i].getComponent("RoomItemView");
        //     itemView.removeFromPage();
        // }
        this._page[this._pageTurn].removeAllChildren();
    },

    update () {
        // 当前页面索引
        
        // this.pageLabel.string = `第${this.RoomPageView.getCurrentPageIndex()+1}/${this.curTotal}页`;
    },

    // 移动到固定页
    toWantPage() {
        if(this.toPageNume<0 || this.toPageNum>this.curTotal) return;
        // 第二个参数为滚动所需时间，默认值为 0.3 秒
        this._nowPageNum = this.toPageNum.string-1;
        this.RefreshPage();
    },

    RefreshPage(){
        let page_size = '6';
        let page_num = (this._nowPageNum+1).toString();
        let data = `?page_size=${page_size}&page_num=${page_num}`;
        let url = URL.fetchRoomList + data;
        let xhr = new XMLHttpRequest();
        xhr.open('GET',url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + global.selfInfo.token);
        xhr.send();
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState == 4 && xhr.status == 200){
                let returnData = JSON.parse(xhr.responseText);
                // cc.log(returnData.data);
                global.roomInfoList = returnData.data.games;
                global.page_num = returnData.data.total_page_num;
                // cc.log(global.roomInfoList);
                // let allPageItem = this._page[this._pageTurn].children;
                // for(let i = 0;i<global.roomInfoList.length;i++){
                //     let itemView = allPageItem[i].getComponent("RoomItemView");
                //     itemView.initItem(global.roomInfoList[i]);
                // }
                this.removePageItem();
                this.addPageItem();
                this.RoomPageView.scrollToPage(this._pageTurn);

                // 当前页面索引
                // this.RoomPageView.setCurrentPageIndex(pageNum);
                this.pageLabel.string = `第${this._nowPageNum+1}/${this.curTotal}页`;
               
            }
        }

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
        if(this._nowPageNum === global.page_num) return;
        this._nowPageNum += 1;
        this.RefreshPage();
        // this.RoomPageView.scrollToPage(nowPage+1);
    },

    toLastPage(){
        if(this._nowPageNum === 0) return;
        this._nowPageNum -= 1;
        // this.RoomPageView.scrollToPage(nowPage-1);
        this.RefreshPage();
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
                // cc.log(returnData);
                this.toWaitScene();
            }
        }

    },

    judgeRoomStatus(uuid){
        // cc.log(uuid);
        this.toRoomUuid.string = uuid;
        this.JoinRoom();
    },

    returnStartScene(){
        cc.director.loadScene('StartScene');
    },

    toWaitScene(){
        cc.director.loadScene('WaitScene');
    },
});
