/*
p5.js script for Pong game
David Norman Diaz Estrada
https://github.com/DavidDZ7/pong
August 2023
 */

backgroundColor='#444444'
leftColor='#CC0000';
rightColor='#00CC00';
ballColor="#0000CC";

leftPaddle=null
rightPaddle=null
ball1=null
leftScore=null
rightScore=null

function setup() {
  createCanvas(windowWidth, windowHeight);
  leftPaddle = new paddle(isLeft=true);
  rightPaddle = new paddle(isLeft=false);
  ball1 = new ball();
  leftScore = new scoreText(isLeft=true);
  rightScore = new scoreText(isLeft=false);
}

function draw() {
  background(backgroundColor);
  showGameInstructions();
  leftPaddle.show();
  rightPaddle.show();

  ball1.update(leftPaddle,rightPaddle);
  score=ball1.checkIfScored();
  ball1.show();

  if (score!=null){
    if (score=="left"){leftScore.score+=1;}
    else{rightScore.score+=1;}
  }
  
  leftScore.show();
  rightScore.show();

  checkKeys();
}

function showGameInstructions(){
  let instructions="Left player: W, S | Right player: UP, DOWN"
  strokeWeight(0);
  textSize(25);
  let textWidth_ = textWidth(instructions);
  let textHeight_ = textAscent(instructions) + textDescent(instructions);
  //display a background rectangle for the instructions
  fill(150);
  rectMode('corner')
  rect(x=0,y=windowHeight-textHeight_-7,h=windowWidth,w=textHeight_)
  //display the instructions centered at the bottom
  fill(20);
  text(instructions,x=windowWidth/2-textWidth_/2,y=windowHeight-textHeight_/2);
}

function checkKeys() {
  // right paddle
  if (keyIsDown(UP_ARROW)) {
    rightPaddle.update(direction=-1); // Move the object up
  } else if (keyIsDown(DOWN_ARROW)) {
    rightPaddle.update(direction=1); // Move the object down
  }
  // left paddle
  if (keyIsDown(87)) {//W -> 87 ASCII key code
    leftPaddle.update(direction=-1); // Move the object up
  } else if (keyIsDown(83)) {//S -> 83 ASCII key code
    leftPaddle.update(direction=1); // Move the object down
  }
}


function windowResized() {//restart game if window is resized
  resizeCanvas(windowWidth, windowHeight);
  leftPaddle=null
  rightPaddle=null
  ball1=null
  leftScore=null
  rightScore=null
  setup()
}


class paddle{
  constructor(isLeft){
    this.width=20;
    this.height=150;
    this.y=windowHeight/2;
    this.radius=10;
    this.speed=10;

    if (isLeft){
      this.x=this.width;
      this.color=leftColor;
    }
    else{
      this.x=windowWidth-this.width;
      this.color=rightColor;
    }
    

  }

  show() {
    fill(this.color);
    strokeWeight(2);
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height,this.radius);
  }

  update(direction){
    this.y=this.y+direction*this.speed;
    //ensure the paddle does not go outside the window:
    this.y=min(max(this.y,this.height/2),windowHeight-this.height/2);
  }

}


class ball{
  constructor(){
    this.diameter=40;
    this.color=ballColor;
    this.speed=max(5,0.008*windowWidth);//speed should increase for larger window width
    this.direction=-1;
    this.reset(this.direction);
  }

  reset(direction){
    this.x=windowWidth/2;
    this.y=windowHeight/2;
    let angle=random(-Math.PI/4,Math.PI/4)//between -45 and 45 degrees
    this.Xspeed=this.speed*cos(angle)*direction;//direction is -1 or 1
    this.Yspeed=this.speed*sin(angle);
  }

  show(){
    fill(this.color);
    strokeWeight(4); 
    circle(this.x, this.y, this.diameter);
  }

  update(leftPaddle,rightPaddle){
    this.x=this.x+this.Xspeed;
    this.y=this.y+this.Yspeed;
    //ensure ball bounces when hitting top of window:
    if(this.y-this.diameter/2<=0){
      this.y=this.diameter/2;
      this.Yspeed=abs(this.Yspeed);}
    //ensure ball bounces when hitting bottom of window:
    else if(this.y+this.diameter/2>=windowHeight){
      this.y=windowHeight-this.diameter/2;
      this.Yspeed=-1*this.Yspeed;}    
    //ensure ball bounces when hitting left paddle:
    if(this.y>=leftPaddle.y-leftPaddle.height/2 && this.y<=leftPaddle.y+leftPaddle.height/2 && (this.x-this.diameter/2)<=1.5*leftPaddle.width){
      let normalizedCenterDiff=(leftPaddle.y-this.y)/leftPaddle.height//[-1,1] range
      let angle=(Math.PI/4)*normalizedCenterDiff //range [-45,45] degrees
      this.Yspeed=this.speed*sin(angle)
      this.Xspeed=abs(this.speed*cos(angle))//move to right
    }
    //ensure ball bounces when hitting right paddle:
    else if (this.y>=rightPaddle.y-rightPaddle.height/2 && this.y<=rightPaddle.y+rightPaddle.height/2 && (this.x+this.diameter/2)>=windowWidth-1.5*rightPaddle.width){
      let normalizedCenterDiff=(rightPaddle.y-this.y)/rightPaddle.height//[-1,1] range
      let angle=(Math.PI/4)*normalizedCenterDiff //range [-45,45] degrees
      this.Yspeed=this.speed*sin(angle)
      this.Xspeed=-1*this.speed*cos(angle)//move to left
    }
  }

  checkIfScored(){
    //check when player scores (ball x coordinate less or greater than window dimentions):
    if (this.x-this.diameter/2<=0){//Right player has scored
      this.reset(-1);//reset and move to left
      return "right";
    }
    else if (this.x+this.diameter/2>=windowWidth){//left player has scored
      this.reset(1);//reset and move to right
      return "left";
    }

    return null //when no one has scored
  }

}

class scoreText{
  constructor(isLeft){
    this.score=0;
    this.y=30;
    if(isLeft){
      this.color=leftColor;
      this.x=0;
    }
    else{
      this.color=rightColor;
      this.x=windowWidth-170;
    }
  }
  show(){
    fill(20);
    strokeWeight(4); 
    textSize(30);
    var s='SCORE: '+str(this.score);
    text(s,this.x,this.y);
  }
}