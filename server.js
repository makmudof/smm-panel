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

// balans
let balance = 50;

// ANA SƏHİFƏ
app.get("/", (req, res) => {
  res.send(`
    <h1>SMM Panel</h1>
    <a href="/login">Giriş et</a>
  `);
});

// LOGIN SƏHİFƏSİ
app.get("/login", (req, res) => {
  res.send(`
    <h2>Giriş</h2>
    <form method="POST" action="/login">
      <input name="username" placeholder="İstifadəçi adı" />
      <input name="password" type="password" placeholder="Şifrə" />
      <button>Giriş et</button>
    </form>
  `);
});

// LOGIN YOXLAMA
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
    <p>Balans: $${balance}</p>

    <form method="POST" action="/order">
      <input name="service" placeholder="Xidmət (reklam, dizayn...)" />
      <input name="amount" placeholder="Miqdar" />
      <button>Sifariş et</button>
    </form>

    <a href="/logout">Çıxış</a>
  `);
});

// SİFARİŞ
app.post("/order", (req, res) => {
  if (!req.session.auth) return res.redirect("/login");

  const { service, amount } = req.body;

  res.send(`
    <h2>Sifariş qəbul edildi ✔️</h2>
    <p>Xidmət: ${service}</p>
    <p>Miqdar: ${amount}</p>
    <a href="/dashboard">Geri</a>
  `);
});

// ÇIXIŞ
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// PORT (Railway üçün vacib)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server işləyir: " + PORT);
});
