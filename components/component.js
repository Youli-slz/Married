/**
 * 模块组件化
 * @param {Object} options 配置项
 * @param {String} options.scope 组件的命名空间
 * @param {Object} options.data  组件的方法
 * @param {Object} options.method 组件的事件方法
*/

// 创建组件类，将组件模块化
class _COMPONENT{
    constructor(options = {}) {
        Object.assign(this, {
            options,
        })
        this._init();    // 调用初始化函数
    }

    /**
     *  初始化
    */
    _init () {
        this.page = getCurrentPages()[getCurrentPages().length- 1];          // 获取当前页面信息
        this.setData = this.page.setData.bind(this.page);                  // 绑定修改数据为当前的组件
        this._initState();
    }

    /**
     * 初始化组件状态
    */
    _initState() {
        this.options.data && this._initData();          // 组件中有值并调用_initData() 有值
        this.options.methods && this._initMethods();    // 组件中有方法并调用_initMethods() 有值
    }

    /**
	 * 判断 object 是否为空
	 */
    isEmptyObject(e) {  
        for (let t in e)
            return !1
        return !0
    }

    /**
     * 绑定组件动态数据
    */
    _initData() {
        const scope = this.options.scope;
        const data = this.options.data;

        this._data = {};

        
        // 筛选非函数类型, 更改参数中函数的this指向
        if(!this.isEmptyObject(data)) {
            for(let key in data) {
                if (data.hasOwnProperty(key)) {
                    if (typeof data[key] === `function`) {
                        data[key] = data[key].bind(this);       // 将当前函数修改this指向
                    } else {
                        this._data[key] = data[key];            // 如果不是函数，则将数据放到 _data数组中
                    }
                }
            }
        }
                console.log(this._data);
        // 将数据同步到 page.data 上面方便渲染组件
        this.page.setData({
            [`${scope}`]: this._data,
        })
        
    }

    /**
     * 绑定组件事件函数
    */
    _initMethods() {
        const scope = this.options.scope;
        const methods = this.options.methods;

        // 筛选函数类型
        if (!this.isEmptyObject(methods)) {
            for(let key in methods) {
                if (methods.hasOwnProperty(key) && typeof methods[key] === `function`) {
                    this[key] = methods[key] = methods[key].bind(this);                        // 将 methods 内的方法重命名并挂载到page上面， 否则template内找不到事件
                    this.page[`${scope}.${key}`] = methods[key];                               // 将方法名同步至 page.data 上面，方便在模版内使用 {{method}} 方式绑定事件
                    this.setData({
                        [`${scope}.${key}`]: `${scope}.${key}`,
                    })
                }
            }
        }
    }

    /**
     * 获取组件的data数据
    */
    getComponentData() {
        let data = this.page.data;
        let name = this.options.scope &&　this.options.scope.split('.');
        // console.log(data);                                                     // 测试name的值
        name.forEach((n, i) => {
            data = data[n];
        })
        return data;
    }

    /**
	 * 设置元素显示
	 */
	setVisible(className = `weui-animate-fade-in`) {
		this.setData({
			[`${this.options.scope}.animateCss`]: className, 
			[`${this.options.scope}.visible`]: !0, 
		})
    }

    /**
     * 设置元素隐藏
     */
    setHidden(className = `weui-animate-fade-out`, timer = 300) {
        this.setData({
            [`${this.options.scope}.animateCss`] : className,
        })
        setTimeout(() => {
            this.setData({
                [`${this.options.scope}.visible`]: !1,
            })
        }, timer)
    }
}

export default _COMPONENT;