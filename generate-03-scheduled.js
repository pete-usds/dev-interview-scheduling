const { faker } = require("@faker-js/faker");
var fs = require("fs");
var _ = require("underscore");
var dayjs = require("dayjs");

var recordsToGenerate = 5;
var outfile = "docs/scheduled.json";

var talentReps = [
  "ange-the-knife",
  "joey-butta",
  "joseph-broseph",
  "tali-runs",
  "bearded-jesus",
  "hieu-hieu",
  "lan-party-man",
];

var dayNum = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

// for randomly picking hidden or not, but making hidden more rare
var isHidden = [false, false, false, false, false, true];

let rawdata = fs.readFileSync("docs/skills.json");
var skills = JSON.parse(rawdata);
var communities = Object.keys(skills);

rawdata = fs.readFileSync("docs/interviewers.json");
var interviewers = JSON.parse(rawdata);
var folkids = Object.keys(interviewers);

var now = dayjs();
fd = {};

for (var x = 0; x < recordsToGenerate; x++) {
  // pick a random person
  var i = faker.helpers.arrayElement(folkids);
  // grab a random interview availability slot from them
  var o = faker.helpers.arrayElement(interviewers[i].availability);

  // calculate and save some future appointments as booked
  var avDaysFromNow = dayNum[o.dayOfWeek] - now.day();
  if (avDaysFromNow < 1) {
    // if today is Wed and this appoint is Tue, this is -1 and that appointment is in the
    // past but we want the next appointment to be set to now -1 + 7.
    var next = now.add(avDaysFromNow + 7, "day");
  } else {
    // if today is Wed and this is Thu, it's 1 day from now so the next appointment is set
    // to now plus 1 day
    var next = now.add(avDaysFromNow, "day");
  }

  // get the hours/minutes from the starttime and apply them as well
  var st = o.startTime.split(":");
  next = next.hour(st[0]);
  next = next.minute(st[1]);
  next = next.second(0);

  // create an array with the next 10 upcoming interview times
  var nextUp = [];
  nextUp.push(next.unix());
  for (var nx = 1; nx <= 10; nx++) {
    next = next.add(7, "day");
    nextUp.push(next.unix());
  }

  // pick a random number of upcoming scheduled interviews
  var scheduled = [];
  var numUp = _.random(1, 10);
  for (var nx = 0; nx <= numUp; nx++) {
    var s = {};
    s.interviewType = faker.helpers.arrayElement(o.interviewTypes);
    s.candidateName = faker.name.firstName() + " " + faker.name.lastName();
    s.talentRep = faker.helpers.arrayElement(talentReps);
    s.hidden = faker.helpers.arrayElement(isHidden);
    s.startTime = nextUp[nx];
    s.friendlyStartTime = new Date(s.startTime * 1000).toLocaleString();
    scheduled.push(s);
  }
  fd[i] = scheduled;
}

console.log(JSON.stringify(fd, null, 2));

fs.writeFile(outfile, JSON.stringify(fd, null, 2), (err) => {
  if (err) {
    console.error(err);
  }
  // file written successfully
});
