# Services Folder

This folder contains business logic, API calls, and service layer functions.

## What goes here:
- **API services** - Functions that make API calls
- **Business logic** - Core application logic
- **Data processing** - Functions that process or transform data
- **External integrations** - Third-party service integrations

## Best practices:
- Keep services focused on specific domains
- Use async/await for API calls
- Include proper error handling
- Make services testable and reusable
- Separate API calls from business logic when possible

## What NOT to put here:
- React components (that goes in components/)
- UI logic (that goes in components/)
- State management (that goes in store/)
