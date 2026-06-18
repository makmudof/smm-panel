const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

let users = [];
let orders = [];

const style = `
<style>
body{margin:0;font-family:Arial;background:#0f172a;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh}
.card{background:#1e293b;padding:20px;border-radius:12px;width:350px;text-align:center}
input,button{width:90%;padding:10px;margin:5px;border-radius:8px;border:none}
button{background:#3b82f6;color:#fff;cursor:pointer}
a{color:#38bdf8}
</style>
`;

app.get("/", (req,res)=>{
  res.send(style+`
  <div class="card">
    <h2>SMM PANEL DEMO</h2>
    <a href="/register">Qeydiyyat</a><br><br>
    <a href="/login">Giriş</a>
  </div>`);
});

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
  if(!u) return res.send("Səhv login");
  res.redirect("/panel");
});

app.get("/panel",(req,res)=>{
  res.send(style+`
  <div class="card">
    <h3>Panel</h3>
    <form method="POST" action="/order">
      <input name="service" placeholder="Service"/>
      <input name="link" placeholder="Link"/>
      <input name="qty" placeholder="Qty"/>
      <button>Sifariş</button>
    </form>
    <a href="/orders">Orders</a>
  </div>`);
});

app.post("/order",(req,res)=>{
  orders.push(req.body);
  res.redirect("/panel");
});

app.get("/orders",(req,res)=>{
  res.send(style+`
  <div class="card">
    <h3>Sifarişlər</h3>
    <pre>${JSON.stringify(orders,null,2)}</pre>
    <a href="/panel">Geri</a>
  </div>`);
});

app.listen(3000,()=>console.log("RUNNING ON http://localhost:3000"));
