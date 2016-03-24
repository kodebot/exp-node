"use strict";
/// <reference path="../../typings/main/definitions/es6-promise/es6-promise.d.ts" />
/// <reference path="../../typings/main/ambient/firebase/firebase.d.ts" />
const Firebase = require("firebase");
class RateRepository {
    constructor() {
        this._xcngrRef = new Firebase("https://xcngrtest.firebaseio.com/");
        this._xcngrRef.authWithCustomToken("wq85CqPwTadQSwxIr99P3FS69w0MnEpKjExzQJ68", (err, authData) => { if (!err) {
            console.log("auth success;");
        } });
    }
    postRate(provider, record, cb) {
        if (!provider) {
            throw new Error("provider must be specified");
        }
        return this._xcngrRef.child("rates/" + provider).push(record, err => {
            console.log("push completeted");
            return cb(err);
        });
    }
}
exports.rateRepository = new RateRepository();
//# sourceMappingURL=rateRepository.js.map