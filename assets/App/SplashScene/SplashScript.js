import global from '../Global/global'
import {URL} from '../Global/ConfigEsum'

let SplashScript = cc.Class({
    extends: cc.Component,

    properties: {

        label: {
            default: null,
            type: cc.Label
        },
    },

    onLoad(){

    },

    start(){
        this.label.string = global.splashLabel;
        
        if(global.toWhichScene === 'RoomScene'){
            let page_size = '6';
            let page_num = '1';
            let data = `?page_size=${page_size}&page_num=${page_num}`;
            let url = URL.fetchRoomList + data;
            let xhr = new XMLHttpRequest();
            xhr.open('GET',url);
            xhr.setRequestHeader('Authorization', 'Bearer ' + global.selfInfo.token);
            xhr.send();
            xhr.onreadystatechange = ()=>{
                if(xhr.readyState == 4 && xhr.status == 200){
                    let returnData = JSON.parse(xhr.responseText);
                    cc.log(returnData.data);
                    cc.director.loadScene('RoomScene');
                }
            }

        }
        else{
            setTimeout(() => {
                cc.director.loadScene(global.toWhichScene, ()=>{
                    console.log('>> on Start Scene Launched Callback!');
                })
            }, 1000)
        }
    },
    
});



