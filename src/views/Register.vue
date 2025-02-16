<template>
  <div class="text-gray-500 min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        创建新账户
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        已有账户?
        <router-link to="/login" class="font-medium text-primary hover:text-secondary">
          立即登录
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleRegister">
          <!-- 用户名 -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              用户名
            </label>
            <div class="mt-1">
              <input 
                id="username" 
                name="username" 
                type="text" 
                required 
                v-model="form.username"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
            </div>
          </div>

          <!-- 邮箱 -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              邮箱地址
            </label>
            <div class="mt-1">
              <input 
                id="email" 
                name="email" 
                type="email" 
                autocomplete="email" 
                required 
                v-model="form.email"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
            </div>
          </div>

          <!-- 密码 -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              密码
            </label>
            <div class="mt-1">
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                v-model="form.password"
                minlength="8"
                maxlength="32"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
            </div>
            <p class="mt-1 text-sm text-gray-500">密码长度需要在8-32位之间</p>
          </div>

          <!-- 确认密码 -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              确认密码
            </label>
            <div class="mt-1">
              <input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                required 
                v-model="form.confirmPassword"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
            </div>
          </div>

          <!-- 邮箱验证码 -->
          <div>
            <label for="emailCode" class="block text-sm font-medium text-gray-700">
              邮箱验证码
            </label>
            <div class="mt-1 flex gap-4">
              <input 
                id="emailCode" 
                name="emailCode" 
                type="text" 
                required 
                maxlength="6"
                placeholder="请输入验证码"
                v-model="form.emailCode"
                class="appearance-none block flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
              <button 
                type="button"
                @click="sendEmailCode"
                :disabled="countdown > 0 || !form.email"
                class="w-32 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-300"
                :class="countdown > 0 || !form.email ? 
                  'bg-gray-300 text-gray-500 cursor-not-allowed' : 
                  'bg-primary text-white hover:bg-secondary'"
              >
                {{ countdown > 0 ? `${countdown}秒后重试` : '发送验证码' }}
              </button>
            </div>
            <p v-if="!form.email" class="mt-1 text-sm text-gray-500">
              请先填写邮箱地址
            </p>
          </div>

          <!-- 用户协议 -->
          <div class="flex items-center">
            <input 
              id="terms" 
              name="terms" 
              type="checkbox" 
              required
              v-model="form.agreeToTerms"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            >
            <label for="terms" class="ml-2 block text-sm text-gray-900">
              我同意
              <button type="button" @click="showTerms" class="text-primary hover:text-secondary">服务条款</button>
              和
              <button type="button" @click="showPrivacy" class="text-primary hover:text-secondary">隐私政策</button>
            </label>
          </div>

          <!-- 错误提示 -->
          <div v-if="error" class="text-red-500 text-sm mt-2">
            {{ error }}
          </div>

          <!-- 注册按钮 -->
          <div>
            <button 
              type="submit"
              :disabled="isSubmitting"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? '注册中...' : '注册' }}
            </button>
          </div>
        </form>

        <!-- 社交账号注册 -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                或使用以下方式注册
              </span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-3 gap-3">
            <div>
              <a href="#" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">使用微信注册</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </a>
            </div>

            <div>
              <a href="#" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">使用QQ注册</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </a>
            </div>

            <div>
              <a href="#" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">使用微博注册</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 服务条款弹窗 -->
    <div v-if="showTermsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-900">服务条款</h3>
          <button @click="showTermsModal = false" class="text-gray-500 hover:text-gray-700">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>
        <div class="prose prose-sm">
          <h4 class="text-lg font-medium mb-4">1. 服务说明</h4>
          <p class="mb-4">本服务条款是您与无悔定制（以下简称"我们"）之间就无悔定制服务等相关事宜所订立的契约。请您仔细阅读本服务条款，如果您对本服务条款的任何条款表示异议，您可以选择不使用我们的服务。</p>

          <h4 class="text-lg font-medium mb-4">2. 账号注册</h4>
          <ul class="list-disc pl-5 mb-4">
            <li>您承诺提供真实、准确、完整的个人资料。</li>
            <li>您有义务保护好自己的账号和密码，因账号和密码泄露导致的损失由您自行承担。</li>
            <li>一个邮箱只能注册一个账号。</li>
          </ul>

          <h4 class="text-lg font-medium mb-4">3. 用户行为规范</h4>
          <ul class="list-disc pl-5 mb-4">
            <li>遵守中华人民共和国相关法律法规。</li>
            <li>不得上传、发布违法违规或侵犯他人权益的内容。</li>
            <li>不得从事任何可能损害本平台或其他用户利益的行为。</li>
          </ul>

          <h4 class="text-lg font-medium mb-4">4. 服务内容</h4>
          <p class="mb-4">我们提供个性化服装定制服务，包括但不限于：</p>
          <ul class="list-disc pl-5 mb-4">
            <li>在线设计工具使用</li>
            <li>定制服装生产和配送</li>
            <li>售后服务支持</li>
          </ul>

          <h4 class="text-lg font-medium mb-4">5. 知识产权</h4>
          <p class="mb-4">用户上传的设计作品版权归用户所有，但我们拥有使用、展示的权利。平台提供的设计素材等知识产权归我们所有。</p>

          <h4 class="text-lg font-medium mb-4">6. 免责声明</h4>
          <p class="mb-4">对于因不可抗力、网络问题等导致的服务中断或数据丢失，我们不承担责任。</p>
        </div>
      </div>
    </div>

    <!-- 隐私政策弹窗 -->
    <div v-if="showPrivacyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-900">隐私政策</h3>
          <button @click="showPrivacyModal = false" class="text-gray-500 hover:text-gray-700">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>
        <div class="prose prose-sm">
          <h4 class="text-lg font-medium mb-4">1. 信息收集</h4>
          <p class="mb-4">我们收集的信息包括但不限于：</p>
          <ul class="list-disc pl-5 mb-4">
            <li>账号信息：用户名、邮箱地址、密码等</li>
            <li>订单信息：收货地址、联系方式、支付信息等</li>
            <li>使用记录：浏览历史、设计作品、操作日志等</li>
          </ul>

          <h4 class="text-lg font-medium mb-4">2. 信息使用</h4>
          <p class="mb-4">我们使用收集的信息用于：</p>
          <ul class="list-disc pl-5 mb-4">
            <li>提供和改进我们的服务</li>
            <li>处理您的订单和请求</li>
            <li>向您发送服务相关通知</li>
            <li>提供客户支持</li>
          </ul>

          <h4 class="text-lg font-medium mb-4">3. 信息保护</h4>
          <ul class="list-disc pl-5 mb-4">
            <li>我们采用行业标准的安全技术保护您的个人信息</li>
            <li>限制内部员工访问用户数据的权限</li>
            <li>定期进行安全评估和升级</li>
          </ul>

          <h4 class="text-lg font-medium mb-4">4. 信息共享</h4>
          <p class="mb-4">除以下情况外，我们不会与第三方分享您的个人信息：</p>
          <ul class="list-disc pl-5 mb-4">
            <li>获得您的明确同意</li>
            <li>法律法规要求</li>
            <li>保护我们或其他用户的合法权益</li>
          </ul>

          <h4 class="text-lg font-medium mb-4">5. Cookie使用</h4>
          <p class="mb-4">我们使用Cookie和类似技术来改善用户体验，您可以通过浏览器设置管理Cookie。</p>

          <h4 class="text-lg font-medium mb-4">6. 您的权利</h4>
          <ul class="list-disc pl-5 mb-4">
            <li>访问、更正您的个人信息</li>
            <li>删除您的账号</li>
            <li>退订营销信息</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '../utils/request';
import { useToast } from '../utils/toast';

export default {
  name: 'Register',
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        emailCode: '',
        agreeToTerms: false
      },
      isSubmitting: false,
      error: null,
      showTermsModal: false,
      showPrivacyModal: false,
      countdown: 0,
      timer: null
    }
  },
  methods: {
    showTerms() {
      this.showTermsModal = true;
    },
    showPrivacy() {
      this.showPrivacyModal = true;
    },
    async sendEmailCode() {
      if (!this.form.email) {
        this.error = '请先填写邮箱地址';
        return;
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.form.email)) {
        this.error = '请输入正确的邮箱地址';
        return;
      }

      try {
        this.isSubmitting = true;
        
        // 调用发送验证码接口
        const response = await request.post('/users/email/send-code', {
          email: this.form.email,
          type: 'register' // 标识是注册场景
        });

        if (response.status === 200) {
          // 发送成功，开始倒计时
          this.countdown = 60;
          this.timer = setInterval(() => {
            if (this.countdown > 0) {
              this.countdown--;
            } else {
              clearInterval(this.timer);
            }
          }, 1000);
          
          this.error = null;
          useToast().success('验证码已发送，请查收邮件');
        } else {
          this.error = response.message || '发送验证码失败';
        }
      } catch (error) {
        this.error = error.message || '发送验证码失败，请稍后重试';
      } finally {
        this.isSubmitting = false;
      }
    },
    async handleRegister() {
      this.error = null;
      
      if (this.form.password !== this.form.confirmPassword) {
        this.error = '两次输入的密码不一致';
        return;
      }

      if (!this.form.emailCode) {
        this.error = '请输入邮箱验证码';
        return;
      }

      try {
        this.isSubmitting = true;
        console.log('Register form:', this.form);
        
        const response = await request.post('/users/email/register', {
          email: this.form.email,
          password: this.form.password,
          verificationCode: this.form.emailCode
        });
        if(response.status !== 200) {
          throw new Error('注册失败，请稍后重试！')
        }
        useToast().success('注册成功');
        this.$router.push('/login');
      } catch (error) {
        this.error = error.message || '注册失败，请稍后重试';
      } finally {
        this.isSubmitting = false;
      }
    }
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
</script> 