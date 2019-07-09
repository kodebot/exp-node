const express = require("express");
const LogSearchService = require("./services/log-search.service");

const app = new express();
const logSearchService = new LogSearchService();

app.get("/log/search", (req, res) => {
    (async() => {
        let result = await logSearchService.search(req.query);
        res.send(result);
    })();
});

app.listen(9080);