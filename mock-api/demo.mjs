// Starts the mock API and the Next.js dev server together.
import { spawn } from "node:child_process";

const run = (cmd, args, name) => {
  const child = spawn(cmd, args, { stdio: "inherit", shell: true });
  child.on("exit", (code) => {
    console.log(`[${name}] exited (${code})`);
    process.exit(code ?? 0);
  });
  return child;
};

const mock = run("node", ["mock-api/server.mjs"], "mock");
const web = run("bun", ["run", "dev"], "web");
const stop = () => { mock.kill(); web.kill(); process.exit(0); };
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
