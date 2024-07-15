
const apikey = "your-api-key";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translate'){
    const text = request.text;
    const targetLanguage = request.targetLanguage;
    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apikey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{role: 'system',content: 'You are a content translator, your role is to translate content into the language requested by users. You are only to return the translated content and nothing more'},{role: 'user', content: `Translate the following text into ${targetLanguage}: ${text}`}],
 
      }),
    }).then(response => response.json()).then(response => {
      console.log(response);
      sendResponse({result: response.choices[0].message.content.trim()});
    }).catch(error => {
      console.error(error?.message);
      sendResponse({result: 'Could not translate text. Please try again.'});
    });
    return true;
  }
});