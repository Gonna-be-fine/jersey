<template>
  <div class="action-buttons">
    <TabButton 
      :active="false"
      :icon="['fas', 'envelope']"
      title="Contact Us"
      @click="contactUs"
    />
    <TabButton 
      :active="false"
      :icon="['fas', 'donate']"
      title="Donate"
      @click="donate"
    />
  </div>
  <div v-if="showContactModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Contact Us</h3>
        <button @click="showContactModal = false" class="text-gray-400 hover:text-gray-500">
          <font-awesome-icon :icon="['fas', 'times']"/>
        </button>
      </div>
      <div class="text-center">
        <font-awesome-icon :icon="['fas', 'envelope']" class="text-4xl text-blue-500 mb-4"/>
        <p class="text-lg mb-4">Feel free to reach out to us at:</p>
        <a href="mailto:contact@3d-jersey-design.com" class="text-blue-500 hover:text-blue-600 text-xl">
          contact@3d-jersey-design.com
        </a>
      </div>
    </div>
  </div>

  <div v-if="showDonateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Support Our Work</h3>
        <button @click="showDonateModal = false" class="text-gray-400 hover:text-gray-500">
          <font-awesome-icon :icon="['fas', 'times']"/>
        </button>
      </div>
      <div class="grid grid-cols-2 gap-4 text-center">
        <div>
          <h4 class="font-medium mb-2">WeChat Pay</h4>
          <img src="https://3d-jersey-design.com/wechat-qr.jpg" alt="WeChat Payment QR Code"
            class="w-full max-w-[200px] mx-auto">
        </div>
        <div>
          <h4 class="font-medium mb-2">Alipay</h4>
          <img src="https://3d-jersey-design.com/alipay-qr.jpg" alt="Alipay Payment QR Code"
            class="w-full max-w-[200px] mx-auto">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TabButton from '../common/TabButton.vue';
import { ref } from "vue";

const showContactModal = ref(false)
const showDonateModal = ref(false)
const contactUs = () => {
  showContactModal.value = true
}

const donate = () => {
  showDonateModal.value = true
}
</script>

<style scoped>
.action-buttons {
  position: absolute;
  z-index: 10;
  left: var(--default-padding);
  bottom: var(--default-padding);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .action-buttons {
    position: static;
    flex-direction: row;
    justify-content: center;
    margin: 1rem 0;
  }
}
</style> 