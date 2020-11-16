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

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },

    clickButtonLetter(event, customEventData){
        console.log(customEventData);
        cc.director.loadScene("DrawLetter");
    }


    // update (dt) {},
});
// if(this.apples[arr[2][this.letterIndex].split(" ")[this.nextStep - 1]].active === false && checkNext === true && this._isGameOver === false){
//     setTimeout(()=>{
//         this.brush.getComponent('Brush').clear();
//         if(this.nextStep === 2)
//             this.net1.getComponent(cc.Animation).play();
//         if(this.nextStep === 3)
//             this.net2.getComponent(cc.Animation).play();
//         this.tutorialScript.string = "Bạn vẽ đúng rồi vẽ nét thứ " + (this.nextStep) + " nhé!";
//     }, 500);
//     setTimeout(()=>{
//         this.tutorial.getComponent(cc.Animation).play('net'+ (this.nextStep) + '_A');
//     }, 1500);
//     this.nextStep = this.nextStep + 1;
// }