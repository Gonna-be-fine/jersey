<template>
  <!-- Header -->
  <header
    class="bg-white shadow-sm p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-20"
  >
    <div class="flex items-center">
      <img
        src="/images/out.webp"
        alt="3D Jersey Designer Logo"
        class="h-10 w-auto"
      />
      <h2>3D制衣厂</h2>
    </div>
    <nav class="flex flex-wrap justify-end">
      <button
        @click="login"
        class="m-1 px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        <font-awesome-icon :icon="['fas', 'right-to-bracket']" />
      </button>
      <button
        @click="contactUs"
        class="m-1 px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        <font-awesome-icon :icon="['fas', 'envelope']" />
      </button>
      <button
        @click="donate"
        class="m-1 px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <font-awesome-icon :icon="['fas', 'donate']" />
      </button>
      <button
        @click="saveDesign"
        class="m-1 px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <font-awesome-icon :icon="['fas', 'save']" />
      </button>
      <button
        @click="exitDesigner"
        class="m-1 px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
      </button>
    </nav>
  </header>
</template>

<script setup>

const login = () => {
  alert('Login functionality to be implemented');
};

const contactUs = () => {
  alert('Contact Us functionality to be implemented');
};

const donate = () => {
  alert('Donation functionality to be implemented');
};

const saveDesign = () => {
  alert('Save design functionality to be implemented');
};

const exitDesigner = () => {
  alert('Exit designer functionality to be implemented');
};
</script>
