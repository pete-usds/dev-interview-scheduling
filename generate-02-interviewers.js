const { faker } = require("@faker-js/faker");
var fs = require("fs");
var _ = require("underscore");
var dayjs = require("dayjs");

var recordsToGenerate = 20;
var outfile = "docs/interviewers.json";

let rawdata = fs.readFileSync("docs/skills.json");
var skills = JSON.parse(rawdata);
var communities = Object.keys(skills);

// make tq1 more common by having it in array more often
var types = ["TQ1", "TQ1", "TQ1", "TQ1", "TQ2"];
var times = ["15", "30", "45", "00"];

// manually define days of the week to avoid confusion
var weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
var now = dayjs();

fd = {};

for (var x = 0; x < recordsToGenerate; x++) {
  var fn = faker.name.firstName();
  var ln = faker.name.lastName();
  var gh = fn.toLowerCase() + "-" + ln.toLowerCase() + "-usds";

  var numSkills = _.random(1, 5);

  var availability = [];
  for (var av = 1; av <= _.random(1, 4); av++) {
    var numType = _.random(1, 2);

    var o = {};
    o.interviewTypes = _.uniq(_.sample(types, numType));

    if (o.interviewTypes.includes("TQ2")) {
      o.dayOfWeek = "Thursday";
    } else {
      o.dayOfWeek = faker.helpers.arrayElement(weekDays);
    }
    var shour = _.random(8, 18);
    var ehour = shour + _.random(1, 4);
    o.startTime = shour + ":" + _.sample(times);
    o.endTime = ehour + ":" + _.sample(times);

    availability.push(o);
  }
  var cop = _.sample(communities);

  fd[gh] = {
    fullName: fn + " " + ln,
    contact: {
      email: fn.toLowerCase() + "." + ln.toLowerCase() + "@usds.gov",
      slack: "@" + fn + ln,
    },
    community: cop,
    skills: _.sample(skills[cop], numSkills),
    availability: availability,
  };
}

console.log(JSON.stringify(fd, null, 2));

fs.writeFile(outfile, JSON.stringify(fd, null, 2), (err) => {
  if (err) {
    console.error(err);
  }
  // file written successfully
});
