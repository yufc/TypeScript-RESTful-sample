/// <reference path="_all.d.ts" />
"use strict";

import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import * as logger from "morgan";
import { Route } from "./routes";
import cookieParser = require("cookie-parser");


/**
 * The server.
 *
 * @class Server
 */
class Server {

  public app: express.Application;
  private router: Route;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   */
  public static bootstrap(): Server {
    return new Server(new Route());
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor(private route: Route) {
    //create expressjs application
    this.app = express();
    this.router = route;
    //configure application
    this.config();
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   * @return void
   */
  private config() {
    //configure jade
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "jade");
    //mount logger
    this.app.use(logger("dev"));
    //mount json form parser
    this.app.use(bodyParser.json());
    //mount query string parser
    this.app.use(bodyParser.urlencoded({ extended: true }));
    //add static paths
    this.app.use(express.static(path.join(__dirname, "public")));
    this.app.use(express.static(path.join(__dirname, "bower_components")));
    this.app.use("/", this.router.getRouter());
    // catch 404 and forward to error handler
    this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
      var error = new Error("Not Found");
      err.status = 404;
      next(err);
    });
  }
}

var server = Server.bootstrap();
export = server.app;
