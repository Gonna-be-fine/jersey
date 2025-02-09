import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  persist: true,
  
  getters: {
    cartItemCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },
    
    totalPrice: (state) => {
      return state.items
        .reduce((total, item) => total + (item.price * item.quantity), 0)
        .toFixed(2)
    }
  },
  
  actions: {
    addToCart(orderInfo) {
      const { players, price, productName, design } = orderInfo;
      
      // 为每个球员创建一个订单项
      players.forEach(player => {
        const item = {
          id: Date.now() + Math.random(), // 生成唯一ID
          name: productName,
          price: parseFloat(price),
          quantity: 1,
          size: player.size,
          playerName: player.name,
          playerNumber: player.number,
          design: design // 保存当前的设计信息
        };
        
        this.items.push(item);
      });

      // 保存到localStorage
      this.saveToLocalStorage();
    },
    
    removeItem(itemId) {
      const index = this.items.findIndex(item => item.id === itemId);
      if (index > -1) {
        this.items.splice(index, 1);
        // 保存到localStorage
        this.saveToLocalStorage();
      }
    },
    
    updateQuantity(itemId, quantity) {
      const item = this.items.find(item => item.id === itemId);
      if (item) {
        item.quantity = quantity;
        // 保存到localStorage
        this.saveToLocalStorage();
      }
    },
    
    clearCart() {
      this.items = [];
      // 清除localStorage
      localStorage.removeItem('cartItems');
    },

    // 保存到localStorage的辅助方法
    saveToLocalStorage() {
      try {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
      } catch (e) {
        console.error('Error saving cart to localStorage:', e);
      }
    }
  }
}) 