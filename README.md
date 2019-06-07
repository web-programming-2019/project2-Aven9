# Project 2

Web programming assignment. Project  2.

## Usage

User inputs username to login, once username is committed, channels of user will be loaded. User can create channel by clicking **Add Channel Button**. Each Item of channels list is a button, by which provides sending message function or loading message function.

> Tip: running need export setting, flask run —no-reload, and, most important, proxy on.

 

## Feature

- No database except for localStorage.
- Messages loaded in a channel will only display to certain users whose channel list contains it.
- Message loading is implemented by Ajex.
- Single page app.
- Split View is used though still look not good.
- User's sending message choice happens before loading message.



## Data Format

In this assignment, all the user data is stored in localStorage due to database is not allowed to use in the assignment. Data format is designed as follow:

```javascript
// demostration
/**
 * localStorage :
 * {
 *     users {
 *         "user_1" : { "channels": ["channel_1", "channel_2", "channel_3"] },
 *         "user_2" : { "channels": ["channel_1", "channel_3", "channel_4"] }
 *     },
 *
 *     currentUser: "user_1",
 *
 *     channels {
 *         "channel_1" : {
 *              "users" : ["user_1", "user_2, "user_3"] ,
 *              "msgs" : [
 *                  {"user": "user_1",
 *                  "content": "content_someting",
 *                  "timestamp": timestamp_1},
 *                  {"user": "user_2",
 *                  "content": "content_someting",
 *                  "timestamp": timestamp_2}
 *              ]

 *         },
 *         "channel_2" : {
 *							"users" : ["user_1, user_3"] ,
 *							"msgs" : [
 *                  {"user": "user_1",
 *                  "content": "content_someting",
 *                  "timestamp": timestamp_1},
 *                  {"user": "user_3",
 *                  "content": "content_someting",
 *                  "timestamp": timestamp_3}
 *              ]
 *					}
 *     }
 *
 * }
 * **/
```