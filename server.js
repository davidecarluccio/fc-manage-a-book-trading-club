require("dotenv").config({ verbose: true });
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");

// Connessione a MongoDB
mongoose
  .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Successfully connected to the database"))
  .catch((err) => console.error("Error connecting to database:", err));

// Rotte
const index = require("./routes/index");
const users = require("./routes/users");
const settings = require("./routes/settings");
const books = require("./routes/books");
const addBook = require("./routes/addBook");
const getBook = require("./routes/getBook");
const trade = require("./routes/trade");

// Inizializzazione dell'app
const app = express();

// Configurazione del motore di template
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", exphbs({ defaultLayout: "layout" }));
app.set("view engine", "handlebars");

// Middleware per BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Cartella statica
app.use(express.static(path.join(__dirname, "public")));

// Configurazione sessione
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true,
  })
);

// Inizializzazione di Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Variabili globali
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Rotte
app.use("/", index); // Homepage
app.use("/users", users); // Registrazione e login
app.use("/settings", settings); // Pagina delle impostazioni
app.use("/books", books); // Visualizzazione libri
app.use("/add", addBook); // Aggiungere nuovi libri
app.use("/getBook", getBook); // Informazioni sui libri
app.use("/trade", trade); // Gestione delle richieste di scambio

// Gestione di 404
app.use((req, res) => {
  res.status(404).render("404");
});

// Avvio del server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
