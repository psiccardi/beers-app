<template>
  <div class="page-wrapper d-flex flex-column">
    <Navbar></Navbar>
    <div id="content-wrapper" class="d-flex flex-grow-1">
      <Sidebar :key="user" :user="user" v-model="user"></Sidebar>
      <div class="content-right-side">
        <router-view :refreshUser="refreshUser" v-on:update-user="updateUser" />
      </div>
    </div>
  </div>
</template>

<script setup>
import './../../css/backoffice.css';
import { ref, toRaw} from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { getUserAPI } from "../../js/utilities/api";
import Utils from "../../js/utilities/utils";
// document.querySelector('content-wrapper').style.marginTop = offsetHeight + 'px';
import Navbar from "../components/backoffice/Navbar.vue";
import Sidebar from "../components/backoffice/Sidebar.vue";
const { t } = useI18n();
const user = ref({});
const route = useRoute();
console.log(route.path);
const updateUser = (newValue) => {
  user.value = newValue;
};

const refreshUser = (_user = null, emit, user, refs = {}, fn = null) => {
  if (_user) {
    user.value = _user;
    emit("update-user", _user);
    for (var prop in refs) {
      refs[prop].value = _user[prop];
    }
    fn && fn();
    // if (typeof first_name_value !== 'undefined') {
    //     first_name_value.value = _user.first_name;
    // }
    // if (typeof last_name_value !== 'undefined') {
    //     last_name_value.value = _user.last_name;
    // }
    // if (typeof email_value !== 'undefined') {
    //     email_value.value = _user.email;
    // }
    return;
  }
  getUserAPI(
    {},
    (resp) => {
      Utils.response.handleError(resp);
      user.value = resp;
      emit("update-user", resp);
      for (var prop in refs) {
        refs[prop].value = user.value[prop];
      }
      fn && fn();
    },
    (err) => {
      Utils.DOM.toast(err.message, "error", t);
      console.log(err.stack);
    }
  );
};
</script>

<style>
.page-wrapper {
  height: 100%;
}
.content-right-side {
  flex-grow: 1;
}
.content-right-side form {
  display: block;
  margin-top: 50px;
  max-width: 500px;
  margin-left: 20px;
}
</style>
