### Task: Implement User-Specific URLs
### User Story
```
As a user of the lunar calendar app
I want each person to have their own unique URL (like /user/3a38042e-c69c-4662-baf5-44bce945c4f7)
So that multiple people can use the app without mixing their data, and I can bookmark/share my personal calendar link

Acceptance Criteria
 Generate unique user ID on first visit
 Store user ID in URL path (e.g., /user/{userId})
 Isolate localStorage data per user ID
 Redirect root / to a new user URL if no userId exists
 Allow users to bookmark and return to their specific URL
 Ensure data doesn't leak between different user URLs
Technical Approach
Use crypto.randomUUID() for unique ID generation
Update React Router to handle /user/:userId route
Modify 
signature-store.ts
 to use userId-specific storage keys
Add URL detection logic to extract userId from path
Out of Scope
Backend authentication
Multi-device sync
User accounts/login system
```
