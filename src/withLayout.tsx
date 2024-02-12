import { Html } from "@elysiajs/html";
import Bun from "bun";

const withLayout = (WrappedComponent: () => JSX.Element, isHx: boolean) => {
  return () => {
    if (isHx) {
      return (
        <>
          <WrappedComponent />
        </>
      );
    } else {
      const layoutPath = Bun.resolveSync("./src/layout.tsx", process.cwd());
      const Layout = require(layoutPath).default;
      return (
        <Layout>
          <WrappedComponent />
        </Layout>
      );
    }
  };
};

export default withLayout;
