export default (function() {
    
    // 装饰器，在当前函数执行前先执行另一个函数
    function decoratorBefore(fn, beforeFn) {
        return function() {
            var ret = beforeFn.apply(this, arguments);

            // 在前一个函数中判断，不需要执行当前函数
            if (ret !== false) {
                fn.apply(this, arguments);
            }
        };
    }

    // 装饰器，在当前函数执行后执行另一个函数
    function decoratorAfter(fn, afterFn) {
        return function() {
            fn.apply(this, arguments);
            afterFn.apply(this, arguments);
        };
    }
    
    // 执行次数
    var funTimes = {};
    
    // 给fun添加装饰器，fun执行前后计时
    return function(fun, obj) {
        var funName = fun;

        // if (funTimes[funName]) {
        //     return funTimes[funName];
        // }
        
        // 绑定
        funTimes[funName] = decoratorAfter(decoratorBefore(fun, function() {
            // 执行前
            funTimes[funName].timestampStart = performance.now();
        }), function() {
            // 执行后
            funTimes[funName].timestampEnd = performance.now();
            
            // 将执行耗时存入
            funTimes[funName].valueOf = function() {
                return this.timestampEnd - this.timestampStart;
            };

            // debugger
            var time = +funTimes[funName]
            obj.timeUse = time.toFixed(2)
            console.log(obj.timeUse)
        });

        
        return funTimes[funName];
    }
})();