// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        btnLetters: {
            default: [],
            type: cc.Button
        },
    },

    onLoad(){
        window.letterDraw = "";
    },

    clickButtonLetter(event, customEventData){
        cc.sys.localStorage.setItem('letter', customEventData);    //set key, value
        cc.director.loadScene("DrawLetter");
    }
});