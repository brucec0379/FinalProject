How to run:

1. Make sure node.js and mongodb installed & mongodb service started
2. In client folder run: `npm install`, then: `npm start`
3. In server folder run: `npm install`, then: `npm start`
4. Open http://localhost:3000 in browser

Roles of functions:

1. Anonymous. Can view movies, view profiles, login/register.
2. User. All functions of anonymous. plus add comment, add bookmark, and follow/unfollow other users.
3. Reviewer. All functions of anonymous. plus review/delete comments make by all users.
4. Admin. All functions of reviewer, plus user management.
