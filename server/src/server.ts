import dotenv from 'dotenv';

dotenv.config();


import app from "./app";


const PORT = Number(process.env.PORT) || 3001;


app.listen(PORT, "0.0.0.0", () => {

  console.log("AUTIX Server running on port " + PORT);

});
