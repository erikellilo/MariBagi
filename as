[1mdiff --git a/.eslintrc.cjs b/.eslintrc.cjs[m
[1mdeleted file mode 100644[m
[1mindex ad1b15c..0000000[m
[1m--- a/.eslintrc.cjs[m
[1m+++ /dev/null[m
[36m@@ -1,23 +0,0 @@[m
[31m-module.exports = {[m
[31m-  root: true,[m
[31m-  env: { browser: true, es2020: true },[m
[31m-  extends: [[m
[31m-    "eslint:recommended",[m
[31m-    "plugin:react/recommended",[m
[31m-    "plugin:react/jsx-runtime",[m
[31m-    "plugin:react-hooks/recommended",[m
[31m-  ],[m
[31m-  ignorePatterns: ["dist", ".eslintrc.cjs"],[m
[31m-  parserOptions: { ecmaVersion: "latest", sourceType: "module" },[m
[31m-  settings: { react: { version: "18.2" } },[m
[31m-  plugins: ["react-refresh"],[m
[31m-  rules: {[m
[31m-    "react/jsx-no-target-blank": "off",[m
[31m-    "react/prop-types": "off",[m
[31m-    "no-unused-vars": "warn",[m
[31m-    "react-refresh/only-export-components": [[m
[31m-      "warn",[m
[31m-      { allowConstantExport: true },[m
[31m-    ],[m
[31m-  },[m
[31m-};[m
[1mdiff --git a/.prettierrc.json b/.prettierrc.json[m
[1mdeleted file mode 100644[m
[1mindex 9af543b..0000000[m
[1m--- a/.prettierrc.json[m
[1m+++ /dev/null[m
[36m@@ -1,6 +0,0 @@[m
[31m-{[m
[31m-  "singleQuote": false,[m
[31m-  "semi": true,[m
[31m-  "printWidth": 80,[m
[31m-  "trailingComma": "es5"[m
[31m-}[m
[1mdiff --git a/Backend/package-lock.json b/Backend/package-lock.json[m
[1mindex effbffc..06317c8 100644[m
[1m--- a/Backend/package-lock.json[m
[1m+++ b/Backend/package-lock.json[m
[36m@@ -13,6 +13,7 @@[m
         "@nestjs/core": "^10.0.0",[m
         "@nestjs/mapped-types": "*",[m
         "@nestjs/platform-express": "^10.0.0",[m
[32m+[m[32m        "@nestjs/swagger": "^11.2.0",[m
         "@nestjs/typeorm": "^11.0.0",[m
         "pg": "^8.16.0",[m
         "reflect-metadata": "^0.2.0",[m
[36m@@ -1590,6 +1591,11 @@[m
         "node": ">=8"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/@microsoft/tsdoc": {[m
[32m+[m[32m      "version": "0.15.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@microsoft/tsdoc/-/tsdoc-0.15.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-4aErSrCR/On/e5G2hDP0wjooqDdauzEbIq8hIkIe5pXV0rtWJZvdCEKL0ykZxex+IxIwBp0eGeV48hQN07dXtw=="[m
[32m+[m[32m    },[m
     "node_modules/@nestjs/cli": {[m
       "version": "10.4.9",[m
       "resolved": "https://registry.npmjs.org/@nestjs/cli/-/cli-10.4.9.tgz",[m
[36m@@ -1854,6 +1860,46 @@[m
       "dev": true,[m
       "license": "MIT"[m
     },[m
[32m+[m[32m    "node_modules/@nestjs/swagger": {[m
[32m+[m[32m      "version": "11.2.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@nestjs/swagger/-/swagger-11.2.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-5wolt8GmpNcrQv34tIPUtPoV1EeFbCetm40Ij3+M0FNNnf2RJ3FyWfuQvI8SBlcJyfaounYVTKzKHreFXsUyOg==",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@microsoft/tsdoc": "0.15.1",[m
[32m+[m[32m        "@nestjs/mapped-types": "2.1.0",[m
[32m+[m[32m        "js-yaml": "4.1.0",[m
[32m+[m[32m        "lodash": "4.17.21",[m
[32m+[m[32m        "path-to-regexp": "8.2.0",[m
[32m+[m[32m        "swagger-ui-dist": "5.21.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@fastify/static": "^8.0.0",[m
[32m+[m[32m        "@nestjs/common": "^11.0.1",[m
[32m+[m[32m        "@nestjs/core": "^11.0.1",[m
[32m+[m[32m        "class-transformer": "*",[m
[32m+[m[32m        "class-validator": "*",[m
[32m+[m[32m        "reflect-metadata": "^0.1.12 || ^0.2.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependenciesMeta": {[m
[32m+[m[32m        "@fastify/static": {[m
[32m+[m[32m          "optional": true[m
[32m+[m[32m        },[m
[32m+[m[32m        "class-transformer": {[m
[32m+[m[32m          "optional": true[m
[32m+[m[32m        },[m
[32m+[m[32m        "class-validator": {[m
[32m+[m[32m          "optional": true[m
[32m+[m[32m        }[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@nestjs/swagger/node_modules/path-to-regexp": {[m
[32m+[m[32m      "version": "8.2.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-8.2.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-TdrF7fW9Rphjq4RjrW0Kp2AW0Ahwu9sRGTkS6bvDi0SCwZlEZYmcfDbEsTz8RVk0EHIS/Vd1bv3JhG+1xZuAyQ==",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=16"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/@nestjs/testing": {[m
       "version": "10.4.19",[m
       "resolved": "https://registry.npmjs.org/@nestjs/testing/-/testing-10.4.19.tgz",[m
[36m@@ -1997,6 +2043,12 @@[m
         "url": "https://opencollective.com/pkgr"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/@scarf/scarf": {[m
[32m+[m[32m      "version": "1.4.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@scarf/scarf/-/scarf-1.4.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-xxeapPiUXdZAE3che6f3xogoJPeZgig6omHEy1rIY5WVsB3H2BHNnZH+gHG6x91SCWyQCzWGsuL2Hh3ClO5/qQ==",[m
[32m+[m[32m      "hasInstallScript": true[m
[32m+[m[32m    },[m
     "node_modules/@sinclair/typebox": {[m
       "version": "0.27.8",[m
       "resolved": "https://registry.npmjs.org/@sinclair/typebox/-/typebox-0.27.8.tgz",[m
[36m@@ -3018,7 +3070,6 @@[m
       "version": "2.0.1",[m
       "resolved": "https://registry.npmjs.org/argparse/-/argparse-2.0.1.tgz",[m
       "integrity": "sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q==",[m
[31m-      "dev": true,[m
       "license": "Python-2.0"[m
     },[m
     "node_modules/array-flatten": {[m
[36m@@ -6561,7 +6612,6 @@[m
       "version": "4.1.0",[m
       "resolved": "https://registry.npmjs.org/js-yaml/-/js-yaml-4.1.0.tgz",[m
       "integrity": "sha512-wpxZs9NoxZaJESJGIZTyDEaYpl0FKSA+FB9aJiyemKhMwkxQg63h4T1KJgUGHpTqPDNRcmmYLugrRjJlBtWvRA==",[m
[31m-      "dev": true,[m
       "license": "MIT",[m
       "dependencies": {[m
         "argparse": "^2.0.1"[m
[36m@@ -6725,7 +6775,6 @@[m
       "version": "4.17.21",[m
       "resolved": "https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz",[m
       "integrity": "sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg==",[m
[31m-      "dev": true,[m
       "license": "MIT"[m
     },[m
     "node_modules/lodash.memoize": {[m
[36m@@ -8736,6 +8785,14 @@[m
         "url": "https://github.com/sponsors/ljharb"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/swagger-ui-dist": {[m
[32m+[m[32m      "version": "5.21.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/swagger-ui-dist/-/swagger-ui-dist-5.21.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-E0K3AB6HvQd8yQNSMR7eE5bk+323AUxjtCz/4ZNKiahOlPhPJxqn3UPIGs00cyY/dhrTDJ61L7C/a8u6zhGrZg==",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@scarf/scarf": "=1.4.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/symbol-observable": {[m
       "version": "4.0.0",[m
       "resolved": "https://registry.npmjs.org/symbol-observable/-/symbol-observable-4.0.0.tgz",[m
[1mdiff --git a/Backend/package.json b/Backend/package.json[m
[1mindex bd0e39d..3da1ead 100644[m
[1m--- a/Backend/package.json[m
[1m+++ b/Backend/package.json[m
[36m@@ -1,4 +1,4 @@[m
[31m-{[m
[32m+[m[32me{[m
   "name": "Backend",[m
   "version": "0.0.1",[m
   "description": "",[m
[36m@@ -24,6 +24,7 @@[m
     "@nestjs/core": "^10.0.0",[m
     "@nestjs/mapped-types": "*",[m
     "@nestjs/platform-express": "^10.0.0",[m
[32m+[m[32m    "@nestjs/swagger": "^11.2.0",[m
     "@nestjs/typeorm": "^11.0.0",[m
     "pg": "^8.16.0",[m
     "reflect-metadata": "^0.2.0",[m
[1mdiff --git a/Backend/src/app.module.ts b/Backend/src/app.module.ts[m
[1mindex 5384504..3a32f3c 100644[m
[1m--- a/Backend/src/app.module.ts[m
[1m+++ b/Backend/src/app.module.ts[m
[36m@@ -1,5 +1,4 @@[m
 import { Module } from '@nestjs/common';[m
[