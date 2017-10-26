import _COMPONENT from '../component'

export default {
    /**
     * 默认参数
    */
    setDefault() {
        return {
            text: '数据加载中...',
        }
    },

    /**
     * 显示loading组件
     * @param {Object} opts 配置项
     * @param {String} text  显示文本
    */
    show(opts = {}) {
        const options = Object.assign({}, this.setDefault(),opts);

        // 实例化组件
        this._component = new _COMPONENT({
            scope: `$wux.loading`,
            data: options,
            methods: {
                // 隐藏
                hide() {
                    if (this.removed) return !1;
                    this.removed = !0;
                    this.setHidden();
                },

                // 显示
                show() {
                    if (this.removed) return !1;
                    this.setVisible();
                }
            }
        })
        this._component.show();
    },

    // 隐藏loading组件
    hide() {
        if(this._component) {
            this._component.hide();
        }
    }

}