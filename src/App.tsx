import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import fs from "fs";
import withLayout from "./withLayout";

async function renderPageComponent(pageName: string, isHx: boolean) {
  const pagePath = Bun.resolveSync(
    `./src/app/${pageName}/page.tsx`,
    process.cwd()
  );
  if (fs.existsSync(pagePath)) {
    const PageComponent: { default: () => JSX.Element } = await import(
      pagePath
    );
    const WrappedPageComponent = withLayout(PageComponent.default, isHx);
    return <WrappedPageComponent />;
  } else {
    return "404 Page Not Found!";
  }
}

export const App = new Elysia()
  .onError(({ code, error }) => {
    console.log("Error", code, error);
    return new Response("Elysia error:" + error.toString() + " " + error.stack);
  })
  .use(html())
  .use(staticPlugin())
  .derive(({ headers }) => ({
    isHx: headers["hx-request"] === "true",
  }))
  .get("/", async ({ isHx }) => {
    return renderPageComponent("", isHx);
  })
  .get("/*", async ({ params, isHx }) => {
    return renderPageComponent(params["*"], isHx);
  });
