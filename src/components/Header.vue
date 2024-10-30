<template>
  <!-- Header -->
  <header class="bg-white shadow-sm p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-20">
    <div class="flex items-center">
      <img src="/images/out.webp" alt="3D Jersey Designer Logo" class="h-10 w-auto" />
      <h2>3D制衣厂</h2>
    </div>
    <nav class="flex flex-wrap justify-end">
      <button @click="login"
        class="m-1 px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
        <font-awesome-icon :icon="['fas', 'right-to-bracket']" />
      </button>
      <button @click="contactUs"
        class="m-1 px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
        <font-awesome-icon :icon="['fas', 'envelope']" />
      </button>
      <button @click="donate"
        class="m-1 px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <font-awesome-icon :icon="['fas', 'donate']" />
      </button>
      <button @click="saveDesign"
        class="m-1 px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
        <font-awesome-icon :icon="['fas', 'save']" />
      </button>
      <button @click="exitDesigner"
        class="m-1 px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
        <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
      </button>
    </nav>
  </header>
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
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { ref } from "vue";

const showContactModal = ref(false)
const showDonateModal = ref(false)

const login = () => {
  alert('Login functionality to be implemented');
};

const contactUs = () => {
  showContactModal.value = true
}

const donate = () => {
  showDonateModal.value = true
}

const downloadZIP = () => {
  const mainSvgCtn = document.querySelector('#mainSvgCtn');
  if (!mainSvgCtn) return;
  const zip = new JSZip();

  // 添加第一个 SVG 文件
  const svgContent1 = window.world.svgEditor.svgCanvas.getSvgString();
  zip.file("editSvg.svg", svgContent1);

  // 添加第二个 SVG 文件
  const svgContent2 = mainSvgCtn.outerHTML;
  zip.file("mainSvg.svg", svgContent2);

  // 生成 ZIP 文件并触发下载
  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, "svgs.zip"); // 使用 FileSaver.js 触发下载
  });
}
const saveDesign = () => {
  if (!window.world.svgEditor.svgCanvas) return;
  downloadZIP();
};

const exitDesigner = () => {
  alert('Exit designer functionality to be implemented');
};
</script>
