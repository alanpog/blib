#!/usr/bin/env bun
import { spawn, ChildProcess } from "child_process";
import path from "path";
import { watch } from "fs";

const args = process.argv.slice(2);
const helpMessage = "I'm the bext script.";

// Initialize buildMapProcess with a type of ChildProcess | null
let buildMapProcess: ChildProcess | null = null;

const runBuildMap = () => {
  // Determine the path to the buildMap binary
  const buildMapPath = path.join(
    process.cwd(),
    "node_modules",
    ".bin",
    "buildMap"
  );

  // Kill the previous buildMap process if it's still running
  if (buildMapProcess) {
    buildMapProcess.kill();
    buildMapProcess = null;
  }

  // Execute buildMap
  console.log("Running buildMap...");
  buildMapProcess = spawn(buildMapPath, [], { stdio: "inherit" });

  buildMapProcess.on("error", (err) => {
    console.error(`Failed to start buildMap process: ${err.message}`);
  });

  buildMapProcess.on("exit", (code) => {
    if (code === 0) {
      console.log("buildMap completed successfully.");
    } else {
      console.error(`buildMap exited with code ${code}`);
    }
  });
};

const watchAppDirectory = () => {
  const appDirectory = path.join(process.cwd(), "src", "app");
  console.log(`Watching for file changes in ${appDirectory}...`);

  // Initial run
  runBuildMap();

  // Set up watch using Bun's native file watching capabilities
  watch(appDirectory, { recursive: true }, (event, filename) => {
    console.log(`Detected ${event} in ${filename}`);
    runBuildMap();
  });
};

const runDev = () => {
  watchAppDirectory();
  console.log("import.meta.dir", import.meta.dir);
  console.log("import.meta.url", import.meta.url);
  console.log("process.cwd()", process.cwd());
  console.log(__dirname, "dirname");

  const packageSrcPath = path.join(__dirname, "..", "dist", "run.js");
  const bunProcess = spawn("bun", ["run", "--watch", packageSrcPath], {
    stdio: ["inherit", "inherit", "pipe"], // Keep stdio configuration for stderr to "pipe"
  });

  // Listen to stderr and log any data received
  bunProcess.stderr.on("data", (data) => {
    console.error(`Bun process stderr: ${data}`);
  });

  bunProcess.on("error", (err) => {
    console.error(`Failed to start bun process: ${err.message}`);
  });

  bunProcess.on("exit", (code, signal) => {
    if (code !== null) {
      console.log(`Bun process exited with code ${code}`);
    } else if (signal !== null) {
      console.error(`Bun process was terminated by signal ${signal}`);
    }
  });
};

switch (args[0]) {
  case "help":
    console.log(helpMessage);
    break;
  case "dev":
    runDev();
    break;
  default:
    console.log(helpMessage);
    break;
}
