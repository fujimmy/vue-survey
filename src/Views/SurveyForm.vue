<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">建立問卷</h1>

    <div class="mb-4">
      <label>問卷標題：</label>
      <input v-model="title" class="border p-1 w-full" />
    </div>

    <div class="mb-4">
      <label>建立者：</label>
      <input v-model="creator" class="border p-1 w-full" />
    </div>

    <h2 class="text-xl font-semibold mt-6 mb-2">題目列表</h2>

    <div
      v-for="(q, index) in questions"
      :key="q.questionId"
      class="border p-3 mb-4 rounded"
    >
      <div class="mb-2">
        <label>題目內容：</label>
        <input v-model="q.questionText" class="border p-1 w-full" />
      </div>

      <div class="mb-2">
        <label>題型：</label>
        <select v-model="q.questionType" class="border p-1 w-full">
          <option value="text">文字</option>
          <option value="number">數字</option>
          <option value="select">選擇題</option>
          <option value="multiple">多選題</option>
        </select>
      </div>

      <div
        v-if="q.questionType === 'select' || q.questionType === 'multiple'"
        class="mb-2"
      >
        <label>選項（逗號分隔）：</label>
        <input
          :value="q.options.join(',')"
          @input="(e) => (q.options = e.target.value.split(','))"
          class="border p-1 w-full"
        />
      </div>

      <!--即時效果顯示-->
      <div class="mb-2">
        <label>題型預覽：</label>

        <input
          v-if="q.questionType === 'text' || q.questionType === 'number'"
          :type="q.questionType"
          v-model="q.answer"
          class="border p-1 w-full"
        />
        
        <select
          v-else-if="q.questionType === 'select'"
          v-model="q.answer"
          class="border p-1 w-full"
        >
          <option disabled value="">請選擇</option>
          <option v-for="opt in q.options" :key="opt">{{ opt }}</option>
        </select>

        <div v-else-if="q.questionType === 'multiple'" class="space-y-1">
          <div v-for="opt in q.options" :key="opt">
            <label>
              <input
                type="checkbox"
                :value="opt"
                v-model="q.answer"
                class="mr-1"
              />
              {{ opt }}
            </label>
          </div>
        </div>
      </div>

      <button @click="removeQuestion(index)" class="text-red-500">
        刪除此題
      </button>
    </div>

    <button
      @click="addQuestion"
      class="bg-blue-500 text-white px-4 py-2 rounded mb-6"
    >
      ➕ 新增題目
    </button>

    <div class="flex gap-4">
      <button
        @click="submitForm"
        class="bg-green-600 text-white px-4 py-2 rounded"
      >
        送出
      </button>
      <button
        @click="resetForm"
        class="bg-gray-400 text-white px-4 py-2 rounded"
      >
        重設
      </button>
    </div>

    <div v-if="submitted" class="mt-6">
      <h2 class="text-xl font-semibold mb-2">送出資料（預覽）</h2>
      <pre class="bg-gray-100 p-3 rounded text-sm">{{ formatAnswers() }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive,watch } from "vue";
import { v4 as uuidv4 } from "uuid";

const title = ref("");
const creator = ref("");
const submitted = ref(false);
const answer = ref(null);
const questions = reactive([]);

watch(
  questions,
  (newQuestions) => {
    newQuestions.forEach((q) => {
      if (q.questionType === 'multiple' && !Array.isArray(q.answer)) {
        q.answer = []
      }
    })
  },
  { deep: true }
)

function addQuestion() {
  questions.push({
    questionId: uuidv4(),
    questionText: "",
    questionType: "text",
    options: [],
  });
}

function removeQuestion(index) {
  questions.splice(index, 1);
}

function submitForm() {
  answer.value = {
    surveyid: uuidv4(),
    title: title.value,
    creator: creator.value,
    createdAt: new Date().toISOString(),
    questions: questions.map((q) => ({
      questionId: q.questionId,
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.options || []
      //answer: q.answer,
    })),
  };

  submitted.value = true;
  console.log("準備送出：", answer.value);

  // Optional: POST to API
  fetch("http://10.5.6.174:9101/api/surveys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answer.value),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text(); // 取得後端錯誤訊息
        throw new Error(errorText);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      // 假設後端返回的結構是 { id: "surveyId", createdAt: "date" }
      const { id, createdAt } = data; // 取得 id 和 createdAt
      alert(`問卷已成功提交！問卷 ID: ${id}，建立時間: ${createdAt}`);
    })
    .catch((error) => {
      console.error("儲存問卷時出錯:", error);
      const errorMessage = error.message.replace(/^"|"$/g, ""); //因為json回傳會帶雙引號 '"您已經填寫過問卷了"',去掉前後的雙引號
      alert(errorMessage);
    });
}

function resetForm() {
  title.value = "";
  creator.value = "";
  questions.splice(0);
  submitted.value = false;
  answer.value = null;
}

function formatAnswers() {
  return JSON.stringify(answer.value, null, 2);
}
</script>

<style scoped>
input,
select {
  margin-top: 4px;
}
</style>
