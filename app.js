const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https')


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/" , (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data ={
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us4.api.mailchimp.com/3.0/lists/60d9c119b8";

    const options = {
        method: "POST",
        auth: "nazih:fe8868628a4b5d3a9e66356a1590d87d-us4",
    }

   const request =  https.request(url, options, (response) => {

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else {
            res.sendFile(__dirname + "/failure.html");
        }

         response.on("data", (data) => {
             console.log(JSON.parse(data));
         });
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", (req, res) => {
    res.redirect("/");
})



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

// api key: fe8868628a4b5d3a9e66356a1590d87d-us4
// list id: 60d9c119b8