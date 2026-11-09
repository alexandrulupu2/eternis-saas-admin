const express = require("express");
const path = require("path");
const AdminController = require("./src/controllers/AdminController");
const UserController = require("./src/controllers/UserController");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta principala duce la Panoul Preotului
app.get("/", (req, res) => res.redirect("/parohie"));

// Rute Utilizator / Preot (SaaS User View & API)
app.get("/parohie", UserController.dashboard);
app.post("/api/user/generate-ai", UserController.generateAiContent);

// Rute Admin MVC
app.get("/admin", AdminController.dashboard);
app.get("/admin/user/add", AdminController.renderAddUser);
app.post("/admin/user/add", AdminController.storeUser);
app.get("/admin/user/edit/:id", AdminController.renderEditUser);
app.post("/admin/user/edit/:id", AdminController.updateUser);
app.post("/admin/user/add-credits/:id", AdminController.addCredits);
app.get("/admin/user/delete/:id", AdminController.destroyUser);

app.listen(PORT, () => {
  console.log(`Serverul Eternis ruleaza pe http://localhost:${PORT}`);
});