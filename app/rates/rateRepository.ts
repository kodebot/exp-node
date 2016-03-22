/// <reference path="../../typings/main/ambient/firebase/firebase.d.ts" />
import Firebase = require("firebase");

class RateRepository {
    private _xcngrRef: Firebase;
    constructor() {
        this._xcngrRef = new Firebase("https://xcngrtest.firebaseio.com/");
        this._xcngrRef.authWithCustomToken("wq85CqPwTadQSwxIr99P3FS69w0MnEpKjExzQJ68", (err, authData) => { if (!err) { console.log("auth success;") } });
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

export var rateRepository = new RateRepository();