export default class Lopx {
	constructor(options) {
		this.options = options;
	}

	apply(compiler) {
		compiler.hooks.done.tap("DemoPlugin", () => {
			console.log("\nHello world\n");
		});
	}
}

//const authors = require("parse-authors");
//const importFrom = require("import-from"); // used to get the users project details form their working dir
//const reporter = require("./reporter-util"); // webpack stats formatters & helpers
//const server = require("./server.js"); // client server
//const fs = require("fs");

//export defualt class Jarvis {
//  constructor(opts = {}) {
//    const currentWorkingDirectory = process.cwd();
//    opts.host = opts.host || "localhost";
//    opts.port = parseInt(opts.port || 1337, 10);
//    opts.keepAlive = !!opts.keepAlive;
//    opts.packageJsonPath = opts.packageJsonPath || currentWorkingDirectory;
//    opts.watchOnly = opts.watchOnly !== false;

//    if (opts.port && isNaN(opts.port)) {
//      console.error(
//        `[JARVIS] error: the specified port (${opts.port}) is invalid. Reverting to 1337`
//      );
//      opts.port = 1337;
//    }

//    if (opts.packageJsonPath && !fs.existsSync(opts.packageJsonPath)) {
//      console.warn(
//        `[JARVIS] warning: the specified path (${opts.packageJsonPath}) does not exist. Falling back to ${currentWorkingDirectory}`
//      ); //Fallback to cwd and warn
//      opts.packageJsonPath = currentWorkingDirectory;
//    }

//    this.options = opts;

//    this.env = {
//      clientEnv: process.env.NODE_ENV,
//      running: false, // indicator if our express server + sockets are running
//      watching: false
//    };

//    this.sockets = {};

//    this.reports = {
//      stats: {},
//      progress: {},
//      project: {}
//    };

//    this.sokr;

//    this.pkg = importFrom(this.options.packageJsonPath, "./package.json");
//  }
//  apply(compiler) {
//    const { name, version, author: makers } = this.pkg;
//    const normalizedAuthor = parseAuthor(makers);

//    this.reports.project = { name, version, makers: normalizedAuthor };

//    let jarvis;
//    let jarvisBooting;
//    let { port, host } = this.options;

//    const bootJarvis = () => {
//      if (jarvis || jarvisBooting) return;

//      jarvisBooting = true;
//      jarvis = this.server = server.init(
//        compiler,
//        this.env.clientEnv === "development"
//      );

//      jarvis.http.listen(port, host, _ => {
//        console.log(`[JARVIS] Starting dashboard on: http://${host}:${port}`);
//        this.env.running = true;
//        jarvisBooting = false;
//        // if a new client is connected push current bundle info
//        jarvis.io(jarvis.http.server).on("connection", socket => {
//          this.sokr = socket;
//          this.sockets[socket.id] = socket;
//          socket.emit("project", this.reports.project);
//          socket.emit("progress", this.reports.progress);
//          socket.emit("stats", this.reports.stats);
//          //socket.on("disconnect", () => {
//          //  delete this.sockets[socket.id];
//          //});
//        });
//      });
//    };

//    if (!this.options.watchOnly && !this.env.running) {
//      bootJarvis();
//    }

//    compiler.hooks.watchRun.tap("webpack-jarvis", c => {
//      if (this.options.watchOnly) bootJarvis();
//      this.env.watching = true;
//      return c.hooks.done.tap("webpack-jarvis", () => true);
//    });

//    compiler.hooks.run.tap("webpack-jarvis", c => {
//      this.env.watching = false;
//      return c.hooks.done.tap("webpack-jarvis", () => true);
//    });

//    // report the webpack compiler progress
//    //compiler.apply(
//    //  new webpack.ProgressPlugin((percentage, message) => {
//    //    this.reports.progress = { percentage, message };
//    //    if (this.env.running) {
//    //      jarvis.io.emit("progress", { percentage, message });
//    //    }
//    //  })
//    //);

//    // extract the final reports from the stats!
//    compiler.hooks.done.tap("webpack-jarvis", stats => {
//      console.log("DONE");
//      //if (!this.env.running) return;

//      const jsonStats = stats.toJson({ chunkModules: true });
//      jsonStats.isDev = this.env.clientEnv === "development";
//      this.reports.stats = reporter.statsReporter(jsonStats);
//    });
//  }
//}

//function parseAuthor(author) {
//  if (author?.name) return author;
//  if (typeof author === "string") {
//    const authorsArray = authors(author);
//    if (authorsArray.length > 0) {
//      return authorsArray[0];
//    }
//  }
//  return { name: "", email: "", url: "" };
//}
