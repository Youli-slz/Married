import _COMPONENT from '../component'

export default {
    /**
     * 默认参数
    */
    setDefault() {
        return {
            className: undefined,
            position: 'bottomRight',
            backdrop: !1,
            buttons: [],
            buttonClicked() {},
            callback() {},
        }
    },

	/**
	 * 浮动按钮组件
	 * @param {Object} opts 配置项
	 * @param {String} id   唯一标识
     * @param {String} opts.className 自定义类名
     * @param {String} opts.position 按钮的位置，可选值 topLeft、topRight、bottomLeft、bottomRight
	 * @param {Boolean} opts.backdrop 是否显示透明蒙层
     * @param {Object} opts.switch 开关按钮
	 * @param {Array} opts.buttons 按钮
     * @param {String} opts.buttons.className 按钮的类名
     * @param {String} opts.buttons.label 按钮的文字
     * @param {String} opts.buttons.icon 按钮的图标
     * @param {Function} opts.buttonClicked 按钮点击事件
	 * @param {Function} opts.callback 监听状态变化的回调函数
	 */
    init(id, opts = {}) {
        const options = Object.assign({
            animateCss: undefined,
            vidible: !1,
        }, this.setDefault(), opts);
        options.className = 'speed-dial-bottom-right';

        // 切换状态
        const toggle = (vm, opened = !1) => {
            vm.setData({
                [`$wux.button.${id}.opened`]: opened
            })
            if(typeof options.callback === 'function') {
                options.callback(vm, opened);
            }
        }

        // 实例化组件
        const _component = new _COMPONENT({
            scope: `$wux.button.${id}`,
            data: options,
            methods: {
                //隐藏
                hide() {
                    if(this.removed) return !1;
                    this.removed = !0;
                    this.setHidden();
                },

                // 显示
                show() {
                    if(this.removed) return !1;
                    this.setVisible();
                },

                //关闭
                close(){
                    if(!this.opened) return !1;
                    this.opened = !1;
                    toggle(this, !1);
                },

                //打开
                open(){
                    if(this.opened) return !1;
                    this.opened = !0;
                    toggle(this, !0);
                },

                //开关选择器change事件
                switchClicked (e) {
                    options.switchClicked(e);
                },
                // 按钮点击事件
                buttonClicked (e) {
                    const index = e.currentTarget.dataset.index;
                    if(options.buttonClicked(index, options.buttons[index]) === true) {
                        this.close();
                    }
                },

                // 切换状态
                toggle(e) {
                    !this.opened ? this.open() : this.close();
                },
            }
        })

        _component.show();
        return _component;
    }
}