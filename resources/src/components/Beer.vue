<template>
    <div class="d-flex justify-content-between card post flex-row">
      <div>
        <div>
            <div class="title">{{ props.post.title }}</div>
            <div class="first-name">{{ props.post.user.first_name }} {{ props.post.user.last_name }}</div>
            <div class="role">
                {{ t(props.post.user.role.name) }}
            </div>
        </div>
      </div>
      <div class="user-card-action">
          <img class="pointer" @click="props.editClick" src="../../../images/icon-actions-ic-edit.svg">
          <img class="pointer" @click="props.deleteClick" src="../../../images/icon-actions-ic-delete.svg">
      </div>
    </div>

  </template>

  <script setup>
  import { useI18n } from "vue-i18n";
  const { t, locale } = useI18n();
  const props = defineProps({
    post: Object,
    editClick: Function,
    deleteClick: Function
  });
  </script>

  <style scoped>
  .post {
    padding: 20px;
  }

  .post-card-action {
      height: 30px;
  }

  .post .role {
    color: #828da0;
    font-size: 12px;
  }

  .post .email {
    font-size: 12px;
  }
  </style>
