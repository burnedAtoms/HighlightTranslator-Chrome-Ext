import { languages } from "../../hooks/languages.js";

function setToggleState(toggleState, toggleContainer) {
  if (toggleState) {
    toggleContainer.classList.add('bg-green-400');
    toggleContainer.classList.add('justify-end');
    toggleContainer.classList.remove('bg-gray-500');
    toggleContainer.classList.remove('justify-start');
  } else {
    toggleContainer.classList.add('bg-gray-500');
    toggleContainer.classList.add('justify-start');
    toggleContainer.classList.remove('bg-green-400');
    toggleContainer.classList.remove('justify-end');
  }
}

export function initializeToggleState() {
  chrome.storage.sync.get('toggleState', function(data) {
    var toggleState = data.toggleState || false;
    var toggleContainer = document.getElementsByClassName('toggle-container')[0];

    setToggleState(toggleState, toggleContainer);

    // Add click event listener to the toggle container
    toggleContainer.addEventListener('click', function() {
      toggleState = !toggleState;
      chrome.storage.sync.set({ 'toggleState': toggleState }, function() {
        setToggleState(toggleState, toggleContainer);
      });
      chrome.tabs.query({active: true,currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id,{ action: 'toggleState', toggleState: toggleState});
      });
    });
  });
}

export function initializeLanguages() {
  chrome.storage.sync.set({ 'languages': languages });
  chrome.storage.sync.get('languages', function(data) {
    var languageList = data.languages;
    var toLanguageSelect = document.getElementById('to-language-selector');

    for (var i = 0; i < languageList.length; i++) {
      var li = document.createElement('li');
      li.appendChild(document.createTextNode(languageList[i].name));
      li.classList.add('cursor-pointer', 'hover:bg-green-200', 'p-2', 'rounded-md', 'text-sm','font-medium', 'font-sans','tracking-wide', 'text-gray-800')
      toLanguageSelect.appendChild(li);
    }
    setupLanguageOptions();
  });
}

function setupLanguageOptions() {   
  chrome.storage.sync.get('toSelectedLanguage', function(data) {
    var toLanguageMenu = document.getElementById('to-selected-language-container');
    var toLanguageMenuText = document.getElementById('to-selected-language');
    var toLanguageSelector = document.getElementById('to-language-selector');
    var toOptions = document.querySelectorAll('#to-language-selector li');
    var drawerArrowIcon = document.getElementById('drawer-arrow-icon');

    toLanguageMenuText.innerText = data.toSelectedLanguage? data.toSelectedLanguage : 'English';

    toLanguageMenu.addEventListener('click', function() {
      toLanguageSelector.classList.toggle('hidden');
      if(toLanguageSelector.classList.contains('hidden')) {
        drawerArrowIcon.classList.add('transform','rotate-180');
      } else {
        drawerArrowIcon.classList.remove('transform','rotate-180');
      }
    });

    toOptions.forEach(function(option) {
      option.addEventListener('click', function() {
        toLanguageMenuText.innerText = option.innerText || data.toSelectedLanguage;
        if(option.innerText !== data.toSelectedLanguage) {
          chrome.storage.sync.set({ 'toSelectedLanguage': option.innerText });
        }
        toLanguageSelector.classList.add('hidden');
      });
    });
  });
}
