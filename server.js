const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send(
    "<h1>Express Demo</h1> <h4>Message:Success</h4> <p>Version 1.0 😜🤪</p>"
  );
});

app.get("/products", (req, res) => {
  res.send([
    {
      productId: "1",
      price: 100,
    },
    {
      productId: "2",
      price: 150,
    },
  ]);
});

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
