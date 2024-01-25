1. Develop a Node.js-based Client API:
   - Implement endpoints to enroll users, list available books, get a single book by ID, and filter books by publishers or categories.
   - Allow users to borrow books by specifying the duration in days.
   - Implement a data store specific to this service.

2. Develop a Node.js-based Admin API:
   - Create endpoints for adding new books, removing books, and fetching/listing enrolled users and their borrowed books.
   - Display the availability status of books and the expected return day.
   - Implement a separate data store for this service.

3. Establish a method for the two services to exchange updates:
   - Ensure that the Client API updates with the most recent book added by the Admin API.

4. Docker setup:
   - Design Docker setups for both the Client API and Admin API to ensure portability and easy deployment.

5. Implement unit and integration tests:
   - Write tests to verify the functionality of each API endpoint and ensure robustness.

6. Handle book availability:
   - Implement logic to remove books from the catalog once borrowed and display their availability status.