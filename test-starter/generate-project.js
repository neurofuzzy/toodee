#!/usr/local/bin/node

var fs = require("fs");
var { execSync } = require("child_process");

var templates = [
  ".gitignore", 
  "package.json", 
  "index.html", 
  "tsconfig.json", 
  "src/main.ts", 
  "src/delegate.ts",
];

console.log("\nHello from TOODEE project generator!\n")

function usage () {
  console.log("USAGE:");
  console.log("node generate.js [project-name]")
}

function processTemplateFile (relativeFilePath) {
  console.log("processing", relativeFilePath, "...");
  var fileData = fs.readFileSync(__dirname + "/" + relativeFilePath, { encoding: "utf8" });
  fileData = fileData.replace(/\{\{projectName\}\}/g, prj);
  fs.writeFileSync(prjDir + "/" + relativeFilePath, fileData, { encoding: "utf8" });
}

var args = process.argv;

// check args

if (args.length < 3) {
  usage();
  process.exit(1);
}

var prj = args[args.length - 1];
var force = args[args.length - 2] == "--force";

// sanitize 

prj = prj.replace(/[^a-z0-9\-]/gi, "");

if (prj.length < 1 || prj.length > 32) {
  usage();
  process.exit(1);
}

var prjDir = __dirname + "/../" + prj;

// no clobber

if (fs.existsSync(prjDir)) {
  if (!force) {
    console.error("project exists");
    process.exit(1);
  }
} else {
  fs.mkdirSync(prjDir);
}

// verify

if (!fs.existsSync(prjDir)) {
  console.error("project directory could not be created");
  process.exit(1);
}

console.log("Generating project", prj, "...");

// src dir

if (!fs.existsSync(prjDir + "/src")) {
  fs.mkdirSync(prjDir + "/src");
}

// verify

if (!fs.existsSync(prjDir + "/src")) {
  console.error("project src directory could not be created");
  process.exit(1);
}

// templates

for (file in templates) {
  processTemplateFile(templates[file]);
}

console.log("running npm install ...");

execSync("npm i", { cwd: prjDir, windowsHide: true });

console.log("building source ...");

execSync("tsc --build", { cwd: prjDir, windowsHide: true });

console.log("adding folder to workspace ...");

execSync("code --add \"" + prjDir + "\"", { windowsHide: true });

console.log("DONE!");
