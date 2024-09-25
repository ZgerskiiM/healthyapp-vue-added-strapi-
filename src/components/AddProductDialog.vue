<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: Boolean,
  selectedMeal: String,
  items: Array,
  newProduct: Object,
});

const emit = defineEmits(['update:show', 'confirm']);

const closeDialog = () => {
  emit('update:show', false);
};

const confirmAddProduct = () => {
  emit('confirm');
};
</script>

<template>
  <v-dialog
    :model-value="show"
    @update:model-value="closeDialog"
    max-width="520px"
  >
    <v-card>
      <v-card-title>
        {{ selectedMeal }}
      </v-card-title>
      <v-card-text>
        <v-container id="id">
          <v-autocomplete
            v-model="newProduct.name"
            :items="items.map((item) => item.name)"
            width="110%"
            item-text="item.name"
            item-value="item.name"
            label="Какой продукт вы хотите найти?"
            auto-select-first
          />
        </v-container>
        <v-text-field
          v-model="newProduct.weight"
          label="Вес (г)"
          type="number"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text="Отмена"
          @click="closeDialog"
        />
        <v-btn
          color="blue darken-1"
          text="Добавить"
          @click="confirmAddProduct"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
