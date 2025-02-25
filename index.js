import { visit } from "unist-util-visit";

const RE_SCRIPT_START =
  /<script(?:\s+?[a-zA-z]+(=(?:["']){0,1}[a-zA-Z0-9]+(?:["']){0,1}){0,1})*\s*?>/;
const RE_SRC = /src\s*=\s*"(.+?)"/;

export default function enhancedImage(options) {
  return function transformer(tree) {
    let scripts = "";
    visit(tree, "image", (node) => {
      if (node.url.startsWith(".")) {
        // create a standard url (to cleanly parse the query string)
        const url = new URL(node.url, "http://localhost"); // base url is irrelevant but needed by URL constructor

        // get possible "class" entries from the query string
        const searchParams = new URLSearchParams(url.search);
        const classesInQuery = searchParams.getAll("class");
        searchParams.delete("class");
        // get the rest of the query string as attributes
        const urlParamsAttributes = Object.fromEntries(searchParams);

        // Now, clean possible search params from the node.url
        // (we don't want to pass them to the import statement)
        node.url = node.url.split("?")[0];

        // Generate the class attribute: combine options.classes with classes from the query string (and manage the case where both are empty)
        const classes =
          options.classes || classesInQuery
            ? `class="${options.classes ?? ""} ${classesInQuery.join(" ")}"`
            : "";

        // Combine options.attributes with URL parameters, with URL parameters taking precedence
        const combinedAttributes = {
          ...(options.attributes ?? {}),
          ...urlParamsAttributes,
        };
        const attributes = Object.entries(combinedAttributes)
          .map(([key, value]) => `${key}="${value}"`)
          .join(" ");

        // Generate a unique identifier for the import
        const importName = `_img${Math.random().toString(36).substr(2, 9)}`;

        // Create the import statement
        const importStatement = `import ${importName} from '${decodeURIComponent(
          node.url
        )}?enhanced';\n`;
        scripts += `${importStatement}`;

        // Create the image component
        const imageComponent = `<enhanced:img src={${importName}} alt="${
          node.alt ?? ""
        }" ${classes} ${attributes}></enhanced:img>`;

        // Replace the node with the import and component
        node.type = "html";
        node.value = imageComponent;
      }
    });

    let is_script = false;
    visit(tree, "html", (node) => {
      if (RE_SCRIPT_START.test(node.value)) {
        is_script = true;
        node.value = node.value.replace(RE_SCRIPT_START, (script) => {
          return `${script}\n${scripts}`;
        });
      }
    });

    if (!is_script) {
      tree.children.push({
        type: "html",
        value: `<script>\n${scripts}</script>`,
      });
    }
  };
}
