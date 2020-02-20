## RESTful routing

### CRUD

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
