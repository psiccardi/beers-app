let localeText = `<script>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
    setup() {
        const { t, locale } = useI18n();
        locale.value = localStorage.getItem('locale') ? localStorage.getItem("locale") : 'en';
        const change_language = (e) => {
            localStorage.setItem("locale", e.target.value);
            locale.value = e.target.value;
            // console.log(locale.value);
        };

        return {
        change_language,
        };
    },
    name: "locale-changer",
    data() {
    return {
      langs: [
{{ LANGS_OBJECT }}
      ],
    };
  },

};
</script>
<template>
    <div class="locale-changer" id="locale-changer">
        <select :value="$i18n.locale" @change="change_language">
        <option v-for="(lang, i) in langs" :key="\`Lang\${i}\`" :value="lang.code">
          {{ lang.text }}
        </option>
      </select>
    </div>
</template>`

export default localeText;
