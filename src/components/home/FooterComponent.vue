<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- 关于我们 -->
      <div class="footer-section">
        <h3 class="footer-title">关于 Drinkify</h3>
        <p>Drinkify 是一个高级电商WordPress区块主题,完美适合创建酒类商店网站。</p>
      </div>

      <!-- 快速链接 -->
      <div class="footer-section">
        <h3 class="footer-title">快速链接</h3>
        <nav class="footer-nav">
          <ul>
            <li><a href="#">我们的公司</a></li>
            <li><a href="#">我们的产品</a></li>
            <li><a href="#">最新博客</a></li>
            <li><a href="#">为什么选择我们</a></li>
          </ul>
        </nav>
      </div>

      <!-- 支持 -->
      <div class="footer-section">
        <h3 class="footer-title">支持</h3>
        <nav class="footer-nav">
          <ul>
            <li><a href="#">客服支持</a></li>
            <li><a href="#">条款与条件</a></li>
            <li><a href="#">常见问题</a></li>
          </ul>
        </nav>
      </div>

      <!-- 联系我们 -->
      <div class="footer-section">
        <h3 class="footer-title">联系我们</h3>
        <div class="contact-info">
          <p class="phone">+123 456 7890</p>
          <p class="address">
            171 Horseshoe Crescent,<br>
            Beimingham, B43 7BH
          </p>
          <div class="social-links">
            <a href="#" class="social-link">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="copyright">
        <p>Copyright © 2024 Drinkify | Drinkify by Catch Themes</p>
      </div>
      <nav class="footer-bottom-nav">
        <a href="#">条款与条件</a>
        <a href="#">隐私政策</a>
      </nav>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent'
}
</script>

<style scoped>
.footer {
  background: var(--background-color);
  color: var(--text-color);
  padding: 4rem 2rem 1rem;
}

.footer-content {
  max-width: var(--container-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-title {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: var(--text-white);
}

.footer-nav ul {
  list-style: none;
  padding: 0;
}

.footer-nav a {
  color: var(--text-light);
  text-decoration: none;
  display: block;
  padding: 0.5rem 0;
  transition: color 0.3s;
}

.footer-nav a:hover {
  color: var(--primary-color);
}

.contact-info {
  color: var(--text-light);
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-link {
  color: var(--text-white);
  background: rgba(255,255,255,0.1);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s;
}

.social-link:hover {
  background: var(--primary-color);
}

.footer-bottom {
  max-width: var(--container-width);
  margin: 2rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-bottom-nav a {
  color: var(--text-light);
  text-decoration: none;
  margin-left: 1.5rem;
}

@media (max-width: 768px) {
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-bottom-nav a {
    margin: 0.5rem;
  }
}
</style> 