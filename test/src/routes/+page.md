
### Image With Space Local Folder

![Image With Space Local Folder](./img%20with%20space.png)

### Image no space, local folder

(one css class in url params)

![Image no space, local folder](./img.png?class=test-border)

### Image no space, lib folder

(url params: 2 css classes, and one `loading=lazy` attribute)

![Image no space, lib folder](../lib/images/img.png?loading=lazy&class=test-border&class=test-outline)

<style>
  .test-decoration {
    background-image: radial-gradient(orange, yellow);
    border-radius: 100%;
    padding: 2em;
    margin: 2em;
  }

  .test-shadow {
    box-shadow: -1ex 2ex 2ex lightgray;
  }

  .test-border {
    border: 2px solid red;
  }
  .test-outline {
    outline: 4px solid rebeccaPurple;
  }
</style>