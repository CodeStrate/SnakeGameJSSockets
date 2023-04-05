var s;
var gridscale = 20;

var food;

function setup(){
    createCanvas(600, 600);
    s = new Snake();
    frameRate(10);

   placeFood();
}

function placeFood(){
    var cols = floor(width/gridscale);
    var rows = floor(height/gridscale);
    food = createVector(floor(random(cols)), floor(random(rows)));
    food.mult(gridscale);
    

}

function draw(){
    background(51);
    s.die();
    s.update();
    s.show();

    if(s.eat(food)){
        placeFood();
    }

    fill(255, 0, 100);
    rect(food.x, food.y, gridscale, gridscale);
}

function keyPressed() {
    if(keyCode === UP_ARROW){
        s.dir(0, -1);
    }
    else if(keyCode === DOWN_ARROW){
        s.dir(0, 1);
    }
    else if(keyCode === LEFT_ARROW){
        s.dir(-1, 0);
    }
    else if(keyCode === RIGHT_ARROW){
        s.dir(1, 0);
    }

}