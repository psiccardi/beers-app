<template>
    <div class="autocomplete-wrapper" :style="{width: props.width}">
        <b-form-input :id="props.id" :key="props.id+'_autocomplete'" :placeholder="props.placeholder" :value="props.inputValue" :style="{width: props.width}" class="m-1" type="text" ref="autocomplete-input" trim @keyup="setInputValue($event)"></b-form-input>
        <ul class="autocomplete-ul" ref="autocompleteUl" :style="{width: props.width}">
            <li @click="setOptionValue(option.id)" v-for="option in options" :value="option.id" :key="props.id + '_' + option.id">
                {{ option.first_name + ' ' + option.last_name }}
            </li>
        </ul>
    </div>
</template>
<script setup>
    import { onMounted } from 'vue';
    import { defineProps, ref, defineEmits } from 'vue';
    const props = defineProps({
        id: String,
        width: {
            type: String,
            default: '150px'
        },
        inputValueCallback: {
            type: Function,
            default: function () {}
        },
        inputValue: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        }
    });
    const options = ref([]);
    const optionId = ref(null);
    const autocompleteUl = ref(null);
    const updateModel = defineEmits(['update:modelValue', 'update_autocomplete_value']);

    const setOptionValue = (val) => {
        optionId.value = val;
        updateModel('update:modelValue', val);
        options.value = [];
        autocompleteUl.value.style.display = 'none';
    }
    const setInputValue = (event) => {
        const value = event.target.value;
        console.log('setInputValue', value)
        updateModel('update_autocomplete_value', value);
        if (value === '') {
            autocompleteUl.value.style.display = 'none';
        } else {
            autocompleteUl.value.style.display = 'block';
        }
        props.inputValueCallback(value, function (data) {
            options.value = data;
        })
    }
    onMounted(() => {
        autocompleteUl.value.style.display = 'none';
    })
</script>
<style scoped>
    .autocomplete-wrapper {
        position: relative;
    }
    .autocomplete-ul {
        position: absolute;
        top: 39px;
        background-color: white;
        border: 1px solid black;
        list-style-type: none;
        padding: 0px;
    }

    .autocomplete-ul li:hover {
        background-color: #828da0;
    }
</style>
