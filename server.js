import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import Recipe from "./models/recipes";

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

// DeprecationWarning: current URL string parser is deprecated,
// and will be removed in a future version. To use the new parser,
// pass option { useNewUrlParser: true } to MongoClient.connect.
mongoose.connect(
  "mongodb://localhost:27017/recipes",
  { useNewUrlParser: true }
);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB dataBase connection established successfully!");
});

router.route("/recipes").get((req, res) => {
  Recipe.find((err, recipes) => {
    if (err) {
      console.log(err);
    } else {
      res.json(recipes);
    }
  });
});

router.route("/recipes/:id").get((req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (err) {
      console.log(err);
    } else {
      res.json(recipe);
    }
  });
});

router.route("/recipes/add").post((req, res) => {
  let recipe = new Recipe(req.body);
  recipe
    .save()
    .then(recipe => {
      res.status(200).json({ recipe: "Added successfully" });
    })
    .catch(err => {
      res.status(400).send("Failed to create new record");
    });
});

router.route("/recipes/update/:id").post((req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (!recipe) {
      return next(new Error("Could not load document"));
    } else {
      recipe.title = res.body.title;
      recipe.description = res.body.description;

      recipe
        .save()
        .then(recipe => {
          res.json("Update done");
        })
        .catch(err => {
          res.status(400).send("Update failed");
        });
    }
  });
});

router.route("/recipes/delete/:id").post((req, res) => {
  Recipe.findByIdAndRemove({ _id: req.params.id }, (err, recipe) => {
    if (err) {
      res.json(err);
    } else {
      res.json("Remove successfully");
    }
  });
});

app.use("/", router);

app.listen(4000, () => console.log("Express server running on port 4000"));
