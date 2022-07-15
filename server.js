const express = require("express");
const expressGraphQL = require("express-graphql");
const schema = require("./schema");

const app = express();

// add headers to allow CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT",
        "POST",
        "PATCH",
        "DELETE",
        "GET"
      );
      return res.status(200).json({});
    }
    next();
  });

app.use('/graphql', expressGraphQL.graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(4000, () => {
    console.log("SERVER RUNNING ON PORT 4000")
})