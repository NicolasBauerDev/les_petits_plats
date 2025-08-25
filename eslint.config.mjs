import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: globals.browser }, 
    rules: {
        quotes: ["error", "double", { 
            avoidEscape: true, allowTemplateLiterals: true 
        }],
        eqeqeq: ["error", "always"],
        curly: ["error", "all"],
        semi: ["error", "always"],
        "no-unused-vars": [
            "warn",
            { vars: "all", args: "after-used", ignoreRestSiblings: false }
        ],
        "no-console": "warn",
        // Harmoniser les sauts de ligne dans les objets multilignes
        "object-curly-newline": ["error", { multiline: true, consistent: true }],
        // Longueur de ligne
        "max-len": ["error", { code: 100, ignoreUrls: true }],
        "default-case-last": "error"
    },
  },
]);
