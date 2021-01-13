//Create variables here
var dog, dogHappy, dogSad;
var db, foodS, foodStock;
var fedTime, lastFed, feed, addFood1, foodObj;
var gameState,readState;
var bedroom,washroom,garden;
function preload(){
    dogImg = loadImage("images/dogImg.png");
    dogImg1 = loadImage("images/dogImg1.png");
    bedroom = loadImage("images/Bed Room.png");
    washroom = loadImage("images/Wash Room.png");
    garden = loadImage("images/Garden.png");
    sadDog=loadImage("images/Dog.png")
}
function setup() {
  createCanvas(1000, 500);
  foodObj = new Food();

  database = firebase.database();
  dog = createSprite(800, 200, 10, 10);
  dog.addImage(dogImg);
  dog.scale = 0.2

  feed = createButton("FEED");
  feed.position(1100, 60);
  feed.mousePressed(feedDog);

  addFood1 = createButton("ADD FOOD");
  addFood1.position(1200, 60);
  addFood1.mousePressed(addFood);

foodStock = database.ref('Food');
foodStock.on("value", readStock);

readState=database.ref('gameState');
readState.on("value",function(data){
  gameState=data.val();
})

}

function draw() {  
  background("yellow");
  currentTime=minute();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }

   if(gameState!="Hungry"){
     feed.hide();
     addFood1.hide();
     dog.remove();
   }
   else{
    feed.show();
    addFood1.show();
    dog.addImage(sadDog);
   }

fedTime = database.ref('fedTime');
fedTime.on('value', function(data){
  lastFed = data.val();
})
if(lastFed >=12){
  text("LAST FEED :" + lastFed % 12 + 'pm', 350, 30);
} else if(lastFed === 0){
  text("LAST FEED : 12 am", 350, 30);
}else {
  text("LAST FEED :"+ lastFed+'am', 350, 30);
}
  drawSprites();
  
} 
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS)
}
function feedDog(){
  dog.addImage(dogImg1)
  foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  database.ref('/').update({
    Food:foodObj.getFoodStock(), fedTime:minute()
  })
}
function addFood(){
  dog.addImage(dogImg)
  foodS=foodS+1;
  database.ref('/').update({
    Food:foodS,
  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  })
}




