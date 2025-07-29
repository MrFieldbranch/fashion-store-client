# Fashion Store Client

This is the frontend client for the **Fashion Store** project - an online dummy fashion store
where users can browse products, like items, manage a shopping basket, and place orders.

The app is built with **React**, **TypeScript**, and **Vite**, and it communicates with a custom
ASP.NET Core API using JWT authentication.

---

## Technologies Used
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- Custom CSS (no framework)
- LocalStorage for token management
- Fetch API (with optional `AbortController`support)

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) and npm

### Run Locally
Clone the project and install dependencies:

```bash
git clone https://github.com/MrFieldbranch/fashion-store-client.git
cd fashion-store-client
npm install
```

Start the development server:

```bash
npm run dev
```

The app will be available at:
`http://localhost:5173`

### API Communication
This frontend connects to a custom-built ASP.NET Core Web API.
It uses fetch to make requests and sends the JWT token (if logged in) via the Authorization header:
```http
Authorization: Bearer {token}
```
Tokens are stored in localStorage after login and are automatically included in protected requests.

## Features
- Register and log in as a user
- View most popular products by sex
- Filter products by category and sex
- Like/unlike products
- Manage a shopping basket
- Place orders and view past orders
- Responsive design for mobile and desktop

## Configuration
Before running the project, create a `.env.local` file in the root with the following content:
```env
VITE_API_URL=https://localhost:8000
```

## Deployment
This app can be deployed to any static hosting provider (e.g., Vercel, Netlify, or Render).
Make sure to set the correct API base URL in your environment variables or configuration.

## License
This project is licensed under the MIT License.


