
# API Documentation

## Authentication

### Login

- **URL**: `/login`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "token": "string"
  }
  ```

### New User Creation

- **URL**: `/users`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "_id": "string",
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```

### Get All Users

- **URL**: `/users`
- **Method**: `GET`
- **Response**:
  ```json
  [
    {
      "_id": "string",
      "name": "string",
      "email": "string"
    }
  ]
  ```

### Get User by ID

- **URL**: `/users/:id`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "_id": "string",
    "name": "string",
    "email": "string"
  }
  ```

### Update User

- **URL**: `/users/:id`
- **Method**: `PATCH`
- **Body**: 
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "_id": "string",
    "name": "string",
    "email": "string"
  }
  ```

### Delete User

- **URL**: `/users/:id`
- **Method**: `DELETE`
- **Response**:
  ```json
  {
    "_id": "string",
    "name": "string",
    "email": "string"
  }
  ```

## Blogs

### Create Blog

- **URL**: `/blogs`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "title": "string",
    "content": "string",
    "featured_img": "string"
  }
  ```
- **Response**:
  ```json
  {
    "_id": "string",
    "title": "string",
    "content": "string",
    "featured_img": "string",
    "added_by": "string"
  }
  ```

### Get All Blogs

- **URL**: `/blogs`
- **Method**: `GET`
- **Response**:
  ```json
  [
    {
      "_id": "string",
      "title": "string",
      "content": "string",
      "featured_img": "string",
      "added_by": {
        "name": "string",
        "email": "string"
      }
    }
  ]
  ```

### Get Blog by ID

- **URL**: `/blogs/:id`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "_id": "string",
    "title": "string",
    "content": "string",
    "featured_img": "string",
    "added_by": {
      "name": "string",
      "email": "string"
    }
  }
  ```

### Get Blogs by User ID

- **URL**: `/blogs/user/:id`
- **Method**: `GET`
- **Response**:
  ```json
  [
    {
      "_id": "string",
      "title": "string",
      "content": "string",
      "featured_img": "string",
      "added_by": "string"
    }
  ]
  ```

### Update Blog

- **URL**: `/blogs/:id`
- **Method**: `PATCH`
- **Body**: 
  ```json
  {
    "title": "string",
    "content": "string",
    "featured_img": "string"
  }
  ```
- **Response**:
  ```json
  {
    "_id": "string",
    "title": "string",
    "content": "string",
    "featured_img": "string",
    "added_by": "string"
  }
  ```

### Delete Blog

- **URL**: `/blogs/:id`
- **Method**: `DELETE`
- **Response**:
  ```json
  {
    "_id": "string",
    "title": "string",
    "content": "string",
    "featured_img": "string",
    "added_by": "string"
  }
  ```

## Comments

### Add Comment

- **URL**: `/blogs/:id/comments`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "content": "string"
  }
  ```
- **Response**:
  ```json
  {
    "_id": "string",
    "content": "string",
    "added_by": {
      "name": "string"
    },
    "blog": "string"
  }
  ```

### Get All Comments

- **URL**: `/blogs/:id/comments`
- **Method**: `GET`
- **Response**:
  ```json
  [
    {
      "_id": "string",
      "content": "string",
      "added_by": {
        "name": "string"
      },
      "blog": "string"
    }
  ]
  ```

## Authors

### Get All Authors

- **URL**: `/authors`
- **Method**: `GET`
- **Response**:
  ```json
  [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "blogs": [
        {
          "_id": "string",
          "title": "string",
          "content": "string"
        }
      ]
    }
  ]
  ```

## Image Upload

### Upload Image

- **URL**: `/upload-image`
- **Method**: `POST`
- **Body**: FormData with an `image` field
- **Response**:
  ```json
  {
    "url": "string"
  }
  ```

## Admin

### Get Blogs by Admin

- **URL**: `/admin/blogs`
- **Method**: `GET`
- **Response**:
  ```json
  [
    {
      "_id": "string",
      "title": "string",
      "content": "string",
      "featured_img": "string",
      "added_by": "string"
    }
  ]
  ```

### Get Blog by Admin

- **URL**: `/admin/blogs/:id`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "_id": "string",
    "title": "string",
    "content": "string",
    "featured_img": "string",
    "added_by": "string"
  }
  ```
```