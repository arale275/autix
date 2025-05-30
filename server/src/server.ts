import app from "./app";

const PORT = 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log("AUTIX Server running on port " + PORT);
});
