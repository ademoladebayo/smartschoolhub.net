export default class Config {
  APP_MODE = "DEV";
  SCHOOL_NAME = "realprivateschool"; //realprivateschool
  url = {
    ip: "",
    domain: "",
  };

  constructor() {
    if (this.APP_MODE == "DEV") {
      // DEVELOPMENT IP
      this.url.ip = "http://127.0.0.1:8000";
      this.url.domain =
        "http://localhost/smartschoolhub.net/" + this.SCHOOL_NAME;
    } else if (this.APP_MODE == "LIVE") {
      // LIVE IP
      this.url.ip = "https://smartschoolhub.net/backend/" + this.SCHOOL_NAME;
      this.url.domain = "https://" + this.SCHOOL_NAME + ".smartschoolhub.net";
    } else {
       // TEST-LIVE IP
       this.url.ip = "https://smartschoolhub.net/backend/" + this.SCHOOL_NAME;
       this.url.domain =
        "http://localhost/smartschoolhub.net/realprivateschool";// + this.SCHOOL_NAME;
    }
  }
}
