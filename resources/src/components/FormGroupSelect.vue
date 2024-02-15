<template>
    <b-form-group
      v-bind:id="'fieldset-'+id"
      v-bind:description="description"
      v-bind:label="label"
      v-bind:label-for="id"
      v-bind:valid-feedback="validFeedback"
      v-bind:invalid-feedback="invalidFeedback"
    >
    <!-- :state="state" -->
      <b-form-select :key="id+'_'+actualInputValue" ref="input" :options="props.options || []"  :disabled="props.disabled ? 'disabled' : null" v-bind:id="id" :value="props.inputValue" v-model="actualInputValue" trim></b-form-select>
    </b-form-group>
</template>

<script setup>
    import { onMounted, ref, watch } from 'vue';
    const actualInputValue = ref('');
    const input = ref(null);
    const props = defineProps({
        id: String,
        label: String,
        description: String,
        options: Array,
        validFeedback: String,
        invalidFeedback: String,
        inputValue: Number|String,
        disabled: String
    })

    const emit = defineEmits(['update:modelValue']);

    onMounted(() => {
        actualInputValue.value = props.inputValue;
    })

    watch([actualInputValue], (newValue) => {
        console.log('FormGroupSelect:actualInputValue', newValue);
        emit('update:modelValue', actualInputValue.value);
    })
    // const inputValue = ref('');
    // inputValue.value = props.inputValue;
</script>

<style>

</style>
