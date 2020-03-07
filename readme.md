# Task Manager

Task manager is a Node.Js, express, mongoDB based application. 

Task Manager Featues:
- Create Tasks
- Edit Tasks
- Accounts
- Sending emails with sendgrid
- Filtering 
- Pagenation

## Installation 

Required:
- Node.js (10.10.0 is recommended)

Enviroment Variable:
These should be located in the /config folder at the root of the project, with the following naming convention (test.env, prod.env, dev.env). With the following details.

- PORT=
- SENDGRID_API_KEY=
- JSON_KEY=
- MONGODB_URL=

Setup:
- "npm install"
- "npm start" or "npm run dev"