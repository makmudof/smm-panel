const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

/* ================= DEMO DATABASE ================= */
let users = [];
let orders = [];

/* ================= STYLE ================= */

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
  <div class="card">
    <h2>🚀 SMM PANEL DEMO</h2>
    <a href="/register">Qeydiyyat</a><br><br>
    <a href="/login">Giriş</a>
  </div>`);
});

/* ================= REGISTER ================= */

app.get("/register",(req,res)=>{
  res.send(style+`
  <div class="card">
    <h3>Qeydiyyat</h3>
    <form method="POST">
      <input name="username" placeholder="Username"/>
      <input name="password" placeholder="Password"/>
      <button>Yarat</button>
    </form>
  </div>`);
});

app.post("/register",(req,res)=>{
  users.push(req.body);
  res.redirect("/login");
});

/* ================= LOGIN ================= */

app.get("/login",(req,res)=>{
  res.send(style+`
  <div class="card">
    <h3>Login</h3>
    <form method="POST">
      <input name="username"/>
      <input name="password"/>
      <button>Giriş</button>
    </form>
  </div>`);
});

app.post("/login",(req,res)=>{
  let u = users.find(x=>x.username==req.body.username && x.password==req.body.password);
  if(!u) return res.send("Səhv login ❌");
  res.redirect("/panel");
});

/* ================= PANEL ================= */

app.get("/panel",(req,res)=>{
  res.send(style+`
  <div class="card">
    <h3>📊 PANEL</h3>
    <form method="POST" action="/order">
      <input name="service" placeholder="Service"/>
      <input name="link" placeholder="Link"/>
      <input name="qty" placeholder="Qty"/>
      <button>Sifariş</button>
    </form>
    <br>
    <a href="/orders">Orders</a>
  </div>`);
});

/* ================= ORDER ================= */

app.post("/order",(req,res)=>{
  orders.push(req.body);
  res.redirect("/panel");
});

/* ================= ORDERS ================= */

app.get("/orders",(req,res)=>{
  res.send(style+`
  <div class="card">
    <h3>Sifarişlər</h3>
    <pre>${JSON.stringify(orders,null,2)}</pre>
    <a href="/panel">Geri</a>
  </div>`);
});

/* ================= START (IMPORTANT FOR RAILWAY) ================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
  console.log("SMM PANEL RUNNING ON " + PORT);
});
