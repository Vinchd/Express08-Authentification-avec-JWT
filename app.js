require("dotenv").config();
const express = require("express");

const { validateMovie, validateUser } = require("./validators.js");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const database = require("./database");
const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");
const { hashPassword, verifyPassword, verifyToken } = require("./auth.js");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUsersById);

app.post("/api/movies", verifyToken, validateMovie, movieHandlers.postMovie);
app.post("/api/users", validateUser, hashPassword, userHandlers.postUser);
app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);
app.put("/api/users/:id", validateUser, hashPassword, userHandlers.updateUser);

app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.delete("/api/users/:id", userHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
