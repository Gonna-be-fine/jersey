/**
 * FabricMagnifier v2
 * For Fabric.js 6.6.4+
 * Right-click (PC) + Long-press (Mobile)
 */

export class FabricMagnifier {
  constructor(canvas, options = {}) {
    if (!canvas) throw new Error('FabricMagnifier: canvas required')

    this.canvas = canvas

    /* ================= 配置 ================= */
    this.zoom = options.zoom ?? 2.5
    this.size = options.size ?? 240
    this.longPress = options.longPress ?? 500
    this.mobileOffset = options.mobileOffset ?? -100

    /* ================= 状态 ================= */
    this.active = false
    this.longPressTimer = null
    this.touchStart = null

    /* ================= DOM ================= */
    this._createLens()

    /* ================= 事件 ================= */
    this._bindFabricEvents()
    this._bindNativePointerEvents()
  }

  /* =====================================================
   * 创建放大镜 DOM
   * ===================================================== */
  _createLens() {
    const lens = document.createElement('div')
    lens.style.cssText = `
      position: fixed;
      z-index: 99999;
      width: ${this.size}px;
      height: ${this.size}px;
      border-radius: 50%;
      border: 4px solid white;
      background: #fff;
      box-shadow:
        0 0 0 1px rgba(0,0,0,0.1),
        0 12px 28px rgba(0,0,0,0.35);
      pointer-events: none;
      display: none;
      will-change: transform;
    `

    const canvas = document.createElement('canvas')
    canvas.width = this.size
    canvas.height = this.size
    canvas.style.width = '100%'
    canvas.style.height = '100%'

    lens.appendChild(canvas)
    document.body.appendChild(lens)

    this.lensEl = lens
    this.lensCanvas = canvas
    this.ctx = canvas.getContext('2d')
    this.ctx.imageSmoothingEnabled = true
    
    // 添加对画布变换的监听
    this.canvas.on('after:render', () => {
      if (this.active && this.lastX && this.lastY) {
        // 重新渲染放大镜以适应画布变换
        const canvasEl = this.canvas.getElement()
        const rect = canvasEl.getBoundingClientRect()
        
        // 检查画布是否在可见区域内
        if (rect.width === 0 || rect.height === 0) {
          this._hide()
          return
        }
        
        // 计算画布的实际显示缩放比例
        const displayScale = this.canvas.getWidth() / rect.width
        
        // 将页面坐标转换回画布坐标
        const canvasX = (this.lastX - rect.left) * displayScale
        const canvasY = (this.lastY - rect.top) * displayScale
        
        this._render(canvasX, canvasY)
      }
    })
  }

  /* =====================================================
   * Fabric 事件（mouse:down / move / up）
   * ===================================================== */
  _bindFabricEvents() {
    this._onDown = this._handleDown.bind(this)
    this._onMove = this._handleMove.bind(this)
    this._onUp = this._handleUp.bind(this)

    this.canvas.on('mouse:down', this._onDown)
    this.canvas.on('mouse:move', this._onMove)
    this.canvas.on('mouse:up', this._onUp)
  }

  /* =====================================================
   * 原生 pointer 兜底（Fabric 6.6.x 必须）
   * ===================================================== */
  _bindNativePointerEvents() {
    const el = this.canvas.upperCanvasEl

    this._onPointerDown = (e) => {
      // 只处理右键
      if (e.buttons !== 2) return

      e.preventDefault()

      const rect = el.getBoundingClientRect()
      
      // 计算画布的实际显示缩放比例
      const displayScale = this.canvas.getWidth() / rect.width
      
      // 将页面坐标转换为画布坐标
      const x = (e.clientX - rect.left) * displayScale
      const y = (e.clientY - rect.top) * displayScale

      this.active = true
      this._show()
      this._render(x, y)
    }

    this._onPointerMove = (e) => {
      // 只在激活状态下处理右键移动
      if (!this.active || e.buttons !== 2) return

      e.preventDefault()

      const rect = el.getBoundingClientRect()
      
      // 计算画布的实际显示缩放比例
      const displayScale = this.canvas.getWidth() / rect.width
      
      // 将页面坐标转换为画布坐标
      const x = (e.clientX - rect.left) * displayScale
      const y = (e.clientY - rect.top) * displayScale

      this._render(x, y)
    }

    this._onPointerUp = () => this._reset()

    el.addEventListener('pointerdown', this._onPointerDown, {
      passive: false
    })
    el.addEventListener('pointermove', this._onPointerMove, {
      passive: false
    })
    el.addEventListener('pointerup', this._onPointerUp)
    el.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  /* =====================================================
   * 放大镜控制
   * ===================================================== */
  _show() {
    // 检查画布是否在可见区域内
    if (!this._isCanvasVisible()) {
      return
    }
    this.lensEl.style.display = 'block'
  }

  _hide() {
    this.lensEl.style.display = 'none'
  }

  _isCanvasVisible() {
    const canvasEl = this.canvas.getElement()
    const rect = canvasEl.getBoundingClientRect()
    
    // 检查画布是否有有效的尺寸且在视口内
    return rect.width > 0 && rect.height > 0 &&
           rect.left < window.innerWidth &&
           rect.right > 0 &&
           rect.top < window.innerHeight &&
           rect.bottom > 0
  }

  _render(x, y, offsetY = 0) {
    const r = this.size / 2
    
    // 获取画布元素的位置和尺寸
    const canvasEl = this.canvas.getElement()
    const rect = canvasEl.getBoundingClientRect()
    
    // 检查画布是否在可见区域内
    if (rect.width === 0 || rect.height === 0) {
      // 画布不可见，隐藏放大镜
      this._hide()
      return
    }
    
    // 计算画布的实际显示缩放比例
    // canvas.width 是实际画布尺寸（如2048），rect.width 是显示尺寸
    const displayScale = rect.width / this.canvas.getWidth()
    
    // 将画布坐标转换为页面坐标
    const pageX = rect.left + (x * displayScale)
    const pageY = rect.top + (y * displayScale)
    
    // 保存最后的位置，用于画布变换时重新渲染
    this.lastX = pageX
    this.lastY = pageY
    
    this.lensEl.style.transform = `translate(${pageX - r}px, ${pageY - r + offsetY}px)`

    // 获取正确的缩放比例
    const ratio = this.canvas.getRetinaScaling()
    const srcW = this.size / this.zoom
    const srcH = this.size / this.zoom

    // 清除画布
    this.ctx.clearRect(0, 0, this.size, this.size)
    
    // 创建圆形裁剪路径
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.arc(r, r, r, 0, Math.PI * 2)
    this.ctx.closePath()
    this.ctx.clip()

    // 直接使用画布坐标，不需要额外的缩放转换
    // 因为 drawImage 使用的是画布的实际像素坐标
    this.ctx.drawImage(
      canvasEl,
      (x - srcW / 2) * ratio,
      (y - srcH / 2) * ratio,
      srcW * ratio,
      srcH * ratio,
      0,
      0,
      this.size,
      this.size
    )

    // 恢复画布状态
    this.ctx.restore()

    // 十字准星（在圆形裁剪外绘制）
    this.ctx.strokeStyle = 'rgba(0,0,0,0.15)'
    this.ctx.beginPath()
    this.ctx.moveTo(this.size / 2, 0)
    this.ctx.lineTo(this.size / 2, this.size)
    this.ctx.moveTo(0, this.size / 2)
    this.ctx.lineTo(this.size, this.size / 2)
    this.ctx.stroke()
  }

  /* =====================================================
   * Fabric 事件处理
   * ===================================================== */
  _handleDown(opt) {
    const e = opt.e
    const pointer = this.canvas.getPointer(e)

    const isRight =
      e.buttons === 2 || // ✅ Fabric 6.6.x 最稳
      e.button === 2

    const isTouch = e.pointerType === 'touch'

    if (isRight) {
      this.active = true
      this._show()
      this._render(pointer.x, pointer.y)
      return
    }

    // 移动端长按
    if (isTouch) {
      this.touchStart = pointer
      this.longPressTimer = setTimeout(() => {
        // 在长按触发时再次检查画布可见性
        if (this._isCanvasVisible()) {
          this.active = true
          this._show()
          this._render(pointer.x, pointer.y, this.mobileOffset)
          navigator.vibrate?.(40)
        }
      }, this.longPress)
    }
  }

  _handleMove(opt) {
    if (!this.active) return

    const e = opt.e
    
    // 检查是否是右键移动
    const isRightMove = e.buttons === 2 || e.button === 2
    
    // 如果不是右键移动且不是触摸事件，则不处理
    if (!isRightMove && e.pointerType !== 'touch') {
      return
    }

    // 在移动时检查画布可见性
    if (!this._isCanvasVisible()) {
      this._hide()
      return
    }

    const pointer = this.canvas.getPointer(e, {
      // 确保获取正确的坐标
      fromCanvas: true
    })

    if (e.pointerType === 'touch') {
      e.preventDefault()
    }

    this._render(
      pointer.x,
      pointer.y,
      e.pointerType === 'touch' ? this.mobileOffset : 0
    )
  }

  _handleUp() {
    this._reset()
  }

  _reset() {
    this.active = false
    this._hide()

    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer)
      this.longPressTimer = null
    }
  }

  /* =====================================================
   * 销毁
   * ===================================================== */
  destroy() {
    this.canvas.off('mouse:down', this._onDown)
    this.canvas.off('mouse:move', this._onMove)
    this.canvas.off('mouse:up', this._onUp)
    // 清理画布变换监听器
    this.canvas.off('after:render')

    const el = this.canvas.upperCanvasEl
    el?.removeEventListener('pointerdown', this._onPointerDown)
    el?.removeEventListener('pointermove', this._onPointerMove)
    el?.removeEventListener('pointerup', this._onPointerUp)

    this.lensEl.remove()
    clearTimeout(this.longPressTimer)
  }
}
