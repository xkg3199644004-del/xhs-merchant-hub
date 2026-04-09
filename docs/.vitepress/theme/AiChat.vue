<template>
  <div style="max-width:680px;margin:0 auto;padding:20px 0;">
    <div ref="msgsEl" style="min-height:300px;max-height:500px;overflow-y:auto;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:12px;background:#fafafa;display:flex;flex-direction:column;gap:10px;">
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:10px 14px;max-width:80%;align-self:flex-start;">
        👋 你好！我是小红书二奢商家服务 AI 助手，有什么想问的？
      </div>
      <div v-for="(m, i) in messages" :key="i" :style="m.role === 'user' ? userStyle : botStyle">
        {{ m.content }}
      </div>
    </div>
    <div style="display:flex;gap:8px;">
      <input v-model="input" @keydown.enter="send" type="text" placeholder="输入问题，按回车发送..." style="flex:1;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;" />
      <button @click="send" :disabled="loading" style="padding:10px 20px;background:#ff2442;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;">
        {{ loading ? '...' : '发送' }}
      </button>
    </div>
    <p style="font-size:12px;color:#999;margin-top:8px;text-align:center;">AI 回答仅供参考，具体政策以小红书官方为准</p>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const PROXY = 'https://xhs-merchant-hub.xkg3199644004.workers.dev'
const input = ref('')
const loading = ref(false)
const messages = ref([])
const msgsEl = ref(null)
const userStyle = 'background:#ff2442;color:#fff;border-radius:10px;padding:10px 14px;max-width:80%;align-self:flex-end;word-break:break-word;'
const botStyle = 'background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:10px 14px;max-width:80%;align-self:flex-start;word-break:break-word;'
const history = [{ role: 'system', content: '你是小红书二奢商家服务助手，专门解答二手奢侈品商家在小红书平台的入驻流程、运营技巧、常见问题。回答简洁、专业、友好，使用中文。' }]

async function send() {
  const text = input.value.trim()
  if (!text || loading.value) return
  input.value = ''
  loading.value = true
  messages.value.push({ role: 'user', content: text })
  history.push({ role: 'user', content: text })
  messages.value.push({ role: 'assistant', content: '思考中...' })
  await nextTick()
  msgsEl.value.scrollTop = msgsEl.value.scrollHeight
  try {
    const res = await fetch(PROXY, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }) })
    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content || '抱歉，出了点问题，请稍后再试。'
    messages.value[messages.value.length - 1].content = reply
    history.push({ role: 'assistant', content: reply })
  } catch {
    messages.value[messages.value.length - 1].content = '网络错误，请稍后重试。'
  }
  loading.value = false
  await nextTick()
  msgsEl.value.scrollTop = msgsEl.value.scrollHeight
}
</script>
