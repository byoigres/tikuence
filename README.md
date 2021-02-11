# Tikuence

## Endpoints

### Authentication

| Method | Endpoint | Type | Description |
| --- | --- | --- | --- |
| `/login` | `GET` | `view` | Login view |
| `/auth/google` | `GET` | `data` | Google authentication |
| `/auth/google/callback` | `GET` | `data` | Google authentication redirect |

### List

| Method | Endpoint | Type | Secure | Same User | Description |
| --- | --- | --- | --- | --- | --- |
| `GET` | `/` | `view` | `false` | `false` | Root view |
| `GET` | `/list/add` | `view` | `true` | `false` | Add new list modal | 
| `POST` | `/list` | `data` | `true` | `true` | Create a list | 
| `GET` | `/list` | `view` | `false` | `false` | Same as root view | 
| `PUT` | `/list/:listId` | `true` | `true` | `data` | Update list (title) | 
| `DELETE` | `/list/:listId` | `data` | `true` | `true` | Delete a list | 

### Video

| Method | Endpoint | Type | Description |
| --- | --- | --- | --- |
| `/list/:listId/video/add` | `GET` | `view` | Add video modal | 
| `/list/:listId/video/:videoId` | `GET` | `view` | View a video | 
| `/list/:listId/video` | `POST` | `data` | Append a video to the list | 
| `/list/:listId/video/:videoId` | `DELETE` | `data` | Delete the video  from the list| 
| `/list/:listId/video/:videoId` | `POST` | `data` | Update the video  order from the list| 

### Profile

| Method | Endpoint | Type | Description |
| --- | --- | --- | --- |
| `/profile` | `GET` | `view` | Shows user profile | 
| `/profile/lists` | `GET` | `view` | Shows user lists | 