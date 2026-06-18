const express = require("express");
const session = require("express-session");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "manual-panel",
  resave: false,
  saveUninitialized: false
}));

const USER = { username: "admin", password: "1234" };

// USER BALANCE
let balance = 0;

// PENDING TOPUPS (admin təsdiq üçün)
let pendingTopups = [];

// HOME
app.get("/", (req, res) => {
  res.send(`
    <h1>SMM Panel</h1>
    <a href="/login">Giriş</a>
  `);
});

// LOGIN
app.get("/login", (req, res) => {
  res.send(`
    <form method="POST" action="/login">
      <input name="username" placeholder="İstifadəçi adı" />
      <input name="password" type="password" placeholder="Şifrə" />
      <button>Giriş</button>
    </form>
  `);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    req.session.auth = true;
    return res.redirect("/dashboard");
  }

  res.send("Giriş səhvdir ❌");
});

// DASHBOARD
app.get("/dashboard", (req, res) => {
  if (!req.session.auth) return res.redirect("/login");

  res.send(`
    <h1>Panel 🚀</h1>
    <p>Balans: ${balance} AZN</p>

    <form method="POST" action="/topup">
      <input name="amount" placeholder="Balans artır (AZN)" />
      <button>Göndər</button>
    </form>

    <a href="/logout">Çıxış</a>
  `);
});

// TOPUP REQUEST (USER)
app.post("/topup", (req, res) => {
  if (!req.session.auth) return res.redirect("/login");

  const amount = Number(req.body.amount);

  if (!amount || amount <= 0) {
    return res.send("Yanlış məbləğ ❌");
  }

  pendingTopups.push({
    user: USER.username,
    amount: amount
  });

  res.send(`
    <h2>Sorğu göndərildi ✔️</h2>
    <p>Admin təsdiq edəndən sonra balans artacaq</p>
    <a href="/dashboard">Geri</a>
  `);
});

// ADMIN PANEL
app.get("/admin", (req, res) => {
  if (!req.session.auth) return res.send("Access denied ❌");

  let list = pendingTopups.map((t, i) => `
    <li>
      ${t.user} - ${t.amount} AZN
      <a href="/approve/${i}">Təsdiq et</a>
    </li>
  `).join("");

  res.send(`
    <h1>Admin Panel</h1>
    <ul>${list}</ul>
    <a href="/dashboard">User panel</a>
  `);
});

// APPROVE TOPUP
app.get("/approve/:id", (req, res) => {
  const id = req.params.id;

  const item = pendingTopups[id];

  if (!item) return res.send("Tapılmadı");

  balance += item.amount;

  pendingTopups.splice(id, 1);

  res.send(`
    <h2>Təsdiq edildi ✔️</h2>
    <a href="/admin">Geri</a>
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
