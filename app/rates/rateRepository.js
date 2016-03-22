"use strict";
/// <reference path="../../typings/main/ambient/firebase/firebase.d.ts" />
var Firebase = require("firebase");
var RateRepository = (function () {
    function RateRepository() {
        this._xcngrRef = new Firebase("https://xcngrtest.firebaseio.com/");
        this._xcngrRef.authWithCustomToken("wq85CqPwTadQSwxIr99P3FS69w0MnEpKjExzQJ68", function (err, authData) { if (!err) {
            console.log("auth success;");
        } });
    }
    RateRepository.prototype.postRate = function (provider, record, cb) {
        if (!provider) {
            throw new Error("provider must be specified");
        }
        return this._xcngrRef.child("rates/" + provider).push(record, function (err) {
            console.log("push completeted");
            return cb(err);
        });
    };
    return RateRepository;
}());
exports.rateRepository = new RateRepository();
//# sourceMappingURL=rateRepository.js.map