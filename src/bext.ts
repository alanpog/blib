#!/usr/bin/env bun
import { spawn } from "child_process";
import path from "path";

const args = process.argv.slice(2);

const helpMessage = "I'm the bext script.";

const runDev = () => {
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
