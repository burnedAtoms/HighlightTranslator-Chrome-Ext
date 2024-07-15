function createBubble() {
  const bubble = document.createElement('div');
  bubble.id = 'highlight-bubble';

  bubble.style.all = 'initial';
  bubble.style.position = 'absolute';
  bubble.style.backgroundColor = '#ffffff'; // Cloud white background
  bubble.style.padding = '10px';
  bubble.style.borderRadius = '10px';
  bubble.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
  bubble.style.zIndex = '1000';
  bubble.style.display = 'none';
  bubble.style.whiteSpace = 'pre-wrap';
  bubble.style.width = 'auto';
  bubble.style.maxWidth = '300px';
  bubble.style.maxHeight = '200px';
  bubble.style.overflowWrap = 'break-word';
  bubble.style.overflow = 'auto';

  const textContainer = document.createElement('div');
  textContainer.style.marginTop = '20px';
  bubble.appendChild(textContainer);

  const copyBtn = document.createElement('button');
  copyBtn.style.all = 'unset';
  copyBtn.style.position = 'absolute';
  copyBtn.style.top = '5px';
  copyBtn.style.right = '5px';
  copyBtn.innerText = 'Copy';
  copyBtn.style.fontSize = '1rem';
  copyBtn.style.cursor = 'pointer';
  copyBtn.style.display = 'inline-block';
  copyBtn.style.marginTop = '5px';
  copyBtn.style.color = '#468585';
  copyBtn.style.textDecoration = 'none';

  copyBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    const text = textContainer.innerText;
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.innerText = 'Copied!';
      setTimeout(() => {
        copyBtn.innerText = 'Copy';
      }, 2000);
    });
  });

  bubble.appendChild(copyBtn);

  document.body.appendChild(bubble);
  return bubble;
}

function formatText(text, maxLength) {
  let result = '';
  while (text.length > 0) {
    result += text.substring(0, maxLength) + '\n';
    text = text.substring(maxLength);
  }
  return result;
}

function showBubble(event, text,targetLanguage) {
  chrome.runtime.sendMessage({action:'translate', text: `${text}`, targetLanguage: `${targetLanguage}`}, (response) => {
    const bubble = document.getElementById('highlight-bubble') || createBubble();
    const formattedText = formatText(response.result.toString().trim(), 48);    
    bubble.firstChild.innerText = response.result.toString().trim();
    bubble.style.left = `${event.pageX}px`;
    bubble.style.top = `${event.pageY + 20}px`; 
    bubble.style.display = 'block';
  });
  
}

function hideBubble(event) {
  const bubble = document.getElementById('highlight-bubble');
  if (bubble && (!event || !bubble.contains(event.target))) {
    bubble.style.display = 'none';
  }
}

function getTargetLanguage(){
  return new Promise((resolve,reject) => {
    chrome.storage.sync.get('toSelectedLanguage', function(data) {
      if(chrome.runtime.lastError){
        reject(chrome.runtime.lastError);
      } else{
        resolve(data.toSelectedLanguage || 'English');
      }
    });
  })
}

async function mouseUpHandler(event) {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    const targetLanguage = await getTargetLanguage();
    showBubble(event, selectedText, targetLanguage);
  } else {
    hideBubble();
  }
}

function mouseDownHandler(event) {
  hideBubble(event);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleState') {
    if (request.toggleState) {
      document.addEventListener('mouseup', mouseUpHandler);
      document.addEventListener('mousedown', mouseDownHandler);
      chrome.storage.sync.set({ 'toggleState': true });
    } else {
      document.removeEventListener('mouseup', mouseUpHandler);
      chrome.storage.sync.set({ 'toggleState': false });
    }
  }
});

chrome.storage.sync.get('toggleState', (data) => {
  if (data.toggleState) {
    document.addEventListener('mouseup', mouseUpHandler);
    document.addEventListener('mousedown', mouseDownHandler);
  } else{
    document.removeEventListener('mouseup', mouseUpHandler);
  }
});





