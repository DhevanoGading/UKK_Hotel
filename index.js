//inisialisasi
const express = require("express");
const cors = require("cors");
const db = require("./db");

//implementasi
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

//connect to database
db.connect(error =>{
    if(error) throw error
    console.log("mysql connected");
});

//endpoint
app.get("/", (req, res) => {
    res.send({
        message: "Berhasil menjalankan GET",
        data: {
            description: "Berhasil menampilkan data"
        },
    });
});

app.use("/user", require("./Routes/user.route"));
app.use("/tipe-kamar", require("./Routes/tipe_kamar.route"));
app.use("/kamar", require("./Routes/kamar.route"));
app.use("/pemesanan", require("./Routes/pemesanan.route"));
app.use("/detail-pemesanan", require("./Routes/detail_pemesanan.route"));

const port = 8888;
app.listen(port, () => console.log(`App running at ${port}`));