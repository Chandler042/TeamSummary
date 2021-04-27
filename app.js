const Engineer = require("./jslab/Engineer");
const Intern = require("./jslab/Intern");
const Manager = require("./jslab/Manager");
const inquirer = require("inquirer");
const fs = require("fs");
const render = require("./jslab/htmlRenderer");
const path = require("path");
const { run } = require("jest")

//validatin functions
function validateInput(input) {
    if (input) {
        return true;
    }
    return "Give a value."
}

function validateEmail(email) {
    if (/\S+@\S+\.\S+/.test(email)) {
      return /\S+@\S+\.\S+/.test(email);
    }
    return "Please enter a valid email address.";
}


//arrays

const employeesData = [];
const questionsArray = [
    {
        type: "input",
        name: "name",
        message: "Employee name?",
        validate: validateInput,
    },
    {
        type: "list",
        name: "role",
        message: "Employee's Role?",
        choices: ["Manager", "Engineer", "Intern"],
    },
    {
        type: "input",
        name: "id",
        message: "Employee ID:",
        validateInput: validateEmail,
    },
    {
        type: "input",
        name: "email",
        message: "Enter email?",
        validate: "validateEmail",
    },
    {
        type: "input",
        name: "officeNumber",
        message: "Manager's Office Number:",
        validate: validateInput,
        when: function (response) {
            return response.role == "Manager";
        },
    },
    {
        type: "input",
        name: "github",
        message: "Engineer's Github Username:",
        validate: validateInput,
        when: function (response) {
            return response.role == "Engineer";
        },
    },
    {
        type: "input",
        name: "school",
        message: "Intern's School Name:",
        validate: validateInput,
        when: function (response) {
            return response.role == "Intern";
        },
    },
    {
        type: "list",
        name: "addAnother",
        message: "Add another Employee?",
        choices: ["Yes, add another.", "No, render my new page."],
    },
];

//Path
const OUTPUT_DIR = path.resolve(_dirname, "output");
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
            const managersData = employeesData.filter(({role}) => {
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

            const engineerData = employeesData.filter(({role}) => {
                return role == "Engineer";
            });

            const engineerArray = [];

            engineerData.forEach((engineer) => {
                const member = new Engineer(
                    engineer.name,
                    engineer.id,
                    engineer.email,
                    engineer.github
                );
                engineerArray.push(member);
            });

            const internData = employeesData.filter(({role}) => {
                return role == "Intern";
            });

            const internArray = [];
            internData.forEach((intern) => {
                const member = new Intern(
                    intern.name,
                    intern.id,
                    intern.email,
                    intern.school
                );
                internArray.push(member);
            });

            const employeeArray = [
                ...managersArray,
                ...engineerArray,
                ...internArray,
            ];

            const renderTeam = render(employeeArray);
            fs.writeFile(outputPath, renderTeam, function (err) {
                if (err) throw err;
                console.log(
                    "See new 'team' file in the 'output' folder."
                );
            });
        }
    })
    .catch((error) => {
        if (error) throw error;
    });
}

runInquirer();