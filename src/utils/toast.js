import { createVNode, render } from 'vue';
import Toast from '../components/common/Toast.vue';

const toastTypes = ['success', 'error', 'warning', 'info'];

export const useToast = () => {
  const show = (options) => {
    if (typeof options === 'string') {
      options = { message: options };
    }

    const container = document.createElement('div');
    const vnode = createVNode(Toast, {
      ...options,
      onDestroy: () => {
        render(null, container);
      }
    });

    render(vnode, container);
    document.body.appendChild(container);

    setTimeout(() => {
      document.body.removeChild(container);
    }, (options.duration || 2000) + 300); // 加300ms确保动画完成
  };

  // 为每种类型创建快捷方法
  const toast = show;
  toastTypes.forEach(type => {
    toast[type] = (message, options = {}) => {
      return show({
        message,
        type,
        ...options
      });
    };
  });

  return toast;
}; 