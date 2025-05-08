<template>
  <div class="container">
    <h1>動態問卷系統</h1>

    <form @submit.prevent="submitForm">
      <div v-for="(q, index) in questions" :key="q.id" class="question-block">
        <label>{{ q.label }}</label>

        <input
          v-if="q.type === 'text' || q.type === 'number'"
          :type="q.type"
          v-model="q.answer"
          required
        />

        <select v-else-if="q.type === 'select'" v-model="q.answer" required>
          <option disabled value="">請選擇</option>
          <option v-for="opt in q.options" :key="opt">{{ opt }}</option>
        </select>
      </div>

      <button type="submit">送出</button>
      <button type="button" @click="resetForm">清除</button>
    </form>

    <pre v-if="submitted">{{ formatAnswers() }}</pre>

    <!-- 動態新增題目 -->
    <hr />
    <h2>新增題目</h2>
    <label>
      題目名稱：
      <input v-model="newQuestion.label" />
    </label>

    <label>
      題目類型：
      <select v-model="newQuestion.type">
        <option value="text">文字</option>
        <option value="number">數字</option>
        <option value="select">選擇</option>
      </select>
    </label>

    <label v-if="newQuestion.type === 'select'">
      選項（用逗號分隔）：
      <input v-model="newQuestion.optionsText" />
    </label>

    <button @click="addQuestion">新增題目</button>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

let questionId = 4

const questions = reactive([
  {
    id: 1,
    label: '你的姓名？',
    type: 'text',
    answer: ''
  },
  {
    id: 2,
    label: '你的年齡？',
    type: 'number',
    answer: ''
  },
  {
    id: 3,
    label: '你的性別？',
    type: 'select',
    options: ['男性', '女性', '其他'],
    answer: ''
  }
])

const submitted = ref(false)

function submitForm() {
  submitted.value = true
  const answers = questions.map(q => ({ label: q.label, answer: q.answer }))
  console.log(JSON.stringify(answers, null, 2))
}

function resetForm() {
  questions.forEach(q => {
    q.answer = ''
  })
  submitted.value = false
}

function formatAnswers() {
  return JSON.stringify(
    questions.map(q => ({ label: q.label, answer: q.answer })),
    null,
    2
  )
}

// 新增題目表單
const newQuestion = reactive({
  label: '',
  type: 'text',
  optionsText: ''
})

function addQuestion() {
  if (!newQuestion.label) return

  const question = {
    id: questionId++,
    label: newQuestion.label,
    type: newQuestion.type,
    answer: ''
  }

  if (newQuestion.type === 'select') {
    question.options = newQuestion.optionsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  }

  questions.push(question)

  // 清空新增欄位
  newQuestion.label = ''
  newQuestion.type = 'text'
  newQuestion.optionsText = ''
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 1rem;
  font-family: sans-serif;
}
label {
  display: block;
  margin-top: 1rem;
}
input, textarea, select {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
}
button {
  margin-top: 1rem;
  margin-right: 0.5rem;
}
pre {
  background: #f5f5f5;
  padding: 1rem;
  margin-top: 1rem;
  font-size: 14px;
}
hr {
  margin: 2rem 0;
}
</style>
