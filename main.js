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
        //draw intersection, substract by roadwidth/2 to put origin at the center
        context.fillStyle='black';
        //top-left
        context.fillRect(this.x - (this.roadWidth/2), this.y - (this.roadWidth/2), this.roadWidth, this.roadWidth);
        //top-right
        context.fillRect(this.x - (this.roadWidth/2) + this.width, this.y - (this.roadWidth/2), this.roadWidth, this.roadWidth);
        //bottom-left
        context.fillRect(this.x - (this.roadWidth/2), this.y - (this.roadWidth/2) + this.height, this.roadWidth, this.roadWidth);
        //bottom-right
        context.fillRect(this.x - (this.roadWidth/2) + this.width, this.y - (this.roadWidth/2) + this.height, this.roadWidth, this.roadWidth);

    }

    drawInsideRect(){
        if(this.level == 3){
            context.fillStyle='red';
            context.beginPath();
            context.moveTo(this.topLeft[0], this.topLeft[1]);
            context.lineTo(this.topRight[0], this.topRight[1]);
            context.lineTo(this.bottomRight[0], this.bottomRight[1]);
            context.lineTo(this.bottomLeft[0], this.bottomLeft[1]);
            context.closePath();
            context.fill(); 
            return; 
        }
        context.fillStyle='green';
        context.beginPath();
        context.moveTo(this.topLeft[0], this.topLeft[1]);
        context.lineTo(this.topRight[0], this.topRight[1]);
        context.lineTo(this.bottomRight[0], this.bottomRight[1]);
        context.lineTo(this.bottomLeft[0], this.bottomLeft[1]);
        context.closePath();
        context.fill();  
        
    }

    splitRectRandomly(orientation){

        if(orientation == "vertical"){
            //vertically
            let childWidth, childHeight;
            const partitionPoint = {
                x :Math.floor(Math.random() * 
                ((this.width * 3/4) - this.width/4 + 1)) + this.width/4,
                y : this.y
            }
            childHeight = this.height;// the height is preserved

            //create left rect, become left child
            childWidth = partitionPoint.x - this.x;
            this.children.push(new Node(this.x, this.y, 
                childWidth, childHeight, this.level + 1));
            
            //create right rect, become right child
            childWidth = this.width - partitionPoint.x;
            this.children.push(new Node(partitionPoint.x,
                partitionPoint.y, childWidth, childHeight, this.level + 1));
            
        }else{
            //horizontally
            let childWidth, childHeight;
            const partitionPoint = {
                x :this.x,
                y : Math.floor(Math.random() * 
                ((this.height * 3/4) - this.height/4 + 1)) + this.height/4
            }
            childWidth = this.width // the width is preserve

            //create top rect, become left child
            childHeight = partitionPoint.y - this.y;
            this.children.push(new Node(this.x, this.y, 
                childWidth, childHeight, this.level + 1));
            
            //create bottom rect, become right child
            childHeight = this.height - partitionPoint.y;
            this.children.push(new Node(partitionPoint.x,
                partitionPoint.y, childWidth, childHeight, this.level + 1));
        }
        
            
        

        
    }
}

const canvas = document.getElementById("myCanvas");
const context = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;

let randomNumber = Math.floor(Math.random() * 10) + 1;
let split = "";
if (randomNumber < 5) {
    split = "vertical"; 
}else{
    split = "horizontal";
}

//create root node, level 0
const root = new Node(0, 0, canvas.width, canvas.height, level = 0);
//create level 1
root.splitRectRandomly(split);

//create level 2
if(split == "vertical"){
    root.children[0].splitRectRandomly("horizontal")
    root.children[1].splitRectRandomly("horizontal")
}else{
    root.children[0].splitRectRandomly("vertical")
    root.children[1].splitRectRandomly("vertical")
}

root.children[1].children[1].drawRect();//level 2
root.children[1].children[0].drawRect();//level 2
root.children[0].children[0].drawRect();//level 2
root.children[0].children[1].drawRect();//level 2

root.children[1].children[1].drawInsideRect();//level 2
root.children[1].children[0].drawInsideRect();//level 2
root.children[0].children[0].drawInsideRect();//level 2
root.children[0].children[1].drawInsideRect();//level 2


//panjang dan lebar minimal 40
const child = new Node(300, 150, 40, 40, 1);