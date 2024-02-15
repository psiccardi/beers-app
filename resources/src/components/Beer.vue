<template>
    <div class="d-flex card beer flex-row">
        <div class="image-wrapper">
            <img :src="props.beer.image_url">
        </div>
        <div class="beer-infos flex-grow-1">
            <div class="beer-name">{{ props.beer.name }}</div>
            <div class="beer-description">{{ props.beer.description }}</div>
            <div class="d-flex justify-content-between">
                <div class="beer-ingredients-wrapper">
                    <div class="bold">Ingredients:</div>
                    <ul>
                        <li>
                            <div class="bold">Malts:</div>
                            <div v-for="(malt, i) in props.beer.ingredients.malt" v-bind:key="'malt_'+props.beer.id+'_'+i">
                                {{ malt.name }}: {{ malt.amount.value }} {{ malt.amount.unit }}
                            </div>
                        </li>
                        <li>
                            <div class="bold">Hops:</div>
                            <div v-for="(hops, i) in props.beer.ingredients.hops" v-bind:key="'hops_'+props.beer.id+'_'+i">
                                {{ hops.name }}: {{ hops.amount.value }} {{ hops.amount.unit }}
                            </div>
                        </li>
                        <li>
                            <div class="bold">Yeast:</div>
                            <div>
                                {{ props.beer.ingredients.yeast }}
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="beer-food-pairing-wrapper">
                    <div class="bold">Food Pairing:</div>
                    <ul>
                        <li v-for="(fp, i) in props.beer.food_pairing" v-bind:key="'food_pairing_'+props.beer.id+'_'+i">
                            {{ fp }}
                        </li>
                    </ul>
                </div>
            </div>

        </div>
            <!-- <div class="title">{{ props.post.title }}</div>
            <div class="first-name">{{ props.post.user.first_name }} {{ props.post.user.last_name }}</div>
            <div class="role">
                {{ t(props.post.user.role.name) }}
            </div> -->
    </div>

  </template>

  <script setup>
  import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
  const { t, locale } = useI18n();
  const props = defineProps({
    beer: Object
  });

  onMounted(function () {
    console.log(props.beer);
  })
  </script>

  <style scoped>
  .beer {
    padding: 20px;
    margin-bottom: 20px;
  }

  .beer .bold {
    font-weight: bold;
  }

  .beer .image-wrapper {
    min-width: 150px;
  }

  .beer .image-wrapper img {
    height: 200px;
  }

  .beer .beer-infos {
    margin-left: 20px;
  }

  .beer .beer-name {
    font-size: 20px;
    font-weight: bold;
  }
  </style>
