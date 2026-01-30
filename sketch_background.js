//circle size
let s;

//rotation 
let angle=0;

let speed=0.005;

//number of rotation symmetries
let circleSet1=2;
//number of lines present
let circleSet2=33;

let r, g, b;


function setup() {
  var myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent("sketchBackground");
  createCanvas(windowWidth, windowHeight);
  background(89, 61, 194);
  noStroke();

  r = 50
  g = 50
  b = 200
  
  //scale circle to windowWidth
  s=windowWidth;
}

function draw() {
  
  push();
  translate(-width/6,height/6);
  
  //black + opacity
  background(89, 61, 194, 1);

  //determines new position of ball
  let pos1 = map(cos(angle),-1,1,width/3,height*1.25);
  let pos2 = map(sin(angle),-1,1,width/3,height*1.25);
  
  //starting pos
  translate(width/2,height/2);
  rotate(angle);
  
  //rotation set 1
  for (i=0;i<circleSet1;i++){
    push();
    rotate(i*TWO_PI/circleSet1);
    //moves new pos by pos1
    translate(pos1,0);
    
    //distance between each line across set distance around circumference
    for (j=0;j<circleSet2;j++){
      push();
      //note : 2pi = distributed across whole circle
      rotate(j*TWO_PI/circleSet2);
      translate(pos2,0);
      
      //randomizes color and shifts gradually within set constraint
      if ((0 <= mouseX <= windowWidth) && (0 <= mouseY <= windowHeight)){
        r = r + random(-0.09, 0.09)
        g = g + random(-0.09, 0.09)
        b = b + random(-0.09, 0.09)
      }
      r = constrain(r, 75, 105);
      g = constrain(g, 45, 75);
      b = constrain(b, 175, 205);
      
      fill(r, g, b);
      ellipse(0,0,s/66);
      pop();
    }
    pop();
  }
  
  //add speed to angle
  angle+=speed;
  pop();
  
}