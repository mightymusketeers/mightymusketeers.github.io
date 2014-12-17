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
     var Achievement = Parse.Object.extend("Achievement");
        var newAchievement = new Achievement();
    	newAchievement.set("achievementId", id)
    	newAchievement.set("UserId", Parse.User.current())
    
		newAchievement.save(null, {
		  success: function(returnVar) {
		  },
		  error: function(returnVar, error) {
		  }
		});
}

