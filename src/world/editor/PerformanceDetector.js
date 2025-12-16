// 性能检测工具类
class PerformanceDetector {
  static detectPerformanceLevel() {
    const memory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    
    let score = 0;
    
    // 内存评分 (0-3分)
    if (memory >= 8) score += 3;
    else if (memory >= 4) score += 2;
    else score += 1;
    
    // CPU核心数评分 (0-3分)
    if (cores >= 8) score += 3;
    else if (cores >= 4) score += 2;
    else score += 1;
    
    // GPU评分 (0-4分)
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        // 根据GPU型号评分
        if (renderer.includes('NVIDIA') || renderer.includes('RTX') || renderer.includes('GTX')) {
          score += 4;
        } else if (renderer.includes('AMD') || renderer.includes('Radeon')) {
          score += 3;
        } else if (renderer.includes('Intel')) {
          score += 2;
        } else {
          score += 1;
        }
      } else {
        score += 2; // 默认中等
      }
    }
    
    return score;
  }
  
  static getOptimalSize() {
    const score = this.detectPerformanceLevel();
    
    if (score >= 8) return 4096;      // 高性能
    else if (score >= 6) return 3072; // 中高性能
    else if (score >= 4) return 2048; // 中等性能
    else return 1024;                 // 低性能
  }
}

export default PerformanceDetector;