<script setup>
import { computed, reactive } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useUserStore } from "/src/stores/UserStore.js";

const emit = defineEmits(["close"]);
const close = () => {
  emit("close");
};

const userStore = useUserStore();

const formData = reactive({
  weight: "",
  name: "",
  gender: "",
  age: "",
  height: "",
  activity: "",
  showName: false,
  showGender: false,
  showAge: false,
  showWeight: false,
  showHeight: false,
  showActivity: false,
  start: true
});

const rules = {
  required: (value) => !!value || "Обязательное поле",
  empty: (value) => value.length > 0 || "Не должно быть пустым",
  number: (value) => (!isNaN(parseFloat(value)) && isFinite(value)) || "Должно быть числом",
  positive: (value) => parseFloat(value) > 0 || "Должно быть положительным числом",
};

const validateField = (value, fieldRules) => {
  return fieldRules.every(rule => rule(value) === true);
};

const isNameValid = computed(() => validateField(formData.name, [rules.required, rules.empty]));
const isAgeValid = computed(() => validateField(formData.age, [rules.required, rules.number, rules.positive]));
const isWeightValid = computed(() => validateField(formData.weight, [rules.required, rules.number, rules.positive]));
const isHeightValid = computed(() => validateField(formData.height, [rules.required, rules.number, rules.positive]));
const isGenderValid = computed(() => !!formData.gender);
const isActivityValid = computed(() => !!formData.activity);

const addUser = () => {
  const newUser = {
    id: uuidv4(),
    uname: formData.name,
    gender: formData.gender,
    weight: parseFloat(formData.weight),
    height: parseInt(formData.height),
    age: parseInt(formData.age),
    activity: formData.activity,
    ucalories: calculateCalories({
      gender: formData.gender,
      weight: parseFloat(formData.weight),
      height: parseInt(formData.height),
      age: parseInt(formData.age),
      activity: formData.activity,
    }),
  };
  userStore.setUser(newUser);
  resetForm();
};

const resetForm = () => {
  Object.assign(formData, {
    weight: 0,
    name: "",
    age: 0,
    height: 0,
    activity: "",
    gender: "",
  });
};

const calculateCalories = (user) => {
  const activityMultiplier = {
    MinAct: 1.2,
    WeakAct: 1.375,
    NormAct: 1.55,
    HardAct: 1.725,
    ExtrAct: 1.9,
  };

  let bmr;
  if (user.gender === "Male") {
    bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
  } else {
    bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
  }

  const ncalories = Math.round(bmr * activityMultiplier[user.activity]);
  return ncalories;
};

const handleClick = () => {
  if (isNameValid.value && isGenderValid.value && isAgeValid.value &&
      isWeightValid.value && isHeightValid.value && isActivityValid.value) {
    addUser();
    close();
  }
};
</script>

<template>
  <v-card>
    <v-card-title>
      <h1>ucalories</h1>
    </v-card-title>
    <v-card-item v-if="formData.start">
      <h2>Привет! Для начала добавьте свои данные</h2>
      <v-card-actions>
        <v-btn
          class="mt-5"
          text="Начать"
          @click="formData.showName = true; formData.start = false;"
        />
      </v-card-actions>
    </v-card-item>
    <v-card-item v-if="formData.showName">
      <h2>Как вас зовут?</h2>
      <v-card-actions>
        <v-text-field
          v-model="formData.name"
          type="text"
          :rules="[rules.required, rules.empty]"
        />
        <v-btn
          text="Продолжить"
          @click="formData.showGender = true; formData.showName = false;"
          :disabled="!isNameValid"
        />
      </v-card-actions>
    </v-card-item>
    <v-card-item v-if="formData.showGender">
      <h2>Выберите пол</h2>
      <v-card-actions>
        <v-radio-group v-model="formData.gender">
          <v-radio
            label="Мужской"
            value="Male"
          />
          <v-radio
            label="Женский"
            value="Female"
          />
        </v-radio-group>
        <v-btn
          text="Продолжить"
          @click="formData.showAge = true; formData.showGender = false;"
          :disabled="!isGenderValid"
        />
      </v-card-actions>
    </v-card-item>
    <v-card-item v-if="formData.showAge">
      <h2>Сколько вам лет?</h2>
      <v-card-actions>
      <v-text-field
        v-model="formData.age"
        type="number"
        :rules="[rules.required, rules.positive]"
      />
        <v-btn
          text="Продолжить"
          @click="formData.showWeight = true; formData.showAge = false;"
          :disabled="!isAgeValid"
        />
      </v-card-actions>
    </v-card-item>
    <v-card-item v-if="formData.showWeight">
      <h2>Укажите ваш вес</h2>
      <v-card-actions>
        <v-text-field
          v-model="formData.weight"
          type="number"
          :rules="[rules.required, rules.positive]"
        />
        <v-btn
          text="Продолжить"
          @click="formData.showHeight = true; formData.showWeight = false;"
          :disabled="!isWeightValid"
        />
      </v-card-actions>
    </v-card-item>
    <v-card-item v-if="formData.showHeight">
      <h2>Укажите ваш рост</h2>
      <v-card-actions>
        <v-text-field
          v-model="formData.height"
          type="number"
          :rules="[rules.required, rules.positive]"
        />
        <v-btn
          text="Продолжить"
          @click="formData.showActivity = true; formData.showHeight = false;"
          :disabled="!isHeightValid"
        />
      </v-card-actions>
    </v-card-item>
    <v-card-item v-if="formData.showActivity">
      <h2>Укажите ваш уровень активности</h2>
      <v-card-actions>
        <v-radio-group v-model="formData.activity">
          <v-radio
            label="Минимальная активность"
            value="MinAct"
          />
          <v-radio
            label="Слабый"
            value="WeakAct"
          />
          <v-radio
            label="Умеренный"
            value="NormAct"
          />
          <v-radio
            label="Тяжелый"
            value="HardAct"
          />
          <v-radio
            label="Экстремальный"
            value="ExtrAct"
          />
        </v-radio-group>
        <v-btn
          text="Закончить"
          @click="handleClick"
          :disabled="!isActivityValid"
        />
      </v-card-actions>
    </v-card-item>
  </v-card>
</template>

<style scoped lang="scss">
* {
  color: rgb(223, 223, 223);
}

.v-card {
  background-color: rgb(82, 193, 106);
  height: 58.9em;
  border-radius: 0;
}

.v-list {
  background-color: transparent;
  list-style: none;
}

p {
  font-size: 32px;
  font-weight: 600;
}

.product-name {
  font-size: 20px;
  font-weight: 200;
}

.v-icon {
  color: rgb(93, 93, 93);
}

.v-btn {
  width: 10em;
  color: black;
  background-color: white;
}

.v-card-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.v-card-actions {
  display:flex;
  flex-direction: column;
  justify-content: center;
}

.v-text-field {
  width: 10em;
}
</style>
