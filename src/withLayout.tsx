import { Html } from "@elysiajs/html";
import Bun from "bun";

const withLayout = (WrappedComponent: Html.Component, isHx: boolean) => {
  return () => {
    // Use Bun.resolveSync to synchronously resolve the path to Layout component
    const layoutPath = Bun.resolveSync("./src/layout.tsx", process.cwd());
    const Layout = require(layoutPath).default;

    return (
      <Layout isHx={isHx}>
        <WrappedComponent />
      </Layout>
    );
  };
};

export default withLayout;
