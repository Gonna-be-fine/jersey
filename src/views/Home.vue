<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <p class="header-meta">遇见属于你的独特风格</p>
          <h2 class="hero-title">
            <span class="highlight">个性化定制</span> 
            <span class="winery-text">
              设计你的专属服饰
              <!-- <span>W</span>
              <span>i</span>
              <span>n</span>
              <span>e</span>
              <span>r</span>
              <span>y</span> -->
            </span>
          </h2>
          <p class="hero-description">利用AI与创新技术，定制属于你的衣服。多种款式，任你设计，尽享个性化体验。</p>
          <div class="button-wrapper">
            <button class="view-more-btn">
              <span>查看更多</span>
              <font-awesome-icon :icon="['fas', 'arrow-right']" class="btn-icon" />
            </button>
          </div>
        </div>
        <div class="hero-image">
          <img src="https://fse.catchthemes.com/drinkify/wp-content/themes/drinkify/assets/images/header-media-image.png" alt="Wine bottle" />
        </div>
      </div>
    </section>

    <!-- Best Seller Section -->
    <best-seller-section />

    <!-- Featured Products -->
    <featured-products />
    
    <!-- Testimonials -->
    <testimonials-section />

    <!-- Latest Products -->
    <latest-products />
  </div>
</template>

<script>
import BestSellerSection from '../components/home/BestSellerSection.vue'
import FeaturedProducts from '../components/home/FeaturedProducts.vue'
import TestimonialsSection from '../components/home/TestimonialsSection.vue'
import LatestProducts from '../components/home/LatestProducts.vue'

export default {
  name: 'Home',
  components: {
    BestSellerSection,
    FeaturedProducts,
    TestimonialsSection,
    LatestProducts
  }
}
</script>

<style scoped>
.hero {
  background-color: var(--secondary-bg-color, #f1f1f1);
  padding: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  margin-top: -5rem;
}

.hero-container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-content {
  padding-right: 2rem;
}

.header-meta {
  font-family: var(--font-secondary);
  font-size: 1.125rem;
  color: var(--text-dark);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hero-title {
  font-family: var(--font-primary);
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  line-height: 1.2;
  color: var(--text-dark);
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.highlight {
  color: var(--primary-color);
}

.winery-text {
  display: inline-block;
  color: var(--text-dark);
}

.winery-text span {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s forwards;
}

.winery-text span:nth-child(1) { animation-delay: 0s; }
.winery-text span:nth-child(2) { animation-delay: 0.1s; }
.winery-text span:nth-child(3) { animation-delay: 0.2s; }
.winery-text span:nth-child(4) { animation-delay: 0.3s; }
.winery-text span:nth-child(5) { animation-delay: 0.4s; }
.winery-text span:nth-child(6) { animation-delay: 0.5s; }

.hero-description {
  font-size: 1.125rem;
  color: var(--text-light);
  margin-bottom: 2rem;
  line-height: 1.8;
  max-width: 540px;
}

.button-wrapper {
  margin-top: 2rem;
}

.hero-image {
  position: relative;
  transform: translateX(0);
  opacity: 1;
  transition: all 0.6s ease-out;
  animation: floatImage 3s ease-in-out infinite;
}

.hero-image img {
  width: 100%;
  height: auto;
  max-width: 600px;
  display: block;
  margin: 0 auto;
  animation: fadeInRight 1s ease-out forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatImage {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 响应式调整 */
@media (max-width: 992px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }

  .hero-content {
    padding-right: 0;
  }

  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-image {
    order: -1;
  }

  .hero-image img {
    max-width: 400px;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-image img {
    max-width: 300px;
  }
}

.view-more-btn {
  background-color: var(--primary-color);
  color: var(--text-color);
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  text-transform: capitalize;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
}

.view-more-btn:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.view-more-btn:hover .btn-icon {
  transform: translateX(4px);
}
</style> 