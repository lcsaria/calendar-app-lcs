| ---------------- | ---------------- |
| OS | Windows 7 |
| Laptop Brand | Lenovo G560 |
|Node.JS Version | v13.13.0 |
|NPM Version | v6.14.4 |
| ---------------- | ---------------- |

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Step by Step

In the project directory, you can run:
Install dependencies
### npm install

Run Server
### npm run start
Open [http://localhost:8081](http://localhost:8081) to view mock API it in the browser.
Open [http://localhost:3000](http://localhost:3000) to view the front end in the browser.

API Documentation

| Method | Endpoint|Payload|Misc. |
| ---------------- | ---------------- | ---------------- | ---------------- |
| POST  |/login|	{ email, password }	|email: guest@email.com password: Pass123| 
| GET	  |/appointment|		| | 
| POST	|/appointment|	{ name, date, status }	| status: (pending, completed)| 
| PUT	|/appointment/:id	| { name, date, status } |	status: (pending, completed)| 
| PATCH	|/appointment/:id	| { status } |	status: (pending, completed)| 
| DELETE	|/appointment/:id	| | 	


