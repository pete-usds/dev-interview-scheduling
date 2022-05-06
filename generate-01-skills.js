const { faker } = require("@faker-js/faker");
var fs = require("fs");

var recordsToGenerate = 5;
var outfile = "docs/skills.json";

var communities = ["Engineering", "Product", "Design", "Procurement"];

// Just generate 5 adjectives per COP to start with

var fd = {};

communities.forEach((element) => {
  fd[element] = [];
});

for (var x = 0; x < recordsToGenerate; x++) {
  communities.forEach((element) => {
    fd[element].push(faker.company.bs());
  });
}

console.log(JSON.stringify(fd, null, 2));

fs.writeFile(outfile, JSON.stringify(fd, null, 2), (err) => {
  if (err) {
    console.error(err);
  }
  // file written successfully
});
