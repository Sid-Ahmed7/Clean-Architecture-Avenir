import { config } from "dotenv";
config();
import app from "./app";

app.listen(process.env.PORT, function() {
    console.log("Server started on port " + process.env.PORT)
})