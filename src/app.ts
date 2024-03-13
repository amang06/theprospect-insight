import api from "../api";

const express = require('express');
const app = express();
const port = 3000;

app.use("api/v1", api)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;