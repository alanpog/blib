import { Html } from "@elysiajs/html";

const BaseLayout = (props: Html.PropsWithChildren<{}>) => (
  <html lang="en">
    <head>
      <link rel="stylesheet" href="/public/globals.css" />
      <link rel="icon" type="image/png" href="/public/favicon.png" />
      <script src="https://unpkg.com/htmx.org@1.9.10"></script>
      <title>Mindfulness Funcional</title>
    </head>
    <body hx-boost="true">{props.children}</body>
  </html>
);

export default BaseLayout;
