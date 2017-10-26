import _COMPONENT from '../component';

export default {
    /**
     * 默认参数
    */
    setDefault() {
        return {
            type: 'success',
            text: '成功',
            timer: 1500,
            color: '#fff',
            success() {},
        }
    },

    /**
     * 默认数据
    */
    data() {
        return [
            {
                type: 'success',
                icon: 'success_no_circle',
                className: 'weui-toast-success',
            },
            {
                type: 'cancel',
                icon: 'cancel_no_circle',
                className: 'weui-toast-cancel',
            },
            {
                type: 'forbidden',
                icon: 'warn',
                className: 'weui-toast-forbidden',
            },
            {
                type: 'text',
                icon: '',
                className: 'weui-toast-text',
            },
        ]
    },

    /**
     * 显示toast组件
     * @param {Object} opts 配置项
     * @param {String} opts.type 提示类型
     * @param {Number} opts.timer 提示延迟时间
     * @param {String} opts.color 图标颜色
     * @param {Function} opts.success 关闭后的回调函数
    */
    show(opts = {}) {
        const options = Object.assign({}, this.setDefault(), opts);
        const TOAST_TYPES = this.data();

        // 判断提示的类型 显示对应图标
        TOAST_TYPES.forEach((value, key) => {
            if (value.type === opts.type) {
                options.type = value.icon;
                options.className = value.className;
            }
        })

        /**
         * 实例化toast组件
        */
        const _component = new _COMPONENT({
            scope: `$wux.toast`,
            data: options,
            methods: {
                //隐藏
                hide(e) {
                    setTimeout(() => {
                        this.setHidden();
                        typeof e == `function` && e();
                    }, options.timer)
                },
                
                //显示
                show() {
                    this.setVisible();
                }
            }
        })

        _component.show();
        _component.hide(opts.success)
    }
}