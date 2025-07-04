# CPA

**CPA** (Cost Per Action Platform) is a web-based rewards and earnings platform where users can earn money by completing simple tasks such as downloading apps or sharing referral links. The platform also supports a referral system, enabling users to earn additional rewards when their invited friends participate.


## ⚠️ This is a very old project 

---

## Features

- **Task Marketplace**: New tasks are added daily, allowing users to earn by completing tasks or by sharing task links for others to complete.
- **Referral Program**: Users can refer friends and earn a percentage of their friends' earnings.
- **Earnings Dashboard**: Users can track their current balance, earnings history, and referral bonuses.
- **Multiple Payout Options**: Supports payouts via Paytm, UPI, and PayPal, with high rates (up to $0.1 per click for some tasks).
- **Admin Dashboard**: Admins can view and process user payout requests.
- **Authentication**: Secure user authentication using Passport.js with local strategy and bcrypt for password hashing.
- **Email Verification**: Users receive verification emails for account security.

---

## Getting Started

### Prerequisites

- Node.js and npm installed
- MySQL database (ensure credentials and database name are set in `config/database.js`)

### Installation

```bash
# Clone this repository
git clone https://github.com/Aadilhassan/cpa.git
cd cpa

# Install dependencies
npm install

# Configure your database credentials in config/database.js

# Start the application
node index.js
```

The app will run on the default port 8080 (or 8888, based on your environment).

---

## Usage

- Visit the home page to sign up and start completing tasks.
- Access your dashboard to view your profile, earnings, and available tasks.
- Withdraw your earnings using your preferred payout method when you reach the minimum threshold.
- Refer friends to increase your earning potential.

---

## Project Structure

- `index.js`: Entry point, sets up Express app, sessions, and Passport.js.
- `app/routes.js`: Main routes for authentication, task handling, rewards, payouts, and admin operations.
- `config/database.js`: MySQL connection configuration.
- `config/passport.js`: Passport.js local authentication configuration.
- `views/`: EJS templates for rendering UI (dashboard, profile, admin, etc.).

---

## Contributing

Contributions are welcome!  
Please open an issue or submit a pull request for improvements or bug fixes.


---

## Contact

Created by [Aadilhassan](https://github.com/Aadilhassan)  
For questions or suggestions, open an issue or contact via GitHub.

---
