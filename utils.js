export const possibleAttributes = [
  "fetchpriority",
  "loading",
  "decoding",
  "class",
];

export function splitObjectByKeys(obj, keys) {
  const [included, excluded] = Object.entries(obj).reduce(
    ([included, excluded], [key, value]) => {
      if (keys.includes(key)) {
        included[key] = value;
      } else {
        excluded[key] = value;
      }
      return [included, excluded];
    },
    [{}, {}]
  );
  return [included, excluded];
}

export function processAttributesAndConfig(nodeUrl, config = {}) {
  // create a standard url (to cleanly parse the query string)
  const url = new URL(nodeUrl, "http://localhost"); // base url is irrelevant but needed by URL constructor
  
  /* CSS class names handling */
  // get possible "class" entries from the query string
  const searchParams = new URLSearchParams(url.search);
  const classesInQuery = searchParams
    .getAll("class")
    .flatMap((e) => e.split(";"));

  // merge classes from the query string with the ones from the config (if any)
  //  - normalize the possible classes from config
  //  - normalize the possible classes from the query
  //  - combine in a Set to remove duplicates
  //  - convert back to an array and generate the class attribute string
  const normalizedConfigClasses = config?.attributes?.class
    ? config.attributes.class.trim().split(" ").map((c) => c.trim())
    : [];
  const classesInQuerySet = new Set(classesInQuery);
  const classesInConfigSet = new Set(normalizedConfigClasses);
  const allClasses = Array.from(
    new Set([...classesInConfigSet, ...classesInQuerySet])
  );
  //finally, generate the class attribute string
  const combinedClassesAttrStr =
  allClasses.length > 0
      ? `class="${allClasses.join(" ")}"`
      : "";

  // classes processed: remove them from searchParams and config
  searchParams.delete("class");
  if (config.attributes) {
    delete config.attributes.class;
  }

  /* Attributes and image processing directives handling */

  // get the rest of the query string as attributes
  const urlParamsAttributes = Object.fromEntries(searchParams);

  // split the attributes from urlParamsAttributes into attributes and directives
  const [attributes, directives] = splitObjectByKeys(
    urlParamsAttributes,
    possibleAttributes
  );

  // Combine config.attributes with attributes from URL, with URL parameters taking precedence

  const combinedAttributes = {
    ...(config?.attributes ?? {}),
    ...attributes,
  };

  const combinedAttributesStr = Object.entries(combinedAttributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  // Combine directives from config with directives from URL, with URL parameters taking precedence
  const combinedDirectives = {
    ...(config?.imagetoolsDirectives ?? {}),
    ...directives,
  };

  // finally, format the combined directives as URL parameters
  const combinedDirectivesStr = Object.entries(combinedDirectives)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const combinedDirectivesUrlParams = combinedDirectivesStr
    ? `&${combinedDirectivesStr}`
    : "";

  return {
    combinedClassesAttrStr,
    combinedAttributesStr,
    combinedDirectivesUrlParams,
  };
}
