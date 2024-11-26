<template>
  <section class="contact-form">
    <div class="section-heading">
      <h2 class="section-title">联系我们</h2>
      <p class="section-subtitle">如有任何问题,请随时与我们联系</p>
    </div>

    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="form-grid">
        <div class="form-group">
          <label for="name">姓名</label>
          <input 
            type="text" 
            id="name" 
            v-model="formData.name"
            required
          >
        </div>

        <div class="form-group">
          <label for="email">邮箱</label>
          <input 
            type="email" 
            id="email" 
            v-model="formData.email"
            required
          >
        </div>

        <div class="form-group">
          <label for="phone">电话</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="formData.phone"
          >
        </div>

        <div class="form-group">
          <label for="subject">主题</label>
          <input 
            type="text" 
            id="subject" 
            v-model="formData.subject"
            required
          >
        </div>

        <div class="form-group full-width">
          <label for="message">消息</label>
          <textarea 
            id="message" 
            v-model="formData.message"
            rows="6"
            required
          ></textarea>
        </div>
      </div>

      <div class="form-footer">
        <button type="submit" class="submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? '发送中...' : '发送消息' }}
        </button>
      </div>
    </form>

    <!-- 提示消息 -->
    <div v-if="showMessage" :class="['message', messageType]">
      {{ message }}
    </div>
  </section>
</template>

<script>
export default {
  name: 'ContactForm',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      },
      isSubmitting: false,
      showMessage: false,
      message: '',
      messageType: 'success'
    }
  },
  methods: {
    async handleSubmit() {
      this.isSubmitting = true
      try {
        // 这里添加实际的表单提交逻辑
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.showSuccessMessage('消息已发送,我们会尽快回复您!')
        this.resetForm()
      } catch (error) {
        this.showErrorMessage('发送失败,请稍后重试')
      } finally {
        this.isSubmitting = false
      }
    },
    resetForm() {
      this.formData = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      }
    },
    showSuccessMessage(msg) {
      this.message = msg
      this.messageType = 'success'
      this.showMessage = true
      setTimeout(() => {
        this.showMessage = false
      }, 3000)
    },
    showErrorMessage(msg) {
      this.message = msg
      this.messageType = 'error'
      this.showMessage = true
      setTimeout(() => {
        this.showMessage = false
      }, 3000)
    }
  }
}
</script>

<style scoped>
.contact-form {
  padding: 4rem 2rem;
  position: relative;
}

.section-heading {
  text-align: center;
  margin-bottom: 3rem;
}

.section-subtitle {
  color: var(--text-light);
  margin-top: 0.5rem;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
  background: var(--bg-white);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

label {
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
}

input,
textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-footer {
  margin-top: 2rem;
  text-align: center;
}

.submit-button {
  background: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-button:hover:not(:disabled) {
  background: var(--primary-dark);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 2rem;
  border-radius: 4px;
  animation: slideIn 0.3s ease-out;
}

.success {
  background: #4caf50;
  color: white;
}

.error {
  background: #f44336;
  color: white;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style> 