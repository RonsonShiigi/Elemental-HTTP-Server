const http = require("http");
const fs = require("fs");
const host = "localhost";
const port = 8080;
const querystring = require("querystring");
let count = 3;
const server = http.createServer((req, res) => {
  //   console.log("req", req);
  const { url, method } = req;
  //   console.log("url", url);
  //   console.log(method);
  if (method === "GET") {
    switch (url) {
      case "/css/styles.css":
        //   console.log("css");
        fs.readFile("./public/css/styles.css", (err, data) => {
          if (err) {
            console.log(err);
          } else {
            res.write(data.toString());
            res.end();
          }
        });

        break;
      case "/index.html":
      case "/":
        //   console.log("boom");
        fs.readFile("./public/index.html", (err, data) => {
          if (err) {
            console.log(err);
          } else {
            //   console.log(data.toString());
            res.write(data.toString());
            res.end();
          }
        });
        break;
      case "/hydrogen.html":
        //   console.log("boom");
        fs.readFile("./public/element/hydrogen.html", (err, data) => {
          if (err) {
            console.log(err);
          } else {
            res.write(data.toString());
            res.end();
          }
        });
        break;
      case "/helium.html":
        //   console.log("helium");

        fs.readFile("./public/element/helium.html", (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log(data.toString());
            res.write(data.toString());
            res.end();
          }
        });
        break;
      case "/favicon.ico":
        res.end();
        break;
      default:
        console.log(url);
        console.log(url.toString());
        fs.readFile("./public/element" + url, (err, data) => {
          if (err) {
            console.log(err);
            console.log("peekaBOO");
            fs.readFile("public/error.html", (err, data) => {
              if (err) {
                console.log("fuckno");
                console.log(err);
              } else {
                res.write(data.toString());
                res.end();
              }
            });
          } else {
            console.log(data.toString());
            res.write(data.toString());
            res.end();
          }
        });
        break;
    }
  } else if (method === "POST") {
    // count++;
    console.log("postthisFUCKAH");
    let body = [];
    req
      .on("data", chunk => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();
        let newElement = querystring.parse(body);
        // console.log(newElement);
        let elName = newElement.elementName.toLowerCase();
        console.log(elName);
        fs.writeFile(
          `public/element/${elName}.html`,
          createElementFile(newElement),
          err => {
            if (err) {
              console.log(err);
            }
          }
        );
        updateHTML();
      });
  }
});

server.listen(port, () => {
  console.log("server is fucking going");
});

server.on("error", err => {
  throw err;
});
const createElementFile = data => {
  const {
    elementName,
    elementSymbol,
    elementAtomicNumber,
    elementDescription
  } = data;

  let newHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>The Elements - ${elementName}</title>
    <link rel="stylesheet" href="/css/styles.css" />
  </head>

  <body>
    <h1>${elementName}</h1>
    <h2>${elementSymbol}</h2>
    <h3>Atomic number ${elementAtomicNumber}</h3>
    <p>
      ${elementDescription}
    </p>
    <p><a href="/">back</a></p>
  </body>
</html>`;

  return newHTML;
};

let newIndexPage = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>The Elements</title>
    <link rel="stylesheet" href="/css/styles.css" />
  </head>

  <body>
    <h1>The Elements</h1>
    <h2>These are all the known elements.</h2>
    <h3>These are ${count}</h3>
    <ol>
     
    </ol>
  </body>
</html>`;
let splitted = newIndexPage.split("</ol>");

function updateHTML() {
  count++;
  fs.readdir("public/element", (err, data) => {
    // console.log(data);
    data.map(item => {
      console.log("item", item);
      let capMe = item.split(".")[0];
      console.log("capMe", capMe);
      let name = capMe.charAt(0).toUpperCase() + capMe.slice(1);
      console.log("name", name);

      let newLi = `<li>
        <a href="/${item}">${name}</a></li>`;
      console.log(newLi);

      splitted.splice(1, 0, newLi);
      console.log(splitted);
      let finalHTML = splitted.join("");

      fs.writeFile("public/index.html", finalHTML, function(err) {
        if (err) {
          console.log(err);
        }
      });
    });

    // console.log(splitted);
  });
}
// console.log(fs);

//   res.statusCode = 200;
//   res.setHeader("Content-Type", "text/plain");
//   res.end("jigggaNIgga\n");
