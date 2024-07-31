## User Authentication and Registration API Documentation

This API allows users to authenticate using their mobile number and OTP, and to register by providing additional details.

## Endpoints

### 1. Send OTP
**URL:** `/send-otp`  
**Method:** `POST`  
**Authentication:** Not Required  
**Description:** This endpoint allows users to request an OTP to be sent to their mobile number.

**Request Body:**
```json
{
    "phoneNumber": "string"
}
```

**Response:**
- `200 OK`: OTP sent successfully.
```json
{
    "success": true,
    "msg": "OTP sent successfully",
    "otp": "string",  // For testing purposes
    "phoneNumber": "string"
}
```
- `400 Bad Request`: Error message.

### 2. Verify OTP
**URL:** `/verify-otp`  
**Method:** `POST`  
**Authentication:** Not Required  
**Description:** This endpoint allows users to verify the OTP sent to their mobile number.

**Request Body:**
```json
{
    "phoneNumber": "string",
    "otp": "string"
}
```

**Response:**
- `200 OK`: OTP verified successfully.
```json
{
    "success": true,
    "token": "string",  // JWT token
    "isFirstTime": true  // Indicates if the user is logging in for the first time
}
```
- `400 Bad Request`: Incorrect OTP or OTP has expired.
- `500 Internal Server Error`: Error message.

### 3. Register User
**URL:** `/register`  
**Method:** `POST`  
**Authentication:** Required  
**Description:** This endpoint allows authenticated users to register by providing additional details. Avatar upload is supported.

**Request Body:**
```json
{
    "phoneNumber": "string",
    "name": "string",
    "dob": "string",
    "email": "string",
    "image": "string"  // Base64 encoded image or URL
}
```

**Response:**
- `200 OK`: Registration completed successfully.
```json
{
    "success": true,
    "msg": "Registration complete",
    "user": {
        "_id": "string",
        "phoneNumber": "string",
        "name": "string",
        "dob": "string",
        "email": "string",
        "avatar": "string",  // URL to the uploaded avatar
        "isFirstTime": false
    }
}
```
- `400 Bad Request`: User not found.
- `500 Internal Server Error`: Error message.

## Middleware

### `auth` Middleware
This middleware ensures that the user is authenticated before accessing the endpoints. It checks for a valid JWT token in the request headers.

## Models

### User Model
**Fields:**
- `phoneNumber`: String, required
- `name`: String, required
- `dob`: Date, required
- `email`: String, required
- `avatar`: String, optional
- `isFirstTime`: Boolean, default true

### OtpModel
**Fields:**
- `phoneNumber`: String, required
- `otp`: String, required
- `otpExpiration`: Date, required

## Example Requests

### Send OTP
```bash
curl -X POST http://localhost:3000/send-otp -H "Content-Type: application/json" -d '{
    "phoneNumber": "+1234567890"
}'
```

### Verify OTP
```bash
curl -X POST http://localhost:3000/verify-otp -H "Content-Type: application/json" -d '{
    "phoneNumber": "+1234567890",
    "otp": "123456"
}'
```

### Register User
```bash
curl -X POST http://localhost:3000/register -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{
    "phoneNumber": "+1234567890",
    "name": "John Doe",
    "dob": "1990-01-01",
    "email": "john.doe@example.com",
    "image": "base64EncodedImageString"
}'
```

## Conclusion
This documentation provides an overview of the user authentication and registration API endpoints, request/response formats, and error handling. Ensure to replace `<token>` with a valid JWT token for authenticated requests.

# Donation API Documentation

## Overview
This API allows users to interact with the donation platform, including listing donation items, adding donation categories, and adding donation items. Authentication is required for all endpoints.

## Authentication Middleware
The `auth` middleware is used to ensure that the user is authenticated before accessing the endpoints.

## Endpoints

### 1. Create a Donation Item
**URL:** `/donate`  
**Method:** `POST`  
**Authentication:** Required  
**Description:** This endpoint allows authenticated users to create a donation item.

**Request Body:**
```json
{
    "title": "string",
    "description": "string",
    "imageURL": "string",
    "category": "string", // Category ID
    "address": "string" // address
}
```

**Response:**
- `200 OK`: Donation item created successfully.
```json
{
    "userdonateItemDetails": {
        "_id": "string",
        "title": "string",
        "description": "string",
        "imageURL": "string",
        "category": "string",
        "user": "string",
        "address":"string",
        "__v": 0
    },
    "success":true,
    "msg":"Donation Item Created Successfully"
}
```
- `400 Bad Request`: Category not found.
- `500 Internal Server Error`: Error message.

### 2. Create a Donation Category
**URL:** `/donateCategory`  
**Method:** `POST`  
**Authentication:** Required  
**Description:** This endpoint allows authenticated users to create a donation category.

**Request Body:**
```json
{
    "name": "string"
}
```

**Response:**
- `201 Created`: Donation category created successfully.
```json
{
    "_id": "string",
    "name": "string",
    "user": "string",
    "__v": 0
}
```
- `400 Bad Request`: Error message.

### 3. Get Donation Items
**URL:** `/donationItems`  
**Method:** `GET`  
**Authentication:** Required  
**Description:** This endpoint allows authenticated users to retrieve all donation items.

**Response:**
- `200 OK`: Donation items retrieved successfully.
```json
{
    "donationItems": [
        {
            "_id": "string",
            "title": "string",
            "description": "string",
            "imageURL": "string",
            "category": {
                "_id": "string",
                "name": "string",
                "user": "string",
                "__v": 0
            },
            "user": {
                "_id": "string",
                "name": "string",
                "email": "string",
                "__v": 0
            },
            "__v": 0
        },
        ...
    ]
}
```
- `500 Internal Server Error`: Error message.

### 3. Get Donation Category
**URL:** `/donateCategory`  
**Method:** `GET`  
**Authentication:** not Required  

**Response:**
- `200 OK`: Donation Category retrieved successfully.
```json
[
    {
        "_id": "66a4be4d6668021166e30bc5",
        "name": "clothes",
        "user": "669f96ad80a2c21b29fd18d0",
        "__v": 0
    },
    {
        "_id": "66a4d5b96668021166e30bfc",
        "name": "others",
        "user": "669f96ad80a2c21b29fd18d0",
        "__v": 0
    },
    {
        "_id": "66a4d5c16668021166e30c00",
        "name": "items",
        "user": "669f96ad80a2c21b29fd18d0",
        "__v": 0
    },
    {
        "_id": "66a4d5d06668021166e30c05",
        "name": "Donate Money",
        "user": "669f96ad80a2c21b29fd18d0",
        "__v": 0
    }
]```
- `400 Bad Request`: Error message.
## Models

### DonationItem Model
**Fields:**
- `title`: String, required
- `description`: String, required
- `imageURL`: String, required
- `category`: ObjectId, ref `DonationCategory`, required
- `user`: ObjectId, ref `User`, required

### DonationCategory Model
**Fields:**
- `name`: String, required
- `user`: ObjectId, ref `User`, required

## Error Handling
Errors are handled by returning appropriate HTTP status codes and error messages.

## Example Request
```bash
curl -X POST http://localhost:3000/donate -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{
    "title": "Clothes Donation",
    "description": "Gently used clothes",
    "imageURL": "http://example.com/image.jpg",
    "category": "60c72b2f9b1d8e001cf9d2e8"
}'
```

## Conclusion
This documentation provides an overview of the donation API endpoints, request/response formats, and error handling. Ensure to replace `<token>` with a valid JWT token for authenticated requests.

