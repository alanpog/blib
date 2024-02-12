import { Html } from "@elysiajs/html";
import Bun from "bun";
import BaseLayout from "./BaseLayout";

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
        <BaseLayout>
          <Layout>
            <WrappedComponent />
          </Layout>
        </BaseLayout>
      );
    }
  };
};

export default withLayout;
