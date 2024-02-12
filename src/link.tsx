/// <reference types="@kitajs/html/htmx.d.ts" />

type ComponentMapModule = {
  getComponentPath: (component: () => JSX.Element) => string | undefined;
};

// Construct an absolute path manually
const layoutPath = `${process.cwd()}/.bext/ComponentMap.ts`;
const componentMapModule = require(layoutPath) as ComponentMapModule;
const { getComponentPath } = componentMapModule;

export const Link = (
  props: Html.PropsWithChildren<{ fn: () => JSX.Element; class?: string }>
) => {
  const path = getComponentPath(props.fn);
  return (
    <a
      href={path}
      hx-target="#main"
      hx-push-url={path === "/" ? "/" : "true"}
      hx-sync="a:replace"
      class={props.class}
    >
      {props.children}
    </a>
  );
};
