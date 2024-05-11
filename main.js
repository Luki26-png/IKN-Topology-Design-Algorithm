class Node{//each node will represent a rectangle
    constructor(xPosition, yPosition, rectWidth, rectHeight, level){
        this.x = xPosition;
        this.y = yPosition;
        this.width = rectWidth;
        this.height = rectHeight;
        this.roadWidth = 24;
        this.level = level;
        this.children = [];
        //inside rect coordinate, index 0 =x, 1 = y
        this.topLeft = [this.x + this.roadWidth/2, this.y + this.roadWidth/2];

        this.topRight = [this.x + this.roadWidth/2 + this.width - this.roadWidth,
        this.y + this.roadWidth/2];

        this.bottomRight = [this.x + this.roadWidth/2 + this.width - this.roadWidth,
        this.y + this.roadWidth/2 + this.height- this.roadWidth];

        this.bottomLeft = [this.x + this.roadWidth/2, 
        this.y + this.roadWidth/2 + this.height- this.roadWidth];

        this.insideWidth = this.topRight[0] - this.topLeft[0];
        this.insideHeight = this.bottomLeft[1] - this.topLeft[1];
    }

    drawRect(){
        //context.strokeRect(this.x, this.y, this.width, this.height);
        //top and bottom
        for (let i = 0; i < 2; i++){

            context.lineWidth=this.roadWidth;
            context.strokeStyle='black'; 
            context.beginPath();
            context.moveTo(this.x, this.y + this.height * i);
            context.lineTo(this.x + this.width, this.y + this.height * i);
            context.stroke();

            context.lineWidth=2;
            context.strokeStyle='white';
            context.beginPath();
            context.moveTo(this.x, this.y + this.height * i);
            context.lineTo(this.x + this.width, this.y + this.height * i);
            context.stroke(); 
        }

        //left and right
        for (let i = 0; i < 2; i++) {

            context.lineWidth=this.roadWidth;
            context.strokeStyle='black'; 
            context.beginPath();
            context.moveTo(this.x + this.width * i, this.y);
            context.lineTo(this.x + this.width * i, this.y + this.height);
            context.stroke();

            context.lineWidth=2;
            context.strokeStyle='white';
            context.beginPath();
            context.moveTo(this.x + this.width * i, this.y);
            context.lineTo(this.x + this.width * i, this.y + this.height);
            context.stroke(); 
        }

    }

    drawIntersection(){
        context.fillStyle='black';
        //top-left
        //context.fillRect(this.x - (this.roadWidth/2), this.y - (this.roadWidth/2), this.roadWidth, this.roadWidth);
        //top-right
        //context.fillRect(this.x - (this.roadWidth/2) + this.width, this.y - (this.roadWidth/2), this.roadWidth, this.roadWidth);
        //bottom-left
        //context.fillRect(this.x - (this.roadWidth/2), this.y - (this.roadWidth/2) + this.height, this.roadWidth, this.roadWidth);
        //bottom-right
        //context.fillRect(this.x - (this.roadWidth/2) + this.width, this.y - (this.roadWidth/2) + this.height, this.roadWidth, this.roadWidth);

        //top-left
        context.beginPath();
        context.arc(this.x, this.y, (this.roadWidth/2), Math.PI / 180 * 0, Math.PI / 180 * 360, true);
        context.closePath();
        context.fill();
        //top right
        context.beginPath();
        context.arc(this.x + this.width, this.y, (this.roadWidth/2), Math.PI / 180 * 0, Math.PI / 180 * 360, true);
        context.closePath();
        context.fill();
        //bottom left
        context.beginPath();
        context.arc(this.x, this.y + this.height, (this.roadWidth/2), Math.PI / 180 * 0, Math.PI / 180 * 360, true);
        context.closePath();
        context.fill();
        //bottom right
        context.beginPath();
        context.arc(this.x + this.width, this.y + this.height, (this.roadWidth/2), Math.PI / 180 * 0, Math.PI / 180 * 360, true);
        context.closePath();
        context.fill();
    }

    drawInsideRect(insideColor = "green"){
        context.fillStyle=insideColor;
        context.beginPath();
        context.moveTo(this.topLeft[0], this.topLeft[1]);
        context.lineTo(this.topRight[0], this.topRight[1]);
        context.lineTo(this.bottomRight[0], this.bottomRight[1]);
        context.lineTo(this.bottomLeft[0], this.bottomLeft[1]);
        context.closePath();
        context.fill();  

        //separate rect into bins
        const binXPosArray = [];
        let binPos = this.topLeft[0];
        while (binPos < this.topRight[0]) {
            binXPosArray.push(binPos);
            binPos += 80;
        }

        for (const linePos of binXPosArray) {
            context.fillStyle='grey';
            context.fillRect(linePos, this.topLeft[1], 2, this.insideHeight); 
        }

        //next-fit algorithm
        const buildingArray = [bigBuilding, mediumBuilding, smallBuilding, house];
        for (let currentIndex = 0; currentIndex < binXPosArray.length - 1; currentIndex++){
            let currentX = binXPosArray[currentIndex];
            let currentY = this.topLeft[1];
            
            while (currentY < this.bottomLeft[1]) {
                let randomIndex = Math.floor(Math.random() * (4 - 1 + 1)) + 1 - 1;
                let buildingToDraw = buildingArray[randomIndex];
                if (currentY + buildingToDraw.height > this.bottomLeft[1]) {
                    break;
                }
                if(currentX + buildingToDraw.width > binXPosArray[currentIndex + 1]){
                    continue;
                }
                buildingToDraw.drawBuilding(currentX, currentY);
                currentY += buildingToDraw.height;
                }
            /*//there's a bug
                while (currentY < this.bottomLeft[1]) {
                    let randomIndex = Math.floor(Math.random() * (4 - 1 + 1)) + 1 - 1;
                    let buildingToDraw = buildingArray[randomIndex];
                    if (currentY + buildingToDraw.height > this.bottomRight[1]) {
                        break;
                    }
                    if(currentX + buildingToDraw.width > this.bottomRight[0]){
                        continue;
                    }
                    buildingToDraw.drawBuilding(currentX, currentY);
                    currentY += buildingToDraw.height;
                }
            }*/
        } 
    }

    splitRectRandomly(){

        let orientation = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
        const partitionPoint = {
            x : null,
            y : null
        }

        if (orientation > 5){//split vertically
            //make the first split to be always at the center
            if(this.level == 0){
                partitionPoint.x = (this.x + this.x + this.width)/2;
            }else{
                partitionPoint.x = Math.floor(Math.random() * ((this.x + this.width) - this.x + 1)) + this.x;
            }
            partitionPoint.y = this.y;

            let leftChildWidth = partitionPoint.x - this.x;
            let rightChildWidth = this.x + this.width - partitionPoint.x;

            //check if they meet the MIN_SIZE
            if (leftChildWidth < MIN_SIZE || rightChildWidth < MIN_SIZE || this.height < MIN_SIZE) {
                return;
            }
            //left child, left rect
            this.children.push(
                new Node(
                    this.x, 
                    this.y, 
                    leftChildWidth, 
                    this.height, 
                    this.level + 1));

            //right child, right rect
            this.children.push(
                new Node(
                    partitionPoint.x, 
                    partitionPoint.y, 
                    rightChildWidth, 
                    this.height, 
                    this.level + 1));
        } else {
            partitionPoint.x = this.x;
            if (this.level == 0) {
                partitionPoint.y = (this.y + this.y + this.height)/2;
            } else {
               partitionPoint.y = Math.floor(Math.random() * ((this.y + this.width) - this.y + 1)) + this.y; 
            }
            

            let leftChildHeight = partitionPoint.y - this.y;
            let rightChildHeight = this.y + this.height - partitionPoint.y;
            
            //check if they meet the MIN_SIZE
            if (leftChildHeight < MIN_SIZE || rightChildHeight < MIN_SIZE || this.width < MIN_SIZE) {
                return;
            }
            //left child, top rect
            this.children.push(
                new Node(
                    this.x, 
                    this.y, 
                    this.width, 
                    leftChildHeight, 
                    this.level + 1));

            //right child, bottom rect
            this.children.push(
                new Node(
                    partitionPoint.x, 
                    partitionPoint.y, 
                    this.width, 
                    rightChildHeight, 
                    this.level + 1));
        }
    }
}

class BSPTree{
    constructor(rootNode){
        this.root = rootNode;
    }

    expandRoot(){
        console.log("BSP Tree Structure : ")
        const splitQueue = [this.root];

        //true if splitQueue is not empty
        while (splitQueue.length) {
            let temp = splitQueue.shift();
            temp.splitRectRandomly();
            if (temp.children.length) {
                console.log( "level = " + (temp.level + 1));
                console.log(temp.children);
                splitQueue.push(...temp.children);
            }
        }
    }

    getLeaves(){
        const treeLeaves = [];
        const traversalOrder = [this.root];

        while (traversalOrder.length) {
            let temp = traversalOrder.shift();
            if (temp.children.length) {
                traversalOrder.push(...temp.children);
            }else{
                treeLeaves.push(temp);
            }
        }
        return treeLeaves;
    }
}

const bigBuilding = {
    width : 80,
    height : 40,
    buildings : [document.getElementById("big-building-1"),
                document.getElementById("big-building-2"),
                document.getElementById("big-building-3")],
    drawBuilding : function(x, y){
        const randomNumber = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
        context.drawImage(this.buildings[randomNumber-1], x, y);        
    }
}

const mediumBuilding = {
    width : 40,
    height : 24,
    buildings : document.getElementById("medium-building"),
    drawBuilding : function(x, y){
        context.drawImage(this.buildings, x, y);        
    }
}

const smallBuilding = {
    width : 16,
    height : 16,
    buildings : document.getElementById("small-building"),
    drawBuilding : function(x, y){
        context.drawImage(this.buildings, x, y);        
    }
}

const house = {
    width : 8,
    height : 16,
    buildings : document.getElementById("house"),
    drawBuilding : function(x, y){
        context.drawImage(this.buildings, x, y);        
    }
}

//main entry

const canvas = document.getElementById("myCanvas");
const context = canvas.getContext('2d');
canvas.width = 1200;
canvas.height = 1200;
const MIN_SIZE = 70; // min size of rect is 70 x 70 px

function createMap(){
    const root = new Node(0, 0, 1200, 1200, 0);
    const tree = new BSPTree(root);
    tree.expandRoot();
    const treeLeaves = tree.getLeaves();
    console.log("tree leaves : ")
    console.log(treeLeaves);

    for (const leaf of treeLeaves) {
        leaf.drawRect();
    }

    for (const leaf of treeLeaves) {
        leaf.drawIntersection();
    }

    for (const leaf of treeLeaves) {
        leaf.drawInsideRect();
    }   
}






