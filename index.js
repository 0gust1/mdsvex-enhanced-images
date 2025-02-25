import { visit } from 'unist-util-visit';

const RE_SCRIPT_START =
  /<script(?:\s+?[a-zA-z]+(=(?:["']){0,1}[a-zA-Z0-9]+(?:["']){0,1}){0,1})*\s*?>/;
const RE_SRC = /src\s*=\s*"(.+?)"/;

export default function enhancedImage(options) {  
  return function transformer(tree) {
    let scripts = "";
    visit(tree, 'image', (node) => {
      if(node.url.startsWith("."))
      {
        // Generate a unique identifier for the import
        const importName = `_img${Math.random().toString(36).substr(2, 9)}`;

        // Create the import statement
        const importStatement = `import ${importName} from '${decodeURIComponent(node.url)}?enhanced';\n`;
        scripts += `${importStatement}`

        const classes = options.classes ? `class="${options.classes}"` : '';
        const attributes = options.attributes 
          ? Object.entries(options.attributes).map(([key, value]) => `${key}="${value}"`).join(' ') 
          : '';

        // Create the image component
        const imageComponent =
          `<enhanced:img src={${importName}} alt="${node.alt ?? ''}" ${classes} ${attributes}></enhanced:img>`;
        
        // Replace the node with the import and component
        node.type = 'html';
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
  }
}