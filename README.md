# Real World Express

## Important files

### [`models/users.js`](./models/users.js)

This file holds all of our helper functions that work with the `usersDB` object. It includes all the code for registering and logging in users.

### [`routes`](./routes)

This folder contains sub-routers to handle specific resources, `users` and `sessions`. Note that these folders don't contain the resource name themselves, this is setup in [`index.js`](./index.js) in the `app.use(prefix, router)` sections.

#### [`routes/users.js`](./routes/users.js)

Handles the routes for registration:

- `GET /users/new` - Shows the registration form
- `POST /users` - Creates the user in our database, and logs that user in

#### [`routes/sessions.js`](./routes/sessions.js)

Handles the routes managing sessions (login/logout):

- `GET /sessions/new` - Shows the login form
- `POST /sessions` - Processes the login info and logs the user in if the info is correct.
- `GET /sessions/logout` - Handles logging out (i.e. deleting the `user_id` cookie)

## RESTful routing

### CRUD

CRUD methods map more or less to the following routes where `resource` is replaced with the name of the resource you're working with:

### CREATE

#### `POST /resource`

Create the resource on our server

#### `GET /resource/new`

Show a form for creating the new resource

### READ

#### `GET /resource`

Index page, list all of the resource (could be paginated, or handle search results through a query string)

#### `GET /resource/:id`

Show page, show a single instance of the given resource

### UPDATE

#### `PUT/PATCH /resource/:id`

Handles update, updating the data in our data store

#### `GET /resource/:id/edit`

Shows an edit form, usually pre-filled with the existing data.

### DELETE

#### `DELETE /resource/:id`

Deletes a resource from the server's data store
