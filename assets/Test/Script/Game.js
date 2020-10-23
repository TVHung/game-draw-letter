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
        
        arrow: cc.Node,

        _appleNode: null,
        _isDone: false,
        _count: null,
        nextTutorial: 1,
        gameState: 1,
    },

    start(){
        // this.initEvent();
        this.initEventListener();
        
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
        var x = 0;
        while(arr_c[x].x != null){
            newApple = cc.instantiate(this.apple);
            newApple.setPosition(arr_c[x].x, arr_c[x].y);
            newApple.getComponent('Apple').game = this;
            newApple.getComponent('Apple')._index = x;
            // newApple.opacity = 0;
            this.node.addChild(newApple);
            newApple.zIndex = x;
            x++;
        }
    },

    spawnNewArrow(){

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
        if(this.node.children[15].active === false && this.gameState === 1){
            let i; 
            let check = true;
            for(i = 10; i < 15; i++){
                if(this.node.children[i].active === true){
                    check = false;
                    break;
                }
            }
            console.log(check);
            if(check === true){
                this.checkStrokeOrder(2);
                setTimeout(()=>{
                    this.brush.getComponent('Brush').clear();
                    cc.find("Canvas/A1").active = true; 
                }, 500);
                this.gameState = this.gameState + 1;
            }else{
                setTimeout(()=>{
                    cc.director.loadScene("Test");
                }, 500);
            }
        }
        if(this.node.children[20].active === false && this.gameState === 2){
            let i; 
            let check = true;
            for(i = 10; i < 20; i++){
                if(this.node.children[i].active === true){
                    check = false;
                    break;
                }
            }
            console.log(check);
            if(check === true){
                this.checkStrokeOrder(3);
                setTimeout(()=>{
                    this.brush.getComponent('Brush').clear();
                    cc.find("Canvas/A2").active = true;
                }, 500);
                this.gameState = this.gameState + 1;
            }else{
                setTimeout(()=>{
                    cc.director.loadScene("Test");
                }, 500);
            }
        }
        //check hoan thanh
        if(this.node.children[22].active === false && this.gameState == 3){
            let i; 
            let check = true;
            for(i = 10; i < 22; i++){
                if(this.node.children[i].active === true){
                    check = false;
                    break;
                }
            }
            console.log(check);
            if(check === true){
                setTimeout(()=>{
                    this.brush.getComponent('Brush').clear();
                    cc.find("Canvas/A3").active = true;
                }, 500);
            }else{
                setTimeout(()=>{
                    cc.director.loadScene("Test");
                }, 500);
            }
            console.log("game over");
            this.gameState = this.gameState + 1;
            setTimeout(()=>{
                cc.director.loadScene("Test");
            }, 3000);
        }
    },
});
