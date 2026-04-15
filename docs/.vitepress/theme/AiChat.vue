<template>
<div class="ai-chat-container">
  <div class="chat-header">
    <div class="header-content">
      <div class="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#ff2442" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="#ff2442" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="#ff2442" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2 class="title">小红书二奢商家服务助手</h2>
      <div class="header-actions">
        <button @click="toggleHistory" class="history-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V16" stroke="#333" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 12H16" stroke="#333" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- 历史记录面板 -->
  <div v-if="showHistory" class="history-panel">
    <div class="history-header">
      <h3>历史记录</h3>
      <div class="history-actions">
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="搜索关键词..." 
          class="search-input"
        />
        <button @click="clearHistory" class="clear-button">清空</button>
      </div>
    </div>
    <div class="history-list">
      <div 
        v-for="record in filteredHistory" 
        :key="record.id" 
        class="history-item"
        @click="loadHistoryRecord(record)"
      >
        <div class="history-item-content">
          <div class="history-question">{{ record.question }}</div>
          <div class="history-meta">
            <span class="history-time">{{ formatTime(record.timestamp) }}</span>
            <div class="history-keywords">
              <span 
                v-for="keyword in record.keywords" 
                :key="keyword" 
                class="keyword-tag"
              >
                {{ keyword }}
              </span>
            </div>
          </div>
        </div>
        <button 
          @click.stop="deleteHistoryRecord(record.id)" 
          class="delete-button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 7L5 7" stroke="#999" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 11V17" stroke="#999" stroke-width="2" stroke-linecap="round"/>
            <path d="M15 11L15 17" stroke="#999" stroke-width="2" stroke-linecap="round"/>
            <path d="M9 11L9 17" stroke="#999" stroke-width="2" stroke-linecap="round"/>
            <path d="M18 7V19C18 20.1046 17.1046 21 16 21H8C6.89543 21 6 20.1046 6 19V7" stroke="#999" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div v-if="filteredHistory.length === 0" class="empty-history">
        {{ searchKeyword ? '没有找到匹配的记录' : '暂无历史记录' }}
      </div>
    </div>
  </div>
  
  <div ref="msgsEl" class="chat-messages">
    <div class="message bot-message initial-message">
      <div class="message-content">
        <div class="bot-avatar">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#f8f9fa" stroke="#e9ecef" stroke-width="1"/>
            <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="#ff2442"/>
            <path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" fill="white"/>
          </svg>
        </div>
        <div class="message-text">
          👋 你好！我是小红书二奢商家服务 AI 助手，有什么想问的？
        </div>
      </div>
    </div>
    
    <div v-for="(m, i) in messages" :key="i" :class="['message', m.role === 'user' ? 'user-message' : 'bot-message']">
      <div class="message-content">
        <div v-if="m.role === 'user'" class="user-avatar">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#ff2442"/>
            <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="white"/>
            <path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" fill="#ff2442"/>
          </svg>
        </div>
        <div v-else class="bot-avatar">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#f8f9fa" stroke="#e9ecef" stroke-width="1"/>
            <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="#ff2442"/>
            <path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" fill="white"/>
          </svg>
        </div>
        <div class="message-text" v-if="m.role === 'user'">{{ m.content }}</div>
        <div class="message-text" v-else v-html="renderMarkdown(m.content)"></div>
      </div>
    </div>
  </div>
  
  <div class="chat-input-container">
    <input 
      v-model="input" 
      @keydown.enter.prevent="send" 
      type="text" 
      placeholder="输入问题，按回车发送..." 
      class="chat-input"
      :disabled="loading"
    />
    <button 
      @click="send" 
      :disabled="loading" 
      class="send-button"
    >
      <span v-if="!loading">发送</span>
      <div v-else class="loading-spinner">
        <div class="spinner"></div>
      </div>
    </button>
  </div>
  
  <p class="disclaimer">AI 回答仅供参考，具体政策以小红书官方为准</p>
</div>
</template>

<script setup>
import { ref, nextTick, computed, onMounted } from 'vue'

// 通过后端代理调用 API，避免 API Key 泄露和 CORS 问题
// 如果部署在 Vercel，用相对路径即可；如果部署在 GitHub Pages，保留你的 Vercel 地址
const API_URL = '/api/chat'

const input = ref('')
const loading = ref(false)
const messages = ref([])
const msgsEl = ref(null)
const showHistory = ref(false)
const searchKeyword = ref('')
const historyRecords = ref([])
const SYSTEM_PROMPT = '你是小红书二奢商家服务助手，专门解答二手奢侈品商家在小红书平台的入驻流程、运营技巧、常见问题。回答简洁、专业、友好，使用中文。请使用Markdown格式输出，合理使用标题、列表等结构化格式。'
const history = [{ role: 'system', content: SYSTEM_PROMPT }]

onMounted(() => {
  loadHistoryFromStorage()
})

function loadHistoryFromStorage() {
  try {
    const stored = localStorage.getItem('aiChatHistory')
    if (stored) {
      historyRecords.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('加载历史记录失败:', error)
  }
}

function saveHistoryToStorage() {
  try {
    localStorage.setItem('aiChatHistory', JSON.stringify(historyRecords.value))
  } catch (error) {
    console.error('保存历史记录失败:', error)
  }
}

function extractKeywords(text) {
  const stopWords = ['的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这']
  const words = text.split(/\s+|，|。|！|？/).filter(word => word.length > 1 && !stopWords.includes(word))
  return [...new Set(words)].slice(0, 5)
}

function saveHistoryRecord(question, reply) {
  const record = {
    id: Date.now().toString(),
    question,
    reply,
    timestamp: new Date().toISOString(),
    keywords: extractKeywords(question)
  }
  historyRecords.value.unshift(record)
  if (historyRecords.value.length > 50) {
    historyRecords.value = historyRecords.value.slice(0, 50)
  }
  saveHistoryToStorage()
}

const filteredHistory = computed(() => {
  if (!searchKeyword.value) {
    return historyRecords.value
  }
  const keyword = searchKeyword.value.toLowerCase()
  return historyRecords.value.filter(record => 
    record.question.toLowerCase().includes(keyword) ||
    record.keywords.some(k => k.toLowerCase().includes(keyword))
  )
})

function formatTime(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function loadHistoryRecord(record) {
  messages.value = []
  history.length = 1
  history[0] = { role: 'system', content: SYSTEM_PROMPT }
  
  messages.value.push({ role: 'user', content: record.question })
  history.push({ role: 'user', content: record.question })
  messages.value.push({ role: 'assistant', content: record.reply })
  history.push({ role: 'assistant', content: record.reply })
  
  showHistory.value = false
  
  nextTick(() => {
    if (msgsEl.value) {
      msgsEl.value.scrollTop = msgsEl.value.scrollHeight
    }
  })
}

function deleteHistoryRecord(id) {
  historyRecords.value = historyRecords.value.filter(record => record.id !== id)
  saveHistoryToStorage()
}

function clearHistory() {
  if (confirm('确定要清空所有历史记录吗？')) {
    historyRecords.value = []
    saveHistoryToStorage()
  }
}

function toggleHistory() {
  showHistory.value = !showHistory.value
}

function renderMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre style="background:#f4f4f4;padding:12px;border-radius:8px;overflow-x:auto;"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code style="background:#f4f4f4;padding:2px 6px;border-radius:4px;font-size:0.9em;">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#ff2442;">$1</a>')
    .replace(/^### (.+)$/gm, '<h3 style="margin:12px 0 4px 0;font-size:1.1em;">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="margin:16px 0 6px 0;font-size:1.25em;">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="margin:20px 0 8px 0;font-size:1.5em;">$1</h1>')
    .replace(/^&gt; (.+)$/gm, '<blockquote style="border-left:3px solid #ff2442;padding-left:12px;color:#666;margin:8px 0;">$1</blockquote>')
    .replace(/^[\*\-] (.+)$/gm, '<li style="margin-left:20px;list-style:disc;">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li style="margin-left:20px;list-style:decimal;">$1</li>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0;">')
    .replace(/\n/g, '<br>')
}

async function send() {
  const text = input.value.trim()
  if (!text || loading.value) return

  input.value = ''
  loading.value = true

  messages.value.push({ role: 'user', content: text })
  history.push({ role: 'user', content: text })
  const pendingIndex = messages.value.length
  messages.value.push({ role: 'assistant', content: '思考中...' })

  await nextTick()
  if (msgsEl.value) {
    msgsEl.value.scrollTop = msgsEl.value.scrollHeight
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history, max_tokens: 3000 }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}))
      throw new Error(errorBody.error || `请求失败 (${res.status})`)
    }

    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content
    if (!reply) {
      throw new Error('AI 未返回有效回复')
    }

    messages.value[pendingIndex - 1].content = reply
    history.push({ role: 'assistant', content: reply })
    saveHistoryRecord(text, reply)
  } catch (err) {
    console.error('AI 请求失败:', err)
    const errorMsg = err.name === 'AbortError'
      ? '请求超时，请稍后重试。'
      : err.message || '网络错误，请稍后重试。'
    messages.value[pendingIndex - 1].content = errorMsg
  } finally {
    loading.value = false
    await nextTick()
    if (msgsEl.value) {
      msgsEl.value.scrollTop = msgsEl.value.scrollHeight
    }
  }
}
</script>

<style scoped>
/* 原有样式保持不变 */
.ai-chat-container {
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
.chat-header { margin-bottom: 30px; text-align: center; }
.header-content { display: flex; align-items: center; justify-content: center; gap: 12px; position: relative; }
.header-actions { position: absolute; right: 0; }
.history-button { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 8px; transition: background-color 0.3s ease; }
.history-button:hover { background-color: #f0f0f0; }
.logo svg { width: 32px; height: 32px; }
.title { font-size: 24px; font-weight: 600; color: #333; margin: 0; }
.history-panel { background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin-bottom: 20px; overflow: hidden; }
.history-header { padding: 16px 20px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; }
.history-header h3 { margin: 0; font-size: 16px; font-weight: 600; color: #333; }
.history-actions { display: flex; gap: 10px; align-items: center; }
.search-input { padding: 6px 12px; border: 1px solid #e9ecef; border-radius: 16px; font-size: 14px; width: 200px; outline: none; transition: all 0.3s ease; }
.search-input:focus { border-color: #ff2442; box-shadow: 0 0 0 3px rgba(255, 36, 66, 0.1); }
.clear-button { padding: 6px 12px; background: none; border: 1px solid #e9ecef; border-radius: 16px; font-size: 14px; color: #666; cursor: pointer; transition: all 0.3s ease; }
.clear-button:hover { border-color: #ff2442; color: #ff2442; }
.history-list { max-height: 300px; overflow-y: auto; }
.history-item { padding: 16px 20px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: flex-start; cursor: pointer; transition: background-color 0.3s ease; }
.history-item:hover { background-color: #f8f9fa; }
.history-item-content { flex: 1; }
.history-question { font-size: 14px; color: #333; margin-bottom: 8px; line-height: 1.4; }
.history-meta { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.history-time { font-size: 12px; color: #999; }
.history-keywords { display: flex; gap: 6px; flex-wrap: wrap; }
.keyword-tag { font-size: 12px; padding: 2px 8px; background: #f0f0f0; border-radius: 10px; color: #666; }
.delete-button { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 8px; transition: background-color 0.3s ease; opacity: 0.5; }
.delete-button:hover { background-color: #f0f0f0; opacity: 1; }
.empty-history { padding: 40px 20px; text-align: center; color: #999; font-size: 14px; }
.chat-messages { min-height: 400px; max-height: 500px; overflow-y: auto; border-radius: 16px; padding: 24px; margin-bottom: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; gap: 16px; }
.message { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.message-content { display: flex; align-items: flex-start; gap: 12px; max-width: 80%; }
.user-message .message-content { align-self: flex-end; flex-direction: row-reverse; margin-left: auto; }
.bot-message .message-content { align-self: flex-start; margin-right: auto; }
.user-avatar, .bot-avatar { flex-shrink: 0; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
.message-text { padding: 14px 18px; border-radius: 18px; line-height: 1.5; word-break: break-word; }
.user-message .message-text { background: #ff2442; color: white; border-bottom-right-radius: 4px; box-shadow: 0 2px 8px rgba(255, 36, 66, 0.2); }
.bot-message .message-text { background: white; color: #333; border-bottom-left-radius: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
.initial-message .message-text { background: white; color: #333; border-bottom-left-radius: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
.chat-input-container { display: flex; gap: 12px; margin-bottom: 16px; position: relative; }
.chat-input { flex: 1; padding: 16px 20px; border: 2px solid #e9ecef; border-radius: 24px; font-size: 16px; transition: all 0.3s ease; outline: none; background: white; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); }
.chat-input:focus { border-color: #ff2442; box-shadow: 0 0 0 3px rgba(255, 36, 66, 0.1); }
.chat-input:disabled { background: #f5f5f5; cursor: not-allowed; }
.send-button { padding: 0 28px; background: linear-gradient(135deg, #ff2442 0%, #ff4d6a 100%); color: white; border: none; border-radius: 24px; font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(255, 36, 66, 0.3); display: flex; align-items: center; justify-content: center; }
.send-button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(255, 36, 66, 0.4); }
.send-button:active:not(:disabled) { transform: translateY(0); }
.send-button:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; }
.loading-spinner { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }
.spinner { width: 20px; height: 20px; border: 2px solid rgba(255, 255, 255, 0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.disclaimer { font-size: 12px; color: #999; text-align: center; margin: 0; padding-top: 8px; }
.chat-messages::-webkit-scrollbar, .history-list::-webkit-scrollbar { width: 6px; }
.chat-messages::-webkit-scrollbar-track, .history-list::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
.chat-messages::-webkit-scrollbar-thumb, .history-list::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
.chat-messages::-webkit-scrollbar-thumb:hover, .history-list::-webkit-scrollbar-thumb:hover { background: #999; }
@media (max-width: 768px) {
  .ai-chat-container { padding: 20px 16px; }
  .chat-messages { min-height: 350px; max-height: 400px; padding: 16px; }
  .message-content { max-width: 85%; }
  .title { font-size: 20px; }
  .history-header { flex-direction: column; align-items: flex-start; gap: 10px; }
  .history-actions { width: 100%; justify-content: space-between; }
  .search-input { flex: 1; }
}
</style>
