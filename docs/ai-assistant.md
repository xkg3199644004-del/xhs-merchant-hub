# AI 助手

<div id="ai-chat-wrapper" style="max-width:680px;margin:0 auto;padding:20px 0;">
  <div id="chat-messages" style="min-height:300px;max-height:500px;overflow-y:auto;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:16px;background:#fafafa;display:flex;flex-direction:column;gap:12px;">
    <div class="msg assistant" style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:12px 16px;max-width:85%;align-self:flex-start;">
      👋 你好！我是小红书二奢商家服务 AI 助手，可以帮你解答入驻流程、运营玩法、常见问题等。有什么想问的？
    </div>
  </div>
  <div style="display:flex;gap:8px;">
    <input id="chat-input" type="text" placeholder="输入你的问题，按回车发送..." 
      style="flex:1;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;outline:none;" />
    <button id="chat-send" 
      style="padding:10px 20px;background:#ff2442;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;white-space:nowrap;">
      发送
    </button>
  </div>
  <p style="font-size:12px;color:#999;margin-top:8px;text-align:center;">AI 回答仅供参考，具体政策以小红书官方为准</p>
</div>

<script>
(function() {
  const PROXY_URL = 'https://你的vercel域名.vercel.app/api/chat';  // ← 部署后替换这里

  const messagesEl = document.getElementById('chat-messages');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const history = [
    { role: 'system', content: '你是小红书二奢商家服务助手，专门解答二手奢侈品商家在小红书平台的入驻流程、运营技巧、常见问题。回答简洁、专业、友好，使用中文。' }
  ];

  function appendMsg(role, text) {
    const div = document.createElement('div');
    div.className = 'msg ' + role;
    div.style.cssText = role === 'user'
      ? 'background:#ff2442;color:#fff;border-radius:10px;padding:12px 16px;max-width:85%;align-self:flex-end;word-break:break-word;'
      : 'background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:12px 16px;max-width:85%;align-self:flex-start;word-break:break-word;';
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    sendBtn.disabled = true;

    appendMsg('user', text);
    history.push({ role: 'user', content: text });

    const loadingEl = appendMsg('assistant', '思考中...');

    try {
      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || '抱歉，出现了一点问题，请稍后再试。';
      loadingEl.textContent = reply;
      history.push({ role: 'assistant', content: reply });
    } catch (e) {
      loadingEl.textContent = '网络错误，请稍后重试。';
    }

    sendBtn.disabled = false;
    inputEl.focus();
  }

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
})();
</script>
