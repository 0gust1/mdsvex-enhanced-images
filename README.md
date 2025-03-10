# mdsvex-enhanced-images
[![NPM Downloads](https://img.shields.io/npm/dt/%40lzinga%2Fmdsvex-enhanced-images)](https://www.npmjs.com/package/@lzinga/mdsvex-enhanced-images)

This plugin allows you to: 
- use relative urls to images from the markdown file while also using the `enhanced:img` library from `@sveltejs/enhanced-img`.
- add CSS class names and extra attributes (`loading`, `fetchpriority`, and `decoding`) to images directly in markdown (image by image) or through the plugin configuration (to all images).
- add imagetools directives to images in markdown (image by image) or through the plugin configuration (to all images).

Special thanks to https://github.com/mattjennings/mdsvex-relative-images, for the inspiration.

Feel free to open a PR or an issue if you have any suggestions or feature requests!

## Usage

### Installation

```bash
npm install --save-dev @lzinga/mdsvex-enhanced-images
```

(or the equivalent pnmp / yarn / bun commands)

### Configuration

Configure the package in your mdsvex config.

```ts
import enhancedImage from '@lzinga/mdsvex-enhanced-images';

const config = {
	extensions: ['.svelte', '.md'],

	preprocess: [
		mdsvex({
			extensions: ['.md'],
			remarkPlugins: [[
				enhancedImage,
				{
					// Optional: attributes to add to **all** `img` tags
					attributes: {
						fetchpriority: "auto", // browser's default
						loading: "eager", // browser's default
						decoding: "auto", // browser's default
						class: "test-decoration test-shadow" // add classes to all images
					},
					// Optional: imagetools directives to add to **all** `img` tags
					// see https://github.com/JonasKruckenberg/imagetools/blob/main/docs/directives.md#format
					imagetoolsDirectives:{
						tint: "rgba(10,33,127)",
						blur: 10,
					}
				}
			]]
		})
	],
	kit: {
		adapter: adapter()
	}
};

```

Now you can add images like

```markdown
### Image With Space Local Folder
![Image With Space Local Folder](./img%20with%20space.png)

### Image no space, local folder
![Image no space, local folder](./img.png)

### Image no space, lib folder
![Image no space, lib folder](../lib/images/img.png)
```

You can also individually add css classes and extra attribute to images:

```markdown
### Image with css classes:
![Image no space, lib folder](../lib/images/img.png?class=my-class1;my-class2)

### Image with more attributes (here, loading=lazy):
![Image no space, lib folder](../lib/images/img.png?loading=lazy)

### Image with imagetools directives

![Image no space, lib folder](../lib/images/img.png?rotate=90)
```

and in the page the images get replaced with the component like so.

```html
<enhanced:img src={importedImage} alt="Image With Space Local Folder"></enhanced:img>
```

and in the HTML it appears like
```html
<picture>
    <!--[-->
    <source srcset="/@imagetools/43b0240cd054a16b2f8a777b81bc4080b1acf480 64w, /@imagetools/158187b3c4aa0009b5a8dab06fd646564597d12f 128w" type="image/avif" />
    <source srcset="/@imagetools/7dfbb97480e17bfd34ea5b9bf456e0904ac39232 64w, /@imagetools/51b34cea801d67387212057d7d251b64e3bcf3b5 128w" type="image/webp" />
    <source srcset="/@imagetools/749bd9a6a3c3e0aebf61154883f9a65b72404e47 64w, /@imagetools/0de3b0f0f739a05f1b5c3bde640e029bd344ccf8 128w" type="image/png" />
    <!--]-->
    <img src="/@imagetools/0de3b0f0f739a05f1b5c3bde640e029bd344ccf8" alt="abc" width="128" height="128" />
</picture>
```

