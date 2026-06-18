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

app.get("/", (req, res) => {
  res.send("<h1>Home</h1><a href='/login'>Login</a>");
});

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
    return res.send("LOGIN SUCCESS 🚀");
  }

  res.send("WRONG LOGIN ❌");
});

app.listen(3000, () => {
  console.log("Server running");
});
