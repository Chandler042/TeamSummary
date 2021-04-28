const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const render = require("./lib/htmlRenderer");
const { run } = require("jest");

function validateInput(input) {
  if (input) {
    return true;
  }
  return "Please enter a value.";
}

function validateEmail(email) {
  if (/\S+@\S+\.\S+/.test(email)) {
    return /\S+@\S+\.\S+/.test(email);
  }
  return "Please enter a valid email address.";
}

// Arrays
const employeesData = [];
const questionsArray = [
  {
    type: "input",
    name: "name",
    message: "Enter the employee's name:",
    validate: validateInput,
  },
  {
    type: "list",
    name: "role",
    message: "Choose the employee's role:",
    choices: ["Manager", "Engineer", "Intern"],
  },
  {
    type: "input",
    name: "id",
    message: "Enter the employee's ID:",
    validate: validateInput,
  },
  {
    type: "input",
    name: "email",
    message: "Enter the employee's email:",
    validate: validateEmail,
  },
  {
    type: "input",
    name: "officeNumber",
    message: "Enter this manager's office number:",
    validate: validateInput,
    when: function (response) {
      return response.role == "Manager";
    },
  },
  {
    type: "input",
    name: "github",
    message: "Enter this engineer's GitHub username:",
    validate: validateInput,
    when: function (response) {
      return response.role == "Engineer";
    },
  },
  {
    type: "input",
    name: "school",
    message: "Enter this intern's school name:",
    validate: validateInput,
    when: function (response) {
      return response.role == "Intern";
    },
  },
  {
    type: "list",
    name: "addAnother",
    message: "Add another employee?",
    choices: ["Yes, add another.", "No, render my new page."],
  },
];

//Path
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

//Inquirer
function runInquirer() {
  inquirer
    .prompt(questionsArray)
    .then(function (answers) {
      employeesData.push(answers);

      if (answers.addAnother == "Yes, add another.") {
        runInquirer();
      } else {
        const managersData = employeesData.filter(({ role }) => {
          return role == "Manager";
        });

        const managersArray = [];

        managersData.forEach((manager) => {
          const member = new Manager(
            manager.name,
            manager.id,
            manager.email,
            manager.officeNumber
          );
          managersArray.push(member);
        });

        //Filter out Engineers and convert to objects
        const engineersData = employeesData.filter(({ role }) => {
          return role == "Engineer";
        });

        const engineersArray = [];

        engineersData.forEach((engineer) => {
          const member = new Engineer(
            engineer.name,
            engineer.id,
            engineer.email,
            engineer.github
          );
          engineersArray.push(member);
        });

        //Filter out Engineers and convert to objects
        const internsData = employeesData.filter(({ role }) => {
          return role == "Intern";
        });

        const internsArray = [];

        internsData.forEach((intern) => {
          const member = new Intern(
            intern.name,
            intern.id,
            intern.email,
            intern.school
          );
          internsArray.push(member);
        });

        const employeesArray = [
          ...managersArray,
          ...engineersArray,
          ...internsArray,
        ];

        const renderTeam = render(employeesArray);
        fs.writeFile(outputPath, renderTeam, function (err) {
          if (err) throw err;
          console.log(
            "Render success. See new 'team' file in the 'output' folder."
          );
        });
      }
    })
    .catch((error) => {
      if (error) throw error;
    });
}


runInquirer();