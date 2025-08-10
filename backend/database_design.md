
# Database Schema

This document outlines the database schema for the EForgeIT project, based on the Mongoose models.

## User Model (`user.model.ts`)

Represents the users of the application.

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Required | The user's full name. |
| `email` | String | Required, Unique | The user's email address. Used for login and communication. |
| `password` | String | Required | The user's hashed password. This field is not selected by default in queries. |
| `role` | String | Enum: `"student"`, `"admin"`, `"supervisor"`. Default: `"student"` | The user's role within the system. |
| `isVerified` | Boolean | Default: `false` | Indicates if the user has verified their email address. |
| `createdAt` | Date | Timestamp | The date and time when the user was created. |
| `updatedAt` | Date | Timestamp | The date and time when the user was last updated. |

## Token Model (`token.model.ts`)

Stores tokens for various purposes, such as email verification and password reset.

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `type` | String | Required | The type of token (e.g., "VERIFY_EMAIL", "RESET_PASSWORD"). |
| `email` | String | Required | The email address of the user associated with the token. |
| `isUsed` | Boolean | Required, Default: `false` | Indicates if the token has already been used. This field is not selected by default in queries. |
| `expiresAt` | Date | | The date and time when the token expires. An index is set on this field to automatically delete expired tokens. |
| `createdAt` | Date | Timestamp | The date and time when the token was created. |
| `updatedAt` | Date | Timestamp | The date and time when the token was last updated. |

## QuizResult Model (`quiz.model.ts`)

Stores the results of quizzes taken by users.

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `userId` | ObjectId | Ref: "User" | A reference to the user who took the quiz. |
| `email` | String | Required, Unique, Lowercase, Trim | The email of the user who took the quiz. |
| `step` | Number | Required, Enum: `1`, `2`, `3` | The step of the quiz the user has completed. |
| `answers` | Map of String | Required | A map of question IDs to the user's answers. |
| `scorePercent` | Number | Required | The user's score in the quiz, as a percentage. |
| `certification` | String | Required | The certification level achieved by the user. |
| `proceedToNextStep` | Boolean | Required | Indicates if the user is allowed to proceed to the next step of the quiz. |
| `createdAt` | Date | Timestamp | The date and time when the quiz result was created. |
| `updatedAt` | Date | Timestamp | The date and time when the quiz result was last updated. |

