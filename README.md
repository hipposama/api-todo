<h1 align="left">Todo Web API</h1>

###

<img align="right" height="140" src="https://media.tenor.com/vrhQ8sgVmEQAAAAM/todo-todo-aoi.gif"  />

###

<p align="left">Welcome to the Todo API documentation. This API allows you to manage tasks and activities in the Todo application programmatically.</p>

###

<h3 align="left">Can download websit is here : https://github.com/hipposama/website-todo</h3>

###

<h2 align="left">Configuration</h2>

###

Don't forget to update `server.js` on line 12 to replace the `allowedOrigins` array with your own URLs

```bash
const allowedOrigins = ['http://localhost:3000', 'https://yourdomain.com'];
```

## Database Schema

### Todo Table

| Column Name | Data Type     | Description                       |
|-------------|---------------|-----------------------------------|
| id          | varchar(36)   | Unique ID of the todo item        |
| user_email  | varchar(255)  | Email of the user associated with the todo |
| title       | varchar(255)  | Title of the todo item            |
| progress    | int           | Progress of the todo item         |
| date        | varchar(255)  | Date related to the todo item     |

### Users Table

| Column Name | Data Type     | Description                       |
|-------------|---------------|-----------------------------------|
| email       | varchar(255)  | Email of the user (Primary Key)   |
| password    | varchar(255)  | Encrypted password of the user    |
