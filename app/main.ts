import {M2indiaProvider} from "./providers/m2indiaProvider";
import {XendPayProvider} from "./providers/XendPayProvider";

var m2indiaProvider = new M2indiaProvider();
var xendPayProvider = new XendPayProvider();
xendPayProvider.getRates();