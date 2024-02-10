#!/usr/bin/env bun
import { spawn } from "child_process";
import path from "path";

const args = process.argv.slice(2);
const helpMessage = "I'm the bext script.";

const runDev = async () => {
  // Determine the path to the buildMap binary
  const buildMapPath = path.join(
    process.cwd(),
    "node_modules",
    ".bin",
    "buildMap"
  );

  // Execute buildMap before starting the dev server
  console.log("Running buildMap...");
  const buildMapProcess = spawn(buildMapPath, [], { stdio: "inherit" });

  await new Promise((resolve, reject) => {
    buildMapProcess.on("error", (err) => {
      console.error(`Failed to start buildMap process: ${err.message}`);
      reject(err);
    });

    buildMapProcess.on("exit", (code) => {
      if (code === 0) {
        console.log("buildMap completed successfully.");
        resolve(code);
      } else {
        console.error(`buildMap exited with code ${code}`);
        reject(new Error("buildMap failed"));
      }
    });
  });

  // After buildMap has successfully completed, start the Bun process
  const scriptPath = path.join(process.cwd(), "src", "index.tsx");
  const bunProcess = spawn("bun", ["run", "--watch", scriptPath], {
    stdio: "inherit",
  });

  bunProcess.on("error", (err) => {
    console.error(`Failed to start bun process: ${err.message}`);
  });

  bunProcess.on("exit", (code) => {
    console.log(`Bun process exited with code ${code}`);
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
