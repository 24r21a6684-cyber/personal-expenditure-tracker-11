# Personal Expenditure Tracker — Lab Activity

## Aim
To create a simple webpage to add, view, and delete personal expenses and store them in MongoDB.

## Software requirements
- Node.js and npm
- VS Code or another text editor
- MongoDB Atlas account
- Web browser

## Project structure
```text
personal-expenditure-lab/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## Configure MongoDB Atlas
1. Create/sign in at https://www.mongodb.com/atlas/database.
2. Create a cluster if a free option is available.
3. Create a database user.
4. In Network Access, allow your current IP address. Avoid broad access rules where possible.
5. Select Connect > Drivers > Node.js and copy the connection string.

## Set up the project
1. Extract the ZIP and open the folder in VS Code.
2. Copy `.env.example` to a file named `.env`.
3. Replace the sample `MONGODB_URI` with your actual Atlas connection string.
4. Keep `DB_NAME=expenseDB`.
5. Never share `.env` or upload it to GitHub.

## Run
In the terminal opened in the project folder, run:
```bash
npm install
npm start
```
Open http://localhost:3000. Do not open index.html directly from the file manager.

## Database
Database: `expenseDB`; collection: `expenses`.

Example document:
```json
{
  "name": "Lunch",
  "amount": 150,
  "category": "Food",
  "date": "2026-10-15"
}
```
MongoDB adds an `_id` field automatically.

## API endpoints
- `GET /api/expenses` — list expenses
- `POST /api/expenses` — save an expense
- `DELETE /api/expenses/:id` — delete an expense

## How it works
HTML creates the form and table. CSS styles the page. Browser JavaScript sends requests with `fetch()` to the Express server. Express uses the MongoDB driver to save, retrieve, and delete records. The browser never connects directly to MongoDB.

## Sample test
Add Lunch ₹150 (Food), Bus ₹40 (Travel), and Books ₹80 (Education). The expected total for those three sample entries is ₹270. Enter these through the webpage; they are not preloaded.

Check Atlas > Browse Collections to verify the saved records.

## Result
A simple Personal Expenditure Tracker was developed using HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB. It can add, display, and delete expense records and calculate total expenditure.

## Troubleshooting
- If `MONGODB_URI` is missing, check `.env` is in the project root.
- If MongoDB connection fails, check the connection string, database user, cluster status, and Atlas Network Access.
- If port 3000 is busy, set `PORT=3001` in `.env` and open http://localhost:3001.
