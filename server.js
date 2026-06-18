const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "az-smm-panel",
  resave: false,
  saveUninitialized: false
}));

/* ================= DATABASE ================= */

mongoose.connect("mongodb+srv://makmudof_db_user:SENIN_SIFREN@smm-panel.k76emoz.mongodb.net/?retryWrites=true&w=majority");

const User = mongoose.model("User", {
  username: String,
  password: String,
  balance: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false }
});

const Order = mongoose.model("Order", {
  user: String,
  service: String,
  link: String,
  qty: Number,
  status: { type: String, default: "gözləyir" }
});

/* ================= DİZAYN (ORTADA) ================= */

const style = `
<style>
body{
  margin:0;
  font-family:Arial;
  background:#0f172a;
  color:#fff;
  display:flex;
  justify-content:center;
  align-items:center;
  min-height:100vh;
}

.container{
  width:100%;
  display:flex;
  justify-content:center;
}

.card{
  background:#1e293b;
  padding:20px;
  border-radius:12px;
  width:360px;
  text-align:center;
  box-shadow:0 10px 25px rgba(0,0,0,0.4);
}

input,button{
  width:90%;
  padding:10px;
  margin:6px 0;
  border-radius:8px;
  border:none;
}

button{
  background:#3b82f6;
  color:#fff;
  cursor:pointer;
}

a{color:#38bdf8;text-decoration:none}
</style>
`;

/* ================= HOME ================= */

app.get("/", (req,res)=>{
  res.send(style+`
  <div class="container">
    <div class="card">
      <h2>🚀 SMM Panel</h2>
      <p>Xoş gəldiniz</p>
      <a href="/register">Qeydiyyat</a><br><br>
      <a href="/login">Giriş</a>
    </div>
  </div>`);
});

/* ================= REGISTER ================= */

app.get("/register",(req,res)=>{
  res.send(style+`
  <div class="container">
    <div class="card">
      <h2>Qeydiyyat</h2>
      <form method="POST" action="/register">
        <input name="username" placeholder="İstifadəçi adı"/>
        <input name="password" type="password" placeholder="Şifrə"/>
        <button>Yarat</button>
      </form>
    </div>
  </div>`);
});

app.post("/register", async (req,res)=>{
  const hash = await bcrypt.hash(req.body.password,10);

  await User.create({
    username:req.body.username,
    password:hash,
    balance:0,
    isAdmin:false
  });

  res.redirect("/login");
});

/* ================= LOGIN ================= */

app.get("/login",(req,res)=>{
  res.send(style+`
  <div class="container">
    <div class="card">
      <h2>Giriş</h2>
      <form method="POST" action="/login">
        <input name="username" placeholder="İstifadəçi adı"/>
        <input name="password" type="password" placeholder="Şifrə"/>
        <button>Daxil ol</button>
      </form>
    </div>
  </div>`);
});

app.post("/login", async (req,res)=>{
  const user = await User.findOne({ username:req.body.username });

  if(!user) return res.send("İstifadəçi tapılmadı ❌");

  const ok = await bcrypt.compare(req.body.password, user.password);
  if(!ok) return res.send("Şifrə səhvdir ❌");

  req.session.user = user;
  res.redirect("/panel");
});

/* ================= PANEL ================= */

app.get("/panel",(req,res)=>{
  if(!req.session.user) return res.redirect("/login");

  const u = req.session.user;

  res.send(style+`
  <div class="container">
    <div class="card">

      <h2>📊 Panel</h2>
      <p>👤 ${u.username}</p>
      <p>💰 Balans: ${u.balance} AZN</p>

      <hr>

      <h3>Sifariş yarat</h3>
      <form method="POST" action="/order">
        <input name="service" placeholder="Xidmət"/>
        <input name="link" placeholder="Link"/>
        <input name="qty" placeholder="Miqdar"/>
        <button>Sifariş et</button>
      </form>

      <br>
      <a href="/logout">Çıxış</a>

    </div>
  </div>`);
});

/* ================= ORDER ================= */

app.post("/order", async (req,res)=>{
  await Order.create({
    user:req.session.user.username,
    service:req.body.service,
    link:req.body.link,
    qty:req.body.qty
  });

  res.send(style+`
  <div class="container">
    <div class="card">
      ✔ Sifariş göndərildi
      <br><br>
      <a href="/panel">Geri</a>
    </div>
  </div>`);
});

/* ================= LOGOUT ================= */

app.get("/logout",(req,res)=>{
  req.session.destroy();
  res.redirect("/");
});

/* ================= START ================= */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));  console.log("SMM Panel işləyir 🚀");
});
