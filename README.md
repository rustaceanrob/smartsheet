# Smartsheet Demo

# Background

Smartsheet’s new client, BlackRock, uses a Smartsheet sheet to manage their new investment portfolio in technology stocks. They have an internal application that fetches stock information and allows analysts to add a stock for approval. The portfolio manager is able to approve and deny stocks from the sheet. When an analyst sees their stock is not yet approved, or denied, they can add a discussion to the row on the sheet.

# Startup

```markdown
yarn
cd backend && flask run -h localhost -p 5002
cd .. && yarn dev
```
