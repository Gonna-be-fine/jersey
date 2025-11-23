<template>
  <section class="testimonials-section bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
    <div class="section-heading">
      <h2 class="section-title">客户评价</h2>
    </div>

    <div class="testimonials-container">
      <div v-for="testimonial in testimonials" :key="testimonial.id" class="testimonial-item">
        <div class="testimonial-info">
          <div class="testimonial-image">
            <img :src="testimonial.avatar" :alt="testimonial.name">
          </div>
          <div class="testimonial-meta">
            <div class="testimonial-product">
              <a :href="testimonial.productLink">{{ testimonial.productName }}</a>
            </div>
            <div class="testimonial-author">{{ testimonial.name }}</div>
          </div>
        </div>
        <div class="testimonial-content">
          <p>{{ testimonial.content }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TestimonialsSection',
  data() {
    return {
      testimonials: [
        {
          id: 1,
          name: 'Sweta',
          avatar: '/images/avatar1.jpg',
          productName: 'Lanson Champagne',
          productLink: '/product/lanson-champagne',
          content: 'One of the finest Champagne. Tastes really good...'
        },
        {
          id: 2,
          name: 'Minal',
          avatar: '/images/avatar2.jpg', 
          productName: 'White Wine',
          productLink: '/product/white-wine',
          content: 'I recently tried a white wine and was thoroughly impressed. The taste was crisp and refreshing, with a delightful blend of fruity and floral notes.'
        }
      ]
    }
  }
}
</script>

<style scoped>
.testimonials-section {
  padding: 4rem 2rem;
}

.testimonial-item {
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.testimonial-info {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.testimonial-image img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.testimonial-meta {
  margin-left: 1rem;
}

.testimonial-product a {
  color: var(--primary-color);
  text-decoration: none;
}

.testimonial-author {
  font-weight: bold;
  margin-top: 0.5rem;
}

.testimonial-content {
  font-style: italic;
  color: var(--text-light);
}

/* 暗色模式覆盖（使用 :global 选择器适配 scoped 样式） */
:global(.dark) .testimonials-section {
  background: #111827; /* gray-900 */
}

:global(.dark) .testimonial-item {
  background: #1f2937; /* gray-800 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

:global(.dark) .testimonial-content {
  color: #9ca3af; /* gray-400 */
}
</style> 