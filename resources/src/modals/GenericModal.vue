<template>
    <b-modal :id="props.id" :ok-variant="props.okVariant" @ok="props.ok" scrollable :title="props.title">
        <template v-slot:cancel>
            <b-button @click="hide()" variant="secondary">{{ t('cancel') }}</b-button>
        </template>
        <template v-slot:default>
            {{ props.body }}
        </template>
    </b-modal>
  </template>

  <script setup>
    import { useModal } from 'bootstrap-vue-next';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t, locale } = useI18n();
    const props = defineProps({
        id: String,
        okVariant: {
            type: String,
            default: 'dark'
        },
        ok: Function,
        title: String,
        body: String
    })
    const { hide } = useModal(props.id);
  </script>

  <style>
  </style>
