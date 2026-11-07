import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, nextResolve) {
    const relativo = specifier.startsWith("./") || specifier.startsWith("../");
    const semExtensao = !specifier.endsWith(".ts") && !specifier.endsWith(".mjs") && !specifier.endsWith(".js");
    if (relativo && semExtensao) {
      return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});
