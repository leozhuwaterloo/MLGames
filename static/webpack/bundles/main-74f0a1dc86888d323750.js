/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ({

/***/ 14:
/***/ (function(module, exports) {

throw new Error("Module build failed: SyntaxError: Identifier directly after number (36:39)\n\n\u001b[0m \u001b[90m 34 | \u001b[39m          let offset \u001b[33m=\u001b[39m p\u001b[33m.\u001b[39mmap(d\u001b[33m,\u001b[39m \u001b[35m0\u001b[39m\u001b[33m,\u001b[39m maxD\u001b[33m,\u001b[39m \u001b[33m-\u001b[39mp\u001b[33m.\u001b[39m\u001b[33mPI\u001b[39m\u001b[33m,\u001b[39m p\u001b[33m.\u001b[39m\u001b[33mPI\u001b[39m)\u001b[33m;\u001b[39m\n \u001b[90m 35 | \u001b[39m          let a \u001b[33m=\u001b[39m angle \u001b[33m+\u001b[39m offset\u001b[33m;\u001b[39m\n\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 36 | \u001b[39m          let h \u001b[33m=\u001b[39m p\u001b[33m.\u001b[39mfloor(p\u001b[33m.\u001b[39mmap(p\u001b[33m.\u001b[39msin(\u001b[35m2\u001b[39ma)\u001b[33m,\u001b[39m \u001b[33m-\u001b[39m\u001b[35m1\u001b[39m\u001b[33m,\u001b[39m \u001b[35m1\u001b[39m\u001b[33m,\u001b[39m \u001b[35m100\u001b[39m\u001b[33m,\u001b[39m \u001b[35m300\u001b[39m))\u001b[33m;\u001b[39m\n \u001b[90m    | \u001b[39m                                       \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\n \u001b[90m 37 | \u001b[39m          p\u001b[33m.\u001b[39mtranslate(x \u001b[33m-\u001b[39m p\u001b[33m.\u001b[39mwidth \u001b[33m/\u001b[39m \u001b[35m2\u001b[39m \u001b[33m,\u001b[39m \u001b[35m0\u001b[39m\u001b[33m,\u001b[39m z \u001b[33m-\u001b[39m p\u001b[33m.\u001b[39mheight \u001b[33m/\u001b[39m \u001b[35m2\u001b[39m)\u001b[33m;\u001b[39m\n \u001b[90m 38 | \u001b[39m          p\u001b[33m.\u001b[39mnormalMaterial()\u001b[33m;\u001b[39m\n \u001b[90m 39 | \u001b[39m          p\u001b[33m.\u001b[39mbox(w\u001b[33m,\u001b[39m h\u001b[33m,\u001b[39m w)\u001b[33m;\u001b[39m\u001b[0m\n");

/***/ })

/******/ });