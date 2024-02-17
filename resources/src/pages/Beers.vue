<template>
    <div ref="beersList" class="infinite-scroll beers_wrapper" id="beers_wrapper">
      <beer v-for="beer in beers"  :beer="beer" :key="'beers' + beer.id">
      </beer>
    </div>
  </template>

  <script setup>
  import { ref, watch, toRaw, onMounted, reactive } from "vue";
  import { useI18n } from "vue-i18n";
  import loadingSvg from './../../images/loading.svg'
  import {
    getBeersAPI
  } from "../../js/utilities/api.js";
  import GenericModal from "../modals/GenericModal.vue";
  import Utils from "../../js/utilities/utils.js";
  import Beer from "../components/Beer.vue";
  const { t, locale } = useI18n();
  const props = defineProps({
    refreshUser: Function,
  });

  const emit = defineEmits(["update-user"]);
  const user = ref({});
  const page = ref(0);
  const limit = ref(20);
  const beers = ref([]);
  const beersList = ref(null);
  const refreshUser = props.refreshUser;
  const data_finished = ref(false);
  const fetching_beers_data = ref(false);

  const resetData = () => {
    beers.value = [];
    page.value = 0;
    data_finished.value = false;
  };

  const getBeers = () => {
    const data = {
      page: page.value,
      limit: limit.value,
    };
    fetching_beers_data.value = true;
    Utils.DOM.addLoading(loadingSvg);
    getBeersAPI(
      data,
      (resp) => {
        Utils.DOM.removeLoading();
        fetching_beers_data.value = false;
        Utils.response.handleError(resp);
        const _beers = beers.value;
        _beers.push(...resp);
        beers.value = _beers;
        if (resp.length === 0) {
          data_finished.value = true;
        }
      },
      (err) => {
        Utils.DOM.removeLoading();
        fetching_beers_data.value = false;
        Utils.DOM.toast(err.message, "error", t);
        console.log(err.stack);
      }
    );
  };

  onMounted(() => {
    refreshUser(null, emit, user, {}, function () {
      getBeers();
    });

    Utils.functions.initInfiniteScroll(beersList.value, () => {
      console.log('scrolling');
      if (data_finished.value == false && !fetching_beers_data.value) {
        page.value += 1;
        getBeers();
      }
    });
  });
  </script>

  <style scoped>
  #full_name_wrapper {
    top: 40px;
  }

  #full_name_wrapper ul {
    list-style-type: none;
    padding: 5px;
    border: 1px solid #828da0;
    background-color: white;
  }

  #full_name_wrapper ul li {
    background-color: white;
  }

  .beers_wrapper {
    max-height: calc(100vh - 40px); /* -40px -40px -40px */
    overflow: auto;
    padding: 20px;
  }
  </style>
