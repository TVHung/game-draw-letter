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

        paint: cc.Node,

        check: {
            default: null,
            type: cc.Prefab         
        },

        apple: {
            default: null,
            type: cc.Prefab         
        },

        apples: {
            default: [],
            type: cc.Prefab
        },

        tutorial: {
            default: null,
            type: cc.Node
        },

        arrCollider: {
            default: [],
            type: cc.PolygonCollider
        },

        tutorialScript: {
            default: null,
            type: cc.Label
        },

        gameScore: {
            default: null,
            type: cc.Label
        },

        scoretable:{
            default: null,
            type: cc.Label
        },

        countDown: {
            default: null,
            type: cc.Prefab
        },

        timeRollerBar: {            //thanh hiển thị thời gian
            default: null,
            type: cc.Sprite
        },

        timeRollerStep: {           //bước nhảy của time
            default: 0,
            range: [0, 2, 0.1],
            slide: true
        },
    
        icon: {                     //icon 
            default: null,
            type: cc.SpriteAtlas
        },

        tableLetter: {
            default: null,
            type: cc.Node
        },

        tableLetterAtlas: {              //list con chuột
            default: null,
            type: cc.SpriteAtlas
        },

        _appleNode: null,
        _isGameOver: false,
        _win: false,
        nextStep: 0,
        touchBorder: false,
        sceneNext: 1,
        sizeCollider: 20,
        letter: "A",                //chu se duoc ve
        strockCount: 0,
        letterIndex: 0,
        netthu: 1,
        sizeFillDraw: 130,
        score: 0,
        scoreTable: 0,


        //phần này xử lý lấy tọa độ ko liên quan
        arrPosition: "",
        posXcurrent: 0,
        posYcurrent: 0,
        posXpre: 0,
        posYpre: 0,
        count: 0,
        countChoice: 1,
    },

    start(){   
        
        
    },

    onLoad () {
        cc.director.getCollisionManager().enabled = false;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.debug.setDisplayStats(false);

        this.initEventListener();
        //mang kiem tra so net ve
        arr = new Array();
        arr[0] = new Array("A","B"); //loai chu
        arr[1] = new Array( 3 , 3 ); //so net ve
        arr[2] = new Array("7 14", "7 13");

        arr_c = new Array();

        this.gameScore.string += this.score;
        this.getPropertyLetter(arr);
        this.startTimeRoller();                         //chay tat ca game    
        // console.log(cc.director.getScene().name);
    },

    resetGameData(){
        this.nextStep = 1;
        this.tutorial.opacity = 0;
        this.timeRollerBar.fillStart = 0;

        //phần lấy tọa độ
        this.arrPosition = "";
        this.countChoice = 1;
        this.count = 0;
    },
    //bắt đầu con lăn thời gian
    //ham nay se chay dau tien cho man
    startTimeRoller () {
        this.getSceneCurrent();
        this.LetterCurrentMap();
        this.resetGameData();

        var times = 3; 
        this.schedule(()=> {    
            if (times !== 0) {
                if (!this.countDownNode) {
                    this.countDownNode = cc.instantiate(this.countDown);
                    this.node.addChild(this.countDownNode);
                }
                this.countDownNode.getChildByName("Sp Num").opacity = 255;
                this.countDownNode.getChildByName("Nodes start").opacity = 0;
                let spriteFrameName = "num_" + times;
                this.countDownNode.getChildByName("Sp Num").getComponent(cc.Sprite).spriteFrame = this.icon.getSpriteFrame(spriteFrameName);
                
            }   
            else {
                this.countDownNode.getChildByName("Sp Num").opacity = 0;
                this.countDownNode.getChildByName("Nodes start").opacity = 255;
                this.schedule(this.countDownScheduleCallBack, this.timeRollerStep);
                this.startGame();
            }
            times--;
        }, 0.1, 3);  //1: mỗi giây 1 lần, 3 là repeat
    },

    //get man choi
    getSceneCurrent(){
        console.log("scene: " + this.sceneNext);
        if(this.sceneNext > 1){
            var i = 0;
            var j = this.apples.length;
            while(i < j + 1){
                this.apple.active = true;
                this.apple.getComponent("Apple")._isLive = true;
                this.apple.opacity = 100;
                i++;
            }
            console.log(this.apples);
        }
        
        if(this.sceneNext === 1){
            var table = "table" + this.letter + "3";
            this.tableLetter.getComponent(cc.Sprite).spriteFrame = this.tableLetterAtlas.getSpriteFrame(table);
            this.arr_c = [{'x':13, 'y':208}, {'x':-22, 'y':154}, {'x':-41, 'y':100}, {'x':-60, 'y':46}, {'x':-80, 'y':-8}, {'x':-99, 'y':-62}, {'x':-118, 'y':-117}, {'x':-138, 'y':-171}, {'x':48, 'y':154}, {'x':66, 'y':100}, {'x':84, 'y':46}, {'x':102, 'y':-8}, {'x':121, 'y':-62}, {'x':139, 'y':-117}, {'x':157, 'y':-171}, {'x':-40, 'y':-80}, {'x':10, 'y':-80}, {'x':60, 'y':-80}];
            
            this.sizeFillDraw = 126;
            // this.sizeCollider = 15;
            this.spawnNewApple(this.arr_c, 2);
        }
        if(this.sceneNext === 2){
            var table = "table" + this.letter + "2";
            this.tableLetter.getComponent(cc.Sprite).spriteFrame = this.tableLetterAtlas.getSpriteFrame(table);
            this.arr_c = [{'x':13, 'y':170}, {'x':-18, 'y':126}, {'x':-34, 'y':81}, {'x':-49, 'y':36}, {'x':-65, 'y':-9}, {'x':-81, 'y':-54}, {'x':-96, 'y':-98}, {'x':-112, 'y':-143}, {'x':45, 'y':126}, {'x':60, 'y':81}, {'x':74, 'y':36}, {'x':89, 'y':-9}, {'x':103, 'y':-54}, {'x':118, 'y':-98}, {'x':133, 'y':-143}, {'x':-30, 'y':-65}, {'x':16, 'y':-65}, {'x':62, 'y':-66}];
            this.sizeFillDraw = 105;
            // this.sizeCollider = 15;
            this.setPositionApple(this.arr_c, 1.5);
        }
        if(this.sceneNext === 3){
            var table = "table" + this.letter + "1";
            this.tableLetter.getComponent(cc.Sprite).spriteFrame = this.tableLetterAtlas.getSpriteFrame(table);
            this.arr_c = [{'x':13, 'y':108}, {'x':-8, 'y':80}, {'x':-18, 'y':52}, {'x':-28, 'y':24}, {'x':-39, 'y':-4}, {'x':-49, 'y':-32}, {'x':-59, 'y':-60}, {'x':-69, 'y':-88}, {'x':33, 'y':80}, {'x':42, 'y':52}, {'x':52, 'y':24}, {'x':62, 'y':-4}, {'x':71, 'y':-32}, {'x':81, 'y':-60}, {'x':91, 'y':-88}, {'x':-16, 'y':-45}, {'x':13, 'y':-45}, {'x':41, 'y':-44}];
            this.sizeFillDraw = 72;
            // this.sizeCollider = 15;
            this.setPositionApple(this.arr_c, 1);
        }
        if(this.sceneNext === 4){
            var table = "table" + this.letter + "3";
            this.tableLetter.getComponent(cc.Sprite).spriteFrame = this.tableLetterAtlas.getSpriteFrame(table);
            this.arr_c = [{'x':13, 'y':208}, {'x':-22, 'y':154}, {'x':-41, 'y':100}, {'x':-60, 'y':46}, {'x':-80, 'y':-8}, {'x':-99, 'y':-62}, {'x':-118, 'y':-117}, {'x':-138, 'y':-171}, {'x':48, 'y':154}, {'x':66, 'y':100}, {'x':84, 'y':46}, {'x':102, 'y':-8}, {'x':121, 'y':-62}, {'x':139, 'y':-117}, {'x':157, 'y':-171}, {'x':-40, 'y':-80}, {'x':10, 'y':-80}, {'x':60, 'y':-80}];
            
            this.sizeFillDraw = 126;
            // this.sizeCollider = 15;
            this.setPositionApple(this.arr_c, 2);
        }
        if(this.sceneNext === 5){
            var table = "table" + this.letter + "2";
            this.tableLetter.getComponent(cc.Sprite).spriteFrame = this.tableLetterAtlas.getSpriteFrame(table);
            this.arr_c = [{'x':13, 'y':170}, {'x':-18, 'y':126}, {'x':-34, 'y':81}, {'x':-49, 'y':36}, {'x':-65, 'y':-9}, {'x':-81, 'y':-54}, {'x':-96, 'y':-98}, {'x':-112, 'y':-143}, {'x':45, 'y':126}, {'x':60, 'y':81}, {'x':74, 'y':36}, {'x':89, 'y':-9}, {'x':103, 'y':-54}, {'x':118, 'y':-98}, {'x':133, 'y':-143}, {'x':-30, 'y':-65}, {'x':16, 'y':-65}, {'x':62, 'y':-66}];

            this.sizeFillDraw = 105;
            // this.sizeCollider = 15;
            this.setPositionApple(this.arr_c, 1.5);
        }
        if(this.sceneNext === 6){
            var table = "table" + this.letter + "1";
            this.tableLetter.getComponent(cc.Sprite).spriteFrame = this.tableLetterAtlas.getSpriteFrame(table);
            this.arr_c = [{'x':13, 'y':108}, {'x':-8, 'y':80}, {'x':-18, 'y':52}, {'x':-28, 'y':24}, {'x':-39, 'y':-4}, {'x':-49, 'y':-32}, {'x':-59, 'y':-60}, {'x':-69, 'y':-88}, {'x':33, 'y':80}, {'x':42, 'y':52}, {'x':52, 'y':24}, {'x':62, 'y':-4}, {'x':71, 'y':-32}, {'x':81, 'y':-60}, {'x':91, 'y':-88}, {'x':-16, 'y':-45}, {'x':13, 'y':-45}, {'x':41, 'y':-44}];

            this.sizeFillDraw = 72;
            // this.sizeCollider = 15;
            this.setPositionApple(this.arr_c, 1);
        }
        if(this.sceneNext === 7){
            this.onCLickExit();
        }
        // console.log(this.apples);
    },

    startGame(){
        
        cc.director.getCollisionManager().enabled = true;
        this.netthu = this.sceneNext * 3 - 2;               //xac dinh duoc net tutorial
        setTimeout(()=>{
            this.countDownNode.getChildByName("Nodes start").opacity = 0;
            this.tutorial.opacity = 255;
            this.tutorial.getComponent(cc.Animation).play('net'+ (this.netthu) + '_' + this.letter);
            // this.tutorial.getComponent(cc.Animation).play('net10_A');
            this.netthu++;
            this.tutorialScript.string = 'Hãy vẽ theo hướng mũi tên, chú ý không vẽ ra ngoài nhé!';
            this.onCheckTouchBorder();
        }, 500);
    },

    LetterCurrentMap(){
        for(var i = 1; i <= 6; i++){
            var letterCurrent = "Letter" + i;   
            if(i < this.sceneNext){
                cc.find("Canvas/Main game/Bg A/TableMap/" + letterCurrent + "/LetterDrawed").active = true;
                cc.find("Canvas/Main game/Bg A/TableMap/" + letterCurrent + "/LetterDrawing").active = false;
                cc.find("Canvas/Main game/Bg A/TableMap/" + letterCurrent + "/LetterDraw").active = false;
            }else if(i == this.sceneNext){
                cc.find("Canvas/Main game/Bg A/TableMap/" + letterCurrent + "/LetterDrawed").active = false;
                cc.find("Canvas/Main game/Bg A/TableMap/" + letterCurrent + "/LetterDrawing").active = true;
                cc.find("Canvas/Main game/Bg A/TableMap/" + letterCurrent + "/LetterDraw").active = false;
            }else{
                cc.find("Canvas/Main game/Bg A/TableMap/" + letterCurrent + "/LetterDrawed").active = false;
                cc.find("Canvas/Main game/Bg A/TableMap/" + letterCurrent + "/LetterDrawing").active = false;
                cc.find("Canvas/Main game/Bg A/TableMap/" + letterCurrent + "/LetterDraw").active = true;
            }
        }
    },

    getPropertyLetter(arr){
        var i = 0;
        while(arr[0][i] != this.letter){
            i++;
        }
        this.strockCount = arr[1][i];
        this.letterIndex = i;
        console.log(this.letterIndex);

    },

    initEventListener () {    
        this.node.on(cc.Node.EventType.MOUSE_MOVE, (event)=>{     
            this.onBeCreateNodeCheckEvent(event.getLocation());      
        },this);  

        this.node.on(cc.Node.EventType.TOUCH_START, (event)=>{
            var pos = this.node.convertToNodeSpaceAR(event.getLocation());
            this.brush.getComponent('Brush').setBrushPos(pos.x, pos.y); 
        },this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{  
            this.brush.getComponent('Brush').setBrushLineWidth(20);
            this.onCheckClick(); 
            var pos = this.node.convertToNodeSpaceAR(event.getLocation());
            if(this.touchBorder === false){
                this.brush.getComponent('Brush').drawTo(pos.x, pos.y);
            }
            this.onBeCreateNodeCheckEvent(event.getLocation()); 
        },this);

        this.node.on(cc.Node.EventType.TOUCH_END, (event)=>{  
            this.brush.getComponent('Brush').close();
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

    spawnNewApple(arr_c, scale) {
        var i = 0;
        while(arr_c[i] != null){
            newApple = cc.instantiate(this.apple);
            newApple.setPosition(arr_c[i].x, arr_c[i].y);
            newApple.getComponent('Apple').game = this;
            this.apples[i] = newApple;                  //them vo mang
            // this.apples[i].opacity = 0; 
            this.node.addChild(newApple);
            this.apples[i].scale = scale;
            this.apples[i]._components[3].radius = this.sizeCollider;           //set size collider cho cac man khac nhau
            // console.log(this.apples[i]._components[3].radius);  //lấy ra độ lớn collider
            i++;
        }
    },

    setPositionApple(arr_c, scale){
        var i = 0;
        while(arr_c[i] != null){
            this.apples[i].setPosition(arr_c[i].x, arr_c[i].y);
            this.apples[i].active = true;
            this.apples[i].scale = scale;
            this.apples[i].opacity = 255;
            i++;
        }
    },

    deytroyAllNode(){
        var i = 0;
        var j = this.apples.length;
        while(i < j){
            this.apples[i].opacity = 0;

            i++;
        }
    },

    onCheckClick(){
        if(this.apple.getComponent("ColliderManager")._isCollider === true){
            this.apple.opacity = 0;
            this.apple.active = false;
            this.apple.getComponent("Apple")._isLive = false;
        }
    },

    onFinishGameEvent(){ 
        cc.director.getCollisionManager().enabled = false;
        this.deytroyAllNode();
        this.unschedule(this.countDownScheduleCallBack);
        this.sceneNext++;
        this.nextStep = 10;
        if(this._win === true){
            this.score += 100 - Math.ceil(this.timeRollerBar.fillStart * 100);
            this.scoretable.string = 100 - Math.ceil(this.timeRollerBar.fillStart * 100);
            this.gameScore.string = this.score;
        }else{

        }
        setTimeout(()=>{
            cc.find("Canvas/Game over").active = true; 
        }, 2000); 
        
    },

    onClickNext(){
        cc.find("Canvas/Game over").active = false;    
        this.paint.getComponent('Brush').clear();
        this.brush.getComponent('Brush').clear();
        if(this._win === false){
            this.sceneNext++;
        }
        this.startTimeRoller();
    },

    onClickPre(){
        cc.find("Canvas/Game over").active = false;    
        this.paint.getComponent('Brush').clear();
        this.brush.getComponent('Brush').clear();
        // this.sceneNext--;
        this.startTimeRoller();
    },

    onClickReplay(){
        cc.find("Canvas/Game over").active = false;    
        this.paint.getComponent('Brush').clear();   
        this.brush.getComponent('Brush').clear();
        this.sceneNext--;
        this.startTimeRoller();
    },

    onCheckTouchBorder(){
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (touch, event) {
            var touchLoc = touch.getLocation();
            var i = 0;
            // console.log((touchLoc.x - cc.winSize.width/2)+ ", " + (touchLoc.y - cc.winSize.height/2));
            // console.log(this.arr_c[i].x + ", " + this.arr_c[i].y);
            // while(this.arr_c[i] != null){
            //     var distance = this.distanceTwoVecto(touchLoc.x - cc.winSize.width/2, touchLoc.y - cc.winSize.height, this.arr_c[i].x, this.arr_c[i].y);
            //     console.log(distance);
            //     var minDistance = 10000;
            //     if(distance < minDistance){
            //         minDistance = distance;
            //     }
            //     i++;
            // }
            // if(minDistance > 60){
            //     this.touchBorder = true;
            //     console.log("Cham ra ngoai");
            //     console.log(minDistance);
            // }
            if (cc.Intersection.pointInPolygon(touchLoc, this.arrCollider[0].world.points) || cc.Intersection.pointInPolygon(touchLoc, this.arrCollider[1].world.points)) {
                this.touchBorder = true;
                this.tutorialScript.string = 'Bạn vẽ ra ngoài mất rồi vẽ lại đi nhé!';
                console.log("hit");
                checkNext = false;
                this._win = false;
                this.onFinishGameEvent();
            }
        }, this);
    },

    countDownScheduleCallBack () {
        this.timeRollerBar.fillStart += 0.05;
        if (this.timeRollerBar.fillStart === this.timeRollerBar.fillRange) {
            this.unschedule(this.countDownScheduleCallBack);
            if(this._win === true){
                // hoan thanh
            }else{
                // chua hoan thanh
            }
            // Thực thi chức năng hoàn thành trò chơi
            this.onFinishGameEvent();
        }
    },
    
    onCLickExit(){
        cc.director.loadScene("MainGame");
    },

    onClickBack(){
        cc.director.loadScene("MainGame");
    },

    //Lấy theo kiểu vị trí chia hết cho 8
    getPositionLetter(){
        var pos = this.tutorial.getPosition();
        pos.x = Math.ceil(pos.x);
        pos.y = Math.ceil(pos.y);
        this.count++;
        if((pos.x != this.posXcurrent || pos.y != this.posYcurrent) && this.count %8 === 0){
            this.posXcurrent = pos.x;
            this.posYcurrent = pos.y;
            this.countChoice ++;
            this.arrPosition += "{'x':" + pos.x + ", 'y':" + pos.y + "}, ";
            console.log(this.arrPosition);
            console.log(this.countChoice);
        }
    },
    //lay vi tri dua vao khoang cach
    getPositionUseDistance(){
        var pos = this.tutorial.getPosition();
        pos.x = Math.ceil(pos.x);
        pos.y = Math.ceil(pos.y);
        // console.log(pos.x + ", " + pos.y);
        if(this.count === 0){
            this.posXpre = pos.x;
            this.posYpre = pos.y;
            // console.log(this.posXpre + ", " + this.posYpre);
            this.arrPosition += "{'x':" + this.posXpre + ", 'y':" + this.posYpre + "}, ";
        }
        var MIN_POINT_DISTANCE = 28;

        this.posXcurrent = pos.x;
        this.posYcurrent = pos.y;
        
        var distance = this.distanceTwoVecto(this.posXpre, this.posYpre, this.posXcurrent, this.posYcurrent);
        distance = Math.ceil(distance);
        // console.log(distance);
        this.count++;
        if(distance > MIN_POINT_DISTANCE){
            this.posXpre = this.posXcurrent;
            this.posYpre = this.posYcurrent;

            this.countChoice ++;
            this.arrPosition += "{'x':" + this.posXpre + ", 'y':" + this.posYpre + "}, ";
            console.log(this.arrPosition);
            console.log(this.countChoice);
        }
    },
    
    distanceTwoVecto(x1, y1, x2, y2){
        var distance = Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
        return distance;
    },

    PaintFill(arrPaint, a, b, size){          //xac dinh diem dau va diem cuoi duoc ve
        this.paint.getComponent('Brush').setBrushPos(arrPaint[a].x, arrPaint[a].y);
        this.paint.getComponent('Brush').setBrushLineWidth(size);
        for(var i = a; i <= b; i++){
            this.paint.getComponent('Brush').drawTo(arrPaint[i].x, arrPaint[i].y);
        }
        this.paint.getComponent('Brush').close();
    },
    
    update(dt){
        // this.getPositionLetter();
        // this.getPositionUseDistance();
        if(this.sceneNext === 1){
            cc.find("Canvas/Main game/Bg A/Pre").active = false;
        }
        if(this.sceneNext === 7){
            cc.find("Canvas/Main game/Bg A/Next").active = false;
        }

        //kiểm tra xem người chơi có vẽ ngược hay không
        var checkNext = true;
        if(this._isGameOver === false){
            for(let i = 1; i <= this.apples.length - 1; i++){
                if(this.apples[i].active === false){
                    if(this.apples[i-1].active === true){
                        checkNext = false;
                        this._isGameOver = true;
                        this._win = false;
                        this.tutorialScript.string = 'Ôi bạn vẽ sai mất rồi vẽ lại đi nhé!';
                        this.onFinishGameEvent();
                    } 
                    
                }
            }
        }
        
        //hiển thị hướng dẫn các nét
        //check net thu nhat
        if(this.nextStep <= this.strockCount - 1){
            if(this.apples[arr[2][this.letterIndex].split(" ")[this.nextStep - 1]].active === false && checkNext === true && this._isGameOver === false){
                setTimeout(()=>{
                    this.brush.getComponent('Brush').clear();
                    if(this.nextStep === 2){
                        this.PaintFill(this.arr_c, 0, arr[2][this.letterIndex].split(" ")[0], this.sizeFillDraw);
                    }
                    if(this.nextStep === 3){
                        var a = new Number(arr[2][this.letterIndex].split(" ")[0]);
                        this.PaintFill(this.arr_c, a+1, arr[2][this.letterIndex].split(" ")[1], this.sizeFillDraw);
                    }
                    if(this.nextStep === 4){
                        var a = new Number(arr[2][this.letterIndex].split(" ")[1]);
                        this.PaintFill(this.arr_c, a+1, arr[2][this.letterIndex].split(" ")[2], this.sizeFillDraw);
                    }
                    if(this.nextStep === 5){
                        var a = new Number(arr[2][this.letterIndex].split(" ")[2]);
                        this.PaintFill(this.arr_c, a+1, arr[2][this.letterIndex].split(" ")[3], this.sizeFillDraw);
                    }

                    this.tutorialScript.string = "Bạn vẽ đúng rồi vẽ nét thứ " + (this.nextStep) + " nhé!";
                }, 500);
                setTimeout(()=>{
                    console.log("net: " + this.netthu);
                    this.tutorial.getComponent(cc.Animation).play('net'+ (this.netthu) + '_' + this.letter);
                    this.netthu++;
                }, 1500);
                this.nextStep = this.nextStep + 1;
            }

        }

        //check net cuoi
        if(this.apples[this.apples.length - 1].active === false && this.nextStep == this.strockCount && checkNext === true && this._isGameOver === false){
            setTimeout(()=>{
                this.brush.getComponent('Brush').clear();
                var a = new Number(arr[2][this.letterIndex].split(" ")[1]);
                this.PaintFill(this.arr_c, a+1, this.apples.length - 1, this.sizeFillDraw);
            }, 500);
            setTimeout(()=>{
                this.tutorialScript.string = 'Bạn đã hoàn thành, chúc mừng!';
            }, 1000);
            this.nextStep = this.nextStep + 1;
        }
       
        if(this.nextStep === this.strockCount + 1){
            this._win = true;
            this.onFinishGameEvent();
        }
    },
});
