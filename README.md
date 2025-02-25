# mdsvex-enhanced-images
[![NPM Downloads](https://img.shields.io/npm/dt/%40lzinga%2Fmdsvex-enhanced-images)](https://www.npmjs.com/package/@lzinga/mdsvex-enhanced-images)

Allows you to use relative urls to images from the markdown file while also using the enhanced:img library from @sveltejs/enhanced-img.

Thanks to https://github.com/mattjennings/mdsvex-relative-images as I used it as a base for this. It could probably be a lot more dynamic and allow custom configurations, but for now. This is all I needed. If you have a recommended change please do a pull request.


# Usage
Install the package
```
npm i @lzinga/mdsvex-enhanced-images
```

Configure the package in your mdsvex config.
```ts
import enhancedImage from 'mdsvex-enhanced-images';

const config = {
	extensions: ['.svelte', '.md'],

	preprocess: [
		mdsvex({
			extensions: ['.md'],
			remarkPlugins: [enhancedImage]
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

