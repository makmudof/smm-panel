const express = require("express");
const session = require("express-session");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "my-secret",
  resave: false,
  saveUninitialized: false
}));

const USER = {
  username: "admin",
  password: "1234"
};

// HOME
app.get("/", (req, res) => {
  res.send(`
    <h1>Home Page</h1>
    <a href="/login">Login</a>
  `);
});

// LOGIN PAGE
app.get("/login", (req, res) => {
  res.send(`
    <h2>Login</h2>
    <form method="POST" action="/login">
      <input name="username" placeholder="Username" />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  `);
});

// LOGIN CHECK
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    return res.send("<h1>LOGIN SUCCESS 🚀</h1>");
  }

  res.send("WRONG LOGIN ❌");
});

// PORT FIX (Railway üçün vacibdir)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
