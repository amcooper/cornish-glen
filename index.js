require("dotenv").config();

const app = require("./server.js");
const PORT = process.env.PORT;

app.listen( PORT, () => {
  console.log(`[cornish-glen] Listening on port no. ${PORT}`);
});