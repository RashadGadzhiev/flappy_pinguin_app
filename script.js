const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");


const bottom_img = document.getElementById("bottom");
const top_img = document.getElementById("top");
const penguin1_img = document.getElementById("penguin1");
const penguin2_img = document.getElementById("penguin2");
const penguin3_img = document.getElementById("penguin3");
const space_img = document.getElementById("space");

let score = 0;

let penguin = {
    x: 100, 
    y: 200,
    width: 58,
    height: 46,
    changeY: 0,
    changeAngle: 0,
    angle: 0,
    image: penguin1_img,
    frame: 0,
    draw() {
        this.y += this.changeY;
        this.angle += this.changeAngle;
        this.changeY += 0.05;
        this.changeAngle += 0.002;
        if(this.y <= 0) {
            this.y = 0;
        }
        if(this.y >= canvas.height - this.height) {
            this.y = canvas.height - this.height;
        }
        if(this.angle > 0.3) {
            this.angle = 0.3;
        }
        if(this.angle < -0.4) {
            this.angle = -0.4;
        }
        this.frame += 1;
        if(this.frame == 10) {
            this.frame = 0;
            if(this.image == penguin1_img) {
                this.image = penguin2_img;
            }
            else if(this.image == penguin2_img) {
                this.image = penguin3_img;
            
            }
            else{
                this.image = penguin1_img;
            }
        }
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}

function Column(x, y, image) {
    this.x = x;
    this.y = y;
    this.width = 62;
    this.height = 187;
    this.changeX = -2;
    this.image = image;
    this.draw = function() {
        this.x += this.changeX;
        if(this.x + this.width <= 0 ) {
            this.x = canvas.width;
            if(this.image == top_img) {
                score++;
            }
        }
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}



let columns = [];

for(let i = 0; i < 5; i++) {
    let columnX = (130 + 62 / 5) * i + canvas.width;
    let columnY = -Math.floor(Math.random() * 90);                                    
    columns.push(new Column(columnX, columnY, top_img));
    columnY = Math.floor(Math.random() * 90) + canvas.height - 187;
    columns.push(new Column(columnX, columnY, bottom_img));
}


function update() {
    ctx.drawImage(space_img, 0, 0, canvas.width, canvas.height);
    penguin.draw();
    columns.forEach(column => {
        column.draw();
    });
    if(multicollision(penguin, columns) > -1) {
        return false;
    }
    ctx.font = "32px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(score, 30, 30);        
    window.requestAnimationFrame(update);
}

update();

window.addEventListener("keydown", function(e) {
    if(e.keyCode == 32) {
        penguin.changeY = -2;
        penguin.changeAngle = -0.1;
    }
});


function collision(one, two){
    if(one.x + one.width > two.x && two.x + two.width > one.x && one.y + one.height > two.y && two.y + two.height > one.y){
        return true;
    }
    return false;
}

function multicollision(one, many) {
    let index = -1;
    for(let i = 0; i < many.length; i++) {
        if(collision(one, many[i])) {
            index = i;
            break;
        }
    }
    return index;
}