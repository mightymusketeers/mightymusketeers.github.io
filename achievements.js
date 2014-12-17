function Achievement(title,description)
{
  this.title = title;
  this.description = description;
}
var achievements = [
  Achievement("distance500","500 seconds"),//0
  Achievement("distance1000","1000 seconds"),//1
  Achievement("distance2000","2000 seconds"),//2
  Achievement("distance3000","3000 seconds"),//3
  Achievement("squirrel25","Hit 25 Squirrels"),//4
  Achievement("squirrel100","Hit 100 Squirrels"),//5
  Achievement("squirrel150","Hit 150 Squirrels"),//6
  Achievement("squirrel250","Hit 250 Squirrels"),//7
  Achievement("mug25","Collected 25 Mugs"),//8
  Achievement("mug100","Collected 100 Mugs"),//9
  Achievement("mug150","Collected 150 Mugs"),//10
  Achievement("mug250","Collected 250 Mugs"),//11
  Achievement("distracted","Spent over 30 Seconds on menu screen")//12
];
/*
achievments[idFromParse].title;
achievments[idFromParse].description;
*/
var achievementTracker =
{
  distance:0,
  squirrel:0,
  mug:0,
  distracted:0
}

function grantAchievement(id)
{     
   checkRaceCondition =false;
     var Achievement = Parse.Object.extend("Achievement");
     var query = new Parse.Query(Achievement);

    query.equalTo("UserId", {
    __type: "Pointer",
    className: "_User",
    objectId: Parse.User.current().id
    });
  
    query.equalTo("achievementId",id);
 
    query.find({
    success: function(results) {
    checkRaceCondition = true;
    if(results.length > 0)
    {
    }
    else{
    var newAchievement = new Achievement();
    newAchievement.set("achievementId", id);
    newAchievement.set("UserId", Parse.User.current());
    newAchievement.save(null, {
      success: function(gameScore) {
      },
      error: function(gameScore, error) {
      }
    });
    }
  },
  error: function(error) {
    console.log("Error: " + error.code + " " + error.message);
  }
});
}


function checkAchievements()
{

    switch(achievementTracker.distance)
  {
      case 500:
        grantAchievement(0);
        break;
      case 1000:
        grantAchievement(1);
        break;
      case 2000:
        grantAchievement(2);
        break;
      case 3000:
        grantAchievement(3);
        break;
  }
  switch(achievementTracker.squirrel)
  {
      case 25:
        grantAchievement(4);
        break;
      case 100:
        grantAchievement(5);
        break;
      case 150:
        grantAchievement(6);
        break;
      case 250:
        grantAchievement(7);
        break;
  }
  
    switch(achievementTracker.mug)
  {
      case 25:
        grantAchievement(8);
        break;
      case 100:
        grantAchievement(9);
        break;
      case 150:
        grantAchievement(10);
        break;
      case 250:
        grantAchievement(11);
        break;
  }
}
