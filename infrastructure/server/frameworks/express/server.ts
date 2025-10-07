import app from "./app";
import { config } from "dotenv";

config();
app.listen(process.env.PORT, function() {
    console.log("Server started on port " + process.env.PORT)
})