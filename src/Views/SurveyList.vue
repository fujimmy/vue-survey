<style scoped>
.survey-title {
  cursor: pointer;
  color: white;
}
.survey-title:hover {
  text-decoration: underline;
}
</style>
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">問卷清單</h1>
    <router-link
      to="/create"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      ＋ 新增問卷
    </router-link>
    <ul>
      <li
        v-for="survey in surveys"
        :key="survey.surveyid"
        class="survey-title"
        @click="goToSurvey(survey.surveyid)"
      >
        {{ survey.title }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const surveys = ref([]);
const router = useRouter();

function goToSurvey(id) {
  router.push({ name: "SurveyFill", params: { id } });
}

onMounted(async () => {
  const res = await fetch("http://10.5.6.174:9101/api/Lookupsurveys"); // 從後端撈出所有問卷
  surveys.value = await res.json();
});
</script>
