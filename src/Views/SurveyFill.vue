<template>
    <div class="p-6 max-w-2xl mx-auto" v-if="survey">
      <h1 class="text-2xl font-bold mb-4">{{ survey.title }}</h1>
  
      <div v-for="(q, index) in survey.questions" :key="q.questionId" class="mb-4">
        <label class="font-semibold">{{ index + 1 }}. {{ q.questionText }}</label>
  
        <input
          v-if="q.questionType === 'text' || q.questionType === 'number'"
          :type="q.questionType"
          v-model="q.answer"
          class="border p-1 w-full mt-1"
        />
  
        <select
          v-else-if="q.questionType === 'select'"
          v-model="q.answer"
          class="border p-1 w-full mt-1"
        >
          <option disabled value="">請選擇</option>
          <option v-for="opt in q.options" :key="opt">{{ opt }}</option>
        </select>
  
        <div v-else-if="q.questionType === 'multiple'" class="space-y-1 mt-1">
          <div v-for="opt in q.options" :key="opt">
            <label>
              <input type="checkbox" :value="opt" v-model="q.answer" class="mr-1" />
              {{ opt }}
            </label>
          </div>
        </div>
      </div>
  
      <button @click="submit" class="bg-green-600 text-white px-4 py-2 rounded">送出問卷</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const survey = ref(null)
  
  onMounted(async () => {
    const res = await fetch(`http://10.5.6.174:9101/api/Getsurveys/${route.params.id}`)
    const data = await res.json()
  
    // 初始化答案欄位
    data.questions.forEach(q => {
      q.answer = q.questionType === 'multiple' ? [] : ''
    })
    survey.value = data
  })
  
  async function submit() {
    const response = await fetch(`http://10.5.6.174:9101/api/Writesurvey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: survey.value.questions.map(q => ({
          questionId: q.questionId,
          answer: q.answer
        }))
      })
    })
  
    if (response.ok) {
      alert('問卷提交成功！')
    } else {
      const err = await response.text()
      alert(`提交失敗：${err}`)
    }
  }
  </script>
  