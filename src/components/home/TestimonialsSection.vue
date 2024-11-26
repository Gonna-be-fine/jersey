<template>
  <section class="testimonials-section">
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
  background: var(--bg-light);
}

.testimonial-item {
  background: var(--bg-white);
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
</style> 