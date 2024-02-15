<template>
    <b-form-group
      v-bind:id="'fieldset-'+id"
      v-bind:description="description"
      v-bind:label="label"
      v-bind:label-for="id"
      v-bind:valid-feedback="validFeedback"
      v-bind:invalid-feedback="invalidFeedback"
      v-bind:type="type || 'text'"
    >
    <!-- :state="state" -->
      <b-form-input :type="props.type" ref="input"  @keyup="actualInputValue = $event.target.value;$emit('update:modelValue', actualInputValue)" :disabled="props.disabled ? 'disabled' : null" v-bind:id="id"  :value="props.inputValue" trim></b-form-input>
    </b-form-group>
</template>

<script setup>
    import { ref } from 'vue';
    const actualInputValue = ref('');
    const props = defineProps({
        id: String,
        label: String,
        type: String,
        description: String,
        validFeedback: String,
        invalidFeedback: String,
        inputValue: String|Object,
        disabled: String
    })

    const emit = defineEmits(['update:modelValue']);

    // const inputValue = ref('');
    // inputValue.value = props.inputValue;
</script>

<style>

</style>
