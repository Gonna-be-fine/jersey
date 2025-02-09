<template>
  <div class="about-page">
    <!-- 页面标题区域 -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-title">关于我们</h1>
        <p class="page-subtitle">探索TeeCraft的品牌故事</p>
      </div>
    </section>

    <!-- 品牌故事 -->
    <section class="brand-story">
      <div class="container">
        <div class="story-content">
          <div class="story-text">
            <h2>我们的故事</h2>
            <p>TeeCraft诞生于对优质葡萄酒的热爱与追求。我们致力于为爱好者们带来世界各地精选的葡萄酒,让每一位顾客都能享受到美酒带来的愉悦。</p>
            <p>从法国波尔多到意大利托斯卡纳,从澳大利亚到智利,我们的产品来自全球最负盛名的产区,每一款酒都经过专业团队的严格筛选。</p>
          </div>
          <div class="story-image">
            <img src="@/assets/images/about-story.jpg" alt="品牌故事">
          </div>
        </div>
      </div>
    </section>

    <!-- 我们的优势 -->
    <section class="our-advantages">
      <div class="container">
        <h2 class="section-title">为什么选择我们</h2>
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="icon">
              <i class="fas fa-wine-glass-alt"></i>
            </div>
            <h3>优质精选</h3>
            <p>严格的品质把控,只为带给您最好的葡萄酒</p>
          </div>
          <div class="advantage-card">
            <div class="icon">
              <i class="fas fa-shipping-fast"></i>
            </div>
            <h3>专业配送</h3>
            <p>恒温物流,确保葡萄酒品质不受影响</p>
          </div>
          <div class="advantage-card">
            <div class="icon">
              <i class="fas fa-user-tie"></i>
            </div>
            <h3>专家团队</h3>
            <p>专业侍酒师为您提供个性化推荐</p>
          </div>
          <div class="advantage-card">
            <div class="icon">
              <i class="fas fa-certificate"></i>
            </div>
            <h3>品质保证</h3>
            <p>正品保证,假一赔十</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 团队介绍 -->
    <section class="our-team">
      <div class="container">
        <h2 class="section-title">专业团队</h2>
        <div class="team-grid">
          <div v-for="member in teamMembers" :key="member.id" class="team-member">
            <div class="member-image">
              <img :src="member.image" :alt="member.name">
            </div>
            <div class="member-info">
              <h3>{{ member.name }}</h3>
              <p class="member-position">{{ member.position }}</p>
              <p class="member-description">{{ member.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系我们 -->
    <contact-form />
  </div>
</template>

<script>
import ContactForm from '../components/home/ContactForm.vue'

export default {
  name: 'About',
  components: {
    ContactForm
  },
  data() {
    return {
      teamMembers: [
        {
          id: 1,
          name: 'John Smith',
          position: '首席品酒师',
          image: '/images/team-1.jpg',
          description: '拥有20年葡萄酒品鉴经验,曾获得多个国际侍酒师认证。'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          position: '采购总监',
          image: '/images/team-2.jpg',
          description: '负责与全球顶级酒庄建立合作关系,确保产品品质。'
        },
        {
          id: 3,
          name: 'Michael Chen',
          position: '品质总监',
          image: '/images/team-3.jpg',
          description: '专注于葡萄酒储存和运输品质控制,确保每一瓶酒的完美品质。'
        }
      ]
    }
  }
}
</script>

<style scoped>
.about-page {
  background: var(--bg-light);
}

.page-header {
  background: var(--primary-color);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.page-title {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 2rem;
}

.brand-story {
  padding: 6rem 0;
}

.story-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.story-image img {
  width: 100%;
  border-radius: 8px;
}

.our-advantages {
  background: white;
  padding: 6rem 0;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.advantage-card {
  text-align: center;
  padding: 2rem;
  background: var(--bg-light);
  border-radius: 8px;
  transition: transform 0.3s;
}

.advantage-card:hover {
  transform: translateY(-5px);
}

.icon {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.our-team {
  padding: 6rem 0;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.team-member {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.member-image img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.member-info {
  padding: 1.5rem;
}

.member-position {
  color: var(--primary-color);
  margin: 0.5rem 0;
}

.member-description {
  color: var(--text-light);
}

@media (max-width: 768px) {
  .story-content {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 2rem;
  }
}
</style> 