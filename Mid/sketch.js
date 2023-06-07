let canvasSize, unitLength;
let circleList = [];
let bgColorList = [];
const beat = [0, 0, 1, 0, 0, 2, 4, 0, 0, 0, 0, 1, 0, 2, 4, 3];
let time = 0;
let Ptime = 0;
let tempo = 250;
const sqrt2 = [
1,10,4,10,1,10,10,4,10,2,1,10,10,3,10,10,5,10,10,10,6,2,3,10,10,7,10,3,10,10,0,10,
];
const sqrt3 = [
10,1,10,10,10,10,10,7,3,2,0,10,10,5,10,0,10,10,8,10,10,0,10,10,10,7,10,5,6,10,10,8,
];
const sqrt5 = [2, 10, 10, 10, 2, 10, 10, 3, 10, 10, 6, 10, 0, 10, 10, 6, 10];
const sqrt7 = [2, 10, 6, 10, 10, 4, 10, 10, 5, 7, 10, 5, 10, 10, 1, 3, 10];
const sqrt11 = [3, 3, 1, 6, 6, 2];
const colorIndex = [sqrt2, sqrt3, sqrt5, sqrt7, sqrt11]
let soundIndex = [0.25, 0.2, 0.2, 0.2, 0.04, 0.01, 0.02, 0.04, 0.07, 0.1, 0, 0.25]
let sound;
let colorlist;
let Start = false;

function init() {
  rectMode(CENTER);
  angleMode(DEGREES);
  soundIndex[10] = soundIndex[11];
  Pd.send("sound_drum", [soundIndex[10]]);
  Pd.send("tempo", [tempo]);
  textAlign(CENTER, CENTER);
  Pd.receive('counting', function(args) { time = int(args[0]);})
  colorlist = [
    color(241, 224, 255),
    color(163, 209, 209),
    color(153, 204, 255),
    color(255, 231, 112),
    color(255, 218, 185),
    color(102, 178, 255),
    color(255, 117, 117),
    color(190, 233, 206),
    color(205, 190, 233),
    color(231, 231, 206),
    color(200, 200, 200),
  ];
  bgColorList = [
  color(255, 255, 255),
  color(200, 200, 200),
  color(150, 150, 150),
  color(100, 100, 100),
  color(60, 60, 60)
  ];
  
}
// alpha: 0 = transparent

function setup() {
  
    
  let rotatelist = [1.25, 1.25, 3.1, 3.1, 8.2];
  let i = 0;
  // canvasSize = min(windowWidth, windowHeight) * 0.8;
  // createCanvas(canvasSize, canvasSize);
  createCanvas(windowWidth, windowHeight);
  unitLength = min(width, height) / 10;
  //console.log(unitLength);
  // unitLength = 30;
  for (const l of [2, 3, 5, 7, 11]) {
    // const r = sqrt(l) * unitLength;
    const r = sqrt(l);
    
    const dx = random([1, -1]) * random(1, 2);
    const dy = random([1, -1]) * random(1, 2);
    let x = random(r, width - r);
    let y = random(r, height - r);
    let c_time = 0;
    circleList.push([x, y, r, dx, dy, rotatelist[i], l, false, colorIndex[i], soundIndex[i], c_time, false, soundIndex[i+5]]);
    Pd.send("hit_"+l+"_s", [soundIndex[i+5]]);
    i += 1;
  }
  sound = true;
  init();
}


function draw() {
  
  if (Start == false) {
    background(255);
    textSize(unitLength*0.6);
    fill(frameCount%200);
    text("press 'Enter' to start", width / 2 , height / 2);
    
  }
  else{
    
    
    background(255);
    
    noStroke();
    let bg_x = 0, bg_y=0;
    if(time%128 <= 31){
      bg_x = 0;
      bg_y = 0;
    }
    else if(time%128 <= 63){
      bg_x = width;
      bg_y = 0;
    } 
    else if(time%128 <= 95){
      bg_x = 0;
      bg_y = height;
    } 
    else if(time%128 <= 127){
      bg_x = width;
      bg_y = height;
    } 
    let bgColor = bgColorList[beat[time % beat.length]];
    bgColor.setAlpha(255);
    fill(bgColor);
    circle(bg_x, bg_y, unitLength*15);
    
    
    

    if(time < 64){
      fill('black');
      textSize(unitLength * 0.3);
      text("Click and sound will appear\n\npress arrow to increase and decrease beat and sound\n\npress 'm' to mute and 'a' to reset", width / 2 , height / 2);
      
    }

    let i = 0;
    for (const cl of circleList) {
      if(time - cl[10] > 3 && cl[10] != 0){
        cl[7] = true;
      }
      if (cl[7] == false) {
        continue;
      }



      // x,y,r,dx,dy

      cl[0] += cl[3];
      cl[1] += cl[4];

      // Boundary bouncing effect
      const r = cl[2] * unitLength;
      if (cl[0] > width - r / 2) {
        cl[0] = width - r / 2 - 1;
        cl[3] = -random(cl[3] * 1.2, cl[3] * 0.8);
      } else if (cl[0] < r / 2) {
        cl[0] = r / 2 + 1;
        cl[3] = -random(cl[3] * 1.2, cl[3] * 0.8);
      }

      if (cl[1] > height - r / 2) {
        cl[1] = height - r / 2 - 1;
        cl[4] = -random(cl[4] * 1.2, cl[4] * 0.8);
      } else if (cl[1] < r / 2) {
        cl[1] = r / 2 + 1;
        cl[4] = -random(cl[4] * 1.2, cl[4] * 0.8);
      }

      // Bouncing effect between balls
      for (let i = 0; i < circleList.length; i++) {
        const cl1 = circleList[i];
        if (cl1[7] === false){
          continue;
        }
        for (let j = i + 1; j < circleList.length; j++) {
          const cl2 = circleList[j];
          if (cl2[7] === false) continue;
          if (
            dist(cl1[0], cl1[1], cl2[0], cl2[1]) <= (cl1[2] * unitLength + cl2[2] * unitLength) / 2 + 1 ) {
            if(sound == true){
              Pd.send("hit_"+cl1[6], ["bang"]);
              Pd.send("hit_"+cl2[6], ["bang"]);
            }
            
            const x = cl1[0] - cl2[0];
            const y = cl1[1] - cl2[1];
            const dx = sqrt(cl1[0] * cl1[0] + cl2[0] * cl2[0]);
            const dy = sqrt(cl1[1] * cl1[1] + cl2[1] * cl2[1]);

            cl1[3] = (random(25, 15) * x) / dx;
            cl1[4] = (random(25, 15) * y) / dy;

            cl2[3] = (random(25, 15) * -x) / dx;
            cl2[4] = (random(25, 15) * -y) / dy;
          }
        }
      }


      // Moving effect
      push();
      translate(cl[0], cl[1]);

      push();

      const fillAlpha = time-cl[10]+100; // valid value 0-255; 0 is transparent
      
      rotate(cl[5] * (frameCount % 365));
      let fillColor = color('black');
      fillColor.setAlpha(fillAlpha);
      stroke(fillColor);
      fillColor = color('white');
      fillColor.setAlpha(fillAlpha);
      fill(fillColor);
      circle(0, 0, r);
      
      i += 1;
      let c = cl[8];
      if (time - cl[10] > 10 && cl[10] != 0){
        if (time - cl[10] < 15 && cl[10] != 0){
          c = 10
        }
        else{
          c = c[time % c.length];
        }
    
        fillColor = colorlist[c];
        fillColor.setAlpha(fillAlpha);
        fill(fillColor);
        rect(0, 0, r / sqrt(2));
        pop();
        
        fillColor = color((c==10) ? 'white' : 'black');
        fillColor.setAlpha(fillAlpha);
        fill( fillColor );
        textSize(r / 4);
        text("sqrt(" + int(cl[6]) + ")", 0, 0);
        pop();
      }
      else{
        pop();
        pop();
      }

    }
  }
}


function mouseClicked() {
  if(Start == true){
    
    if (circleList.length != 5){
      return;
    }
    if(mouseX > width || mouseY > height) return;
    const leftRight =  (mouseX < width/2) ? 0  : 1;
    const upDown = (mouseY < height/2) ? 0  : 1;

    // ['left up', 'left down', 'right up', 'right down', 'center'];

    const pos = (dist(mouseX, mouseY, width/2, height/2) < min(width, height)/4) ? 4 : leftRight+upDown*2;

    circleList[pos][11] = ! circleList[pos][11];
    if (circleList[pos][11]){
      if(sound == true){
        Pd.send("sound_"+circleList[pos][6], [circleList[pos][9]]);
      }
       
      circleList[pos][10] = time;
    } else {
      Pd.send("sound_"+circleList[pos][6], [0]); 
      circleList[pos][10] = 0;
      circleList[pos][7] = false;
    }
  }
}


function keyPressed() {
  
  if (keyCode === ENTER) {
    if(Start == false){ 
      Pd.send("sound_drum", [soundIndex[10]]);
      Pd.send("hit", ["bang"]);
      
      for (const cl of circleList){
        if(cl[11] == true){
          Pd.send("sound_"+cl[6], [cl[9]]); 
        }
      }
      
      Start = true;
      Ptime = time;
    }
    else{
      Start = false;
      Pd.send("hit", ["bang"]);
      for (const cl of circleList){
        if(cl[11] == true){
          Pd.send("sound_"+cl[6], [0]); 
        
        }
      }
      Ptime = 0;
    }
  }
  if(Start == true){
    
    if (keyCode === UP_ARROW) {
      //console.log('Arrow up');
      for (const cl of circleList){
        cl[9] = cl[9] + 0.01;
        if(cl[9] > 1){
            cl[9] = 1;
        }
        cl[12] = cl[12] + 0.01;
        if(cl[12] >1){
            cl[12] = 1;
        }
        
        if(cl[11] == true){
          
          Pd.send("sound_"+cl[6], [cl[9]]);
          Pd.send("hit_"+cl[6]+"_s", [cl[12]]);
        }
      }
      soundIndex[10] = soundIndex[10] + 0.01;
      if(soundIndex[10] > 1 ){
        soundIndex[10] = 1;
      }
      Pd.send("sound_drum", [soundIndex[10]]);

    } else if (keyCode === DOWN_ARROW) {
      //console.log('Arrow down');
      for (const cl of circleList){
        cl[9] = cl[9] - 0.01;
        if(cl[9] < 0){
            cl[9] = 0;
        }
        cl[12] = cl[12] - 0.01;
        if(cl[12] < 0 ){
            cl[12] = 0;
        }
        if(cl[11] == true){
          
          //console.log("sound_"+cl[6], cl[9]);
          Pd.send("sound_"+cl[6], [cl[9]]);
          Pd.send("hit_"+cl[6]+"_s", [cl[12]]);
        }
      }
      soundIndex[10] = soundIndex[10] - 0.01;
      if(soundIndex[10] < 0 ){
        soundIndex[10] = 0;
      }
      //console.log("sound_",soundIndex[10]);
      Pd.send("sound_drum", [soundIndex[10]]);

    } else if (keyCode === LEFT_ARROW) {
      //console.log('Arrow left');
      tempo = tempo + 5;
      Pd.send("tempo", [tempo]);
    } else if (keyCode === RIGHT_ARROW) {
      //console.log('Arrow right');
      tempo = tempo - 5;
      Pd.send("tempo", [tempo]);
    }else if (keyCode === 77) {
      //console.log('m');
      if(sound == true){
        for (const cl of circleList){
          if(cl[11] == true){
            Pd.send("sound_"+cl[6], [0]);
            Pd.send("hit_"+cl[6]+"_s", [0]);
          }
        }
        Pd.send("sound_drum", [0]);
        sound = !sound;
      }
      else{
        for (const cl of circleList){
          if(cl[11] == true){
            Pd.send("sound_"+cl[6], [cl[9]]);
            Pd.send("hit_"+cl[6]+"_s", [cl[12]]);
          }
        }
        Pd.send("sound_drum", [soundIndex[10]]);
        sound = !sound;
      }
    }else if (keyCode === 65) {
      //console.log('a');
      let i = 0;
      for (const cl of circleList){
        cl[9] = soundIndex[i];
        cl[12] = soundIndex[i+5];
        if(cl[11] == true){
            Pd.send("sound_"+cl[6], [cl[9]]);
            Pd.send("hit_"+cl[6]+"_s", [cl[12]]);
        }
        i += 1;
      }
      Pd.send("sound_drum", [soundIndex[11]]);
      tempo = 250;
      Pd.send("tempo", [tempo]);
    }
      
  }
  
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  unitLength = min(width, height) / 10;
}
