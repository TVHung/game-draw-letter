// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        brush: cc.Node,

        check: {
            default: null,
            type: cc.Prefab         
        },

        apple: {
            default: null,
            type: cc.Prefab         
        },

        arrApple: [cc.Node],
        
        arrow: {
            default: null,
            type: cc.Prefab         
        },

        _appleNode: null,
        _isDone: false,
        _count: null,
        nextTutorial: 1,
        gameState: 1,
    },

    start(){
        this.initEventListener();
        this.node.getComponent("SoundManager").playBackGroundSound();   //play âm thanh
    },

    onLoad () {
        // không hiện fps
        cc.debug.setDisplayStats(false);
        this.arr_tutorial = [{"x":0,"y":140}, {"x":30,"y":100}, {"x":-30,"y":-60}];
        this.arr_c = [{"x":0,"y":140}, {"x":-30,"y":100}, {"x":-50,"y":50}, {"x":-70,"y":0}, {"x":-90,"y":-60}, {"x":-110,"y":-120}, {"x":30,"y":100}, {"x":50,"y":50}, {"x":70,"y":0}, {"x":90,"y":-60}, {"x":110,"y":-120}, {"x":-30,"y":-60}, {"x":30,"y":-60}];
        this.arr_strock = [0, 6, 11];
        this.checkStrokeOrder(1);
        this.spawnNewApple(this.arr_c);
    },

    initEventListener () {    
        this.node.on(cc.Node.EventType.MOUSE_MOVE, (event)=>{     
            this.onBeCreateNodeCheckEvent(event.getLocation());      
        },this);  

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{  
            this.onCheckClick();  
            let pos = this.node.convertToNodeSpaceAR(event.getLocation());  //convertToNodeSpaceAR: chuyển tọa độ vào nút
            this.brush.getComponent('Brush').drawTo(pos.x, pos.y);
            this.onBeCreateNodeCheckEvent(pos);   
        },this);

        this.node.on(cc.Node.EventType.TOUCH_START, (event)=>{     
            this.brush.getComponent('Brush').clear();
        },this);
        
        this.node.on(cc.Node.EventType.TOUCH_END, (event)=>{    
            // this.brush.getComponent('Brush').clear();
        },this);
    
    },

    onBeCreateNodeCheckEvent (position) {
        if (!cc.isValid(this.checkNode)) {                                          //cc.isValid: xác định xem giá trị đã chỉ định của đối tượng có hợp lệ hay không
            this.checkNode = cc.instantiate(this.check);                            //khởi tạo
            this.checkNode.zIndex = cc.macro.MAX_ZINDEX;
            this.checkNode.getComponent("ColliderManager")._isCollider = false;     //tạo khả năng va chạm
            this.node.addChild(this.checkNode);                                     //thêm node 
        }
        this.checkNode.opacity = 0;
        this.checkNode.position = this.node.convertToNodeSpaceAR(position);       
    },

    spawnNewApple(arr_c) {
        var i = 0;
        while(arr_c[i] != null){
            newApple = cc.instantiate(this.apple);
            newApple.setPosition(arr_c[i].x, arr_c[i].y);
            newApple.getComponent('Apple').game = this;
            // newApple.opacity = 0;
            this.node.addChild(newApple);
            i++;
        }
    },

    onClickButtonGreen(){
        this.color = cc.Color.GREEN;
        this.brush.getComponent('Brush').setBrushColor(this.color);
        this.brush.getComponent('Brush').setBrushLineWidth(50);
    },

    onCheckClick(){
        //this.checkNode.angle = this.checkNode.angle === 0 ? 30 : 0; 
        if(this._appleNode.getComponent("ColliderManager")._isCollider == true){
            this._appleNode.opacity = 0;
            this._appleNode.active = false;
            this._appleNode.getComponent("Apple")._isLive = false;
            // console.log(this._appleNode);
        }
    },

    //check thứ tự nét vẽ
    checkStrokeOrder(order){
        this.arrow.opacity = 0;
        setTimeout(()=>{
            this.arrow.opacity = 255;
            this.arrow.getComponent("Arrow").arrowTutorial(order);
            setTimeout(()=>{
                this.arrow.opacity = 0;
            }, 1500);
            console.log(this.node);
        }, 500);
    },

    onClickReload(){
        cc.director.loadScene("Test");
    },

    onClickStop(){

    },
    update(dt){
        //kiểm tra xem người chơi có vẽ ngược hay không
        var checkNext = true;
        for(let i = 22; i > 10; i--){
            if(this.node.children[i].active === false){
                for(let j = 10; j < i; j++){
                    if(this.node.children[j].active === true){
                        checkNext = false;
                        this.node.getComponent("SoundManager").pauseMusic();   //pause âm thanh
                        setTimeout(()=>{
                            
                        }, 1000);
                        cc.director.loadScene("Test");
                    }
                }
            }
        }

        //hiển thị hướng dẫn các nét
        if(this.node.children[15].active === false && this.gameState === 1 && checkNext === true){
            this.checkStrokeOrder(2);
            setTimeout(()=>{
                this.brush.getComponent('Brush').clear();
                cc.find("Canvas/A1").active = true; 
            }, 500);
            this.gameState = this.gameState + 1;
        }
        if(this.node.children[20].active === false && this.gameState === 2 && checkNext === true){
            this.checkStrokeOrder(3);
            setTimeout(()=>{
                this.brush.getComponent('Brush').clear();
                cc.find("Canvas/A2").active = true;
            }, 500);
            this.gameState = this.gameState + 1;
        }
        //check hoan thanh
        if(this.node.children[22].active === false && this.gameState == 3){
            setTimeout(()=>{
                this.brush.getComponent('Brush').clear();
                cc.find("Canvas/A3").active = true;
            }, 500);
            console.log("game over");
            this.gameState = this.gameState + 1;
            setTimeout(()=>{
                cc.director.loadScene("Test");
            }, 1000);
        }
    },
});
