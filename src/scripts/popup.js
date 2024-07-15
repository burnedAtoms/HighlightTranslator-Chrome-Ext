
import { initializeToggleState, initializeLanguages } from './functions/functions.js';
function main() {
  initializeToggleState();
  initializeLanguages();
}

document.addEventListener('DOMContentLoaded', main);