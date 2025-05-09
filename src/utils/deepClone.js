export function deepClone (obj) {
    //判断传入方法是否是对象类型的数据，如果是非对象，直接执行 for 循环的赋值操作
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    let result;
    //判断需要操作数据是否为数组，然后初始化 result 类型用户承载
    if (obj instanceof Array) {
        result = [];
    } else {
        result = {};
    }
    for (let key in obj) {
        //优化处理拷贝的对象是原对象自身的属性，原型属性不进行拷贝
        if (obj.hasOwnProperty(key)) {
            //递归调用自己，直到传给 deepClone 方法是个原始类型的值
            result[key] = deepClone(obj[key]);
        }
    }
    return result;
}