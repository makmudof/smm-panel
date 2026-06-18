const express = require("express");
const session = require("express-session");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "panel-secret",
  resave: false,
  saveUninitialized: false
}));

const USER = { username: "admin", password: "1234" };

// fake balance
let balance = 50;

// HOME
app.get("/", (req, res) => {
  res.send(`
    <h1>SMM Panel Dashboard</h1>
    <a href="/login">Login</a>
  `);
});

// LOGIN
app.get("/login", (req, res) => {
  res.send(`
    <form method="POST" action="/login">
      <input name="username" placeholder="Username" />
      <input name="password" type="password" placeholder="Password" />
      <button>Login</button>
    </form>
  `);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    req.session.auth = true;
    return res.redirect("/dashboard");
  }

  res.send("Login failed ❌");
});

// DASHBOARD
app.get("/dashboard", (req, res) => {
  if (!req.session.auth) return res.redirect("/login");

  res.send(`
    <h1>Dashboard 🚀</h1>
    <p>Balance: $${balance}</p>

    <form method="POST" action="/order">
      <input name="service" placeholder="Service (instagram ads, design...)" />
      <input name="amount" placeholder="Amount" />
      <button>Order</button>
    </form>

    <a href="/logout">Logout</a>
  `);
});

// ORDER SYSTEM
app.post("/order", (req, res) => {
  if (!req.session.auth) return res.redirect("/login");

  const { service, amount } = req.body;

  res.send(`
    <h2>Order received ✔️</h2>
    <p>Service: ${service}</p>
    <p>Amount: ${amount}</p>
    <a href="/dashboard">Back</a>
  `);
});

// LOGOUT
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on " + PORT));
