import {WebDriver, Builder} from "selenium-webdriver";

var driver = new Builder()
    .forBrowser('firefox')
    .build();
  
 export default driver; 
    
