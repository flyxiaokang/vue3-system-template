

export const NumFormatUtil = {
    getD : function(d, n) {
        if (d < 0) {
            return `-${NumFormatUtil.getD(Math.abs(d), n)}`;
        } else {
            //转换成带小数点的字符串
            let dStr = d.toFixed(n + 2);

            let ddIntLen = `${parseInt(d)}`.length;

            let left = parseInt(dStr.substring(0, n));//有效位
            let is5 = parseInt(dStr.substring(n, n + 1));//是否为5
            let nnn = parseInt(dStr.substring(n - 1, n));//第n位
            let not0 = Number(dStr.substring(n + 1));//第n位
            let add = 0;//需要进一吗
            let added = false;
            if (is5 == 5) {
                //奇进偶不进
                if (nnn % 2 == 1 || not0 != 0) {
                    added = true;
                }
            } else if (is5 > 5) {
                //加进一
                added = true;
            }
            //N-1位要进一需要乘的数
            //			let str = StringUtils.rightPad("1", ddIntLen - n + 1 , "0");
            let str = Math.pow(10, ddIntLen - n);
            if (added) {
                add = 1;//需要进一
            }

            return `${(left + add) * parseInt(str)}`;
        }
    },
    getNumZ : function(d) {
        if (d || (d != '' && d == 0)) {
            d = parseFloat(d);
            d = d.toFixed(2);
        }
        return d;
    },
    getNumR : function(d) {
        if (d || (d !== '' && d == 0)) {
            d = parseFloat(d);
            d = d.toFixed(1);
            if(d==0){
                d="0.0";
            }
        }
        return d;
    },
    /**
     * 格式化蒸发量数据
     * @param {*} d 
     * @returns 
     */
    getNumE : function(d) {
        if (d || (d != '' && d == 0)) {
            d = parseFloat(d);
            d = d.toFixed(1);
        }
        return d;
    },
    getNumW : function(d) {
        if (d || (d != '' && d == 0)) {
            d = parseFloat(d);
            d = d.toFixed(3);
        }
        return d;
    },
    getD2 : function(d, n) {
        if (d < 0) {
            return `-${NumFormatUtil.getD2(Math.abs(d), n)}`;
        } else if (d == 0) {
            //return "0.00";
            return "0";
        }
        if (n > 0) {
            if (d > 0 && d < 1) {
                //(0, 1)调用[1, 10)的方法
                let str = `${Number(NumFormatUtil.getD2(d*100.0, n)) / 100.00}`;
                if (str.length == 1) {
                    str += ".000";
                } else if (str.length == 3) {
                    str += "00";
                } else if (str.length == 4) {
                    str += "000";
                }
                return str;
            } else if (d >= 1 && d < 10){
                //(1, 10)调用[10, 100)的方法
                let str = `${Number(NumFormatUtil.getD2(d*10.0, n)) / 10.0}`;
                if (str.length == 1) {
                    str += ".00";
                } else if (str.length == 3) {
                    str += "0";
                }
                return str;
            } else if (d >= 10 && d < 100) {
                //(10, 100)调用[1000)的方法
                return `${parseInt(Number(NumFormatUtil.getD2(d*10.0, n)) / 10.0)}`;
            } else if (d >= 100) {
                return NumFormatUtil.getD(d, n);
            }

        } else {
            return `${d}`;
        }

        return null;
    },
    getNumQ : function(d) {
        if (d || d == 0) {
            d = parseFloat(d);
            return NumFormatUtil.getD3(d, 3);
        }
        return d;
    },
    getD3 : function(d, n) {
        if (d < 0) {
            return `-${NumFormatUtil.getD3(Math.abs(d), n)}`;
        } else if (d == 0) {
            //return "0.000";
            return "0";
        }
        if (n > 0) {
            if (d > 0 && d < 1) {
                //(0, 1)调用[1, 10)的方法
                let str = `${Number(NumFormatUtil.getD3(d*100.0, n)) / 100.00}`;
                if (str.length == 1) {
                    str += ".000";
                } else if (str.length == 3) {
                    str += "00";
                } else if (str.length == 4) {
                    str += "0";
                } else if (str.length > 5) {
                    str = str.substring(0, 5);
                }
                return str;
            } else if (d >= 1 && d < 10){
                //(1, 10)调用[10, 100)的方法
                let str = `${Number(NumFormatUtil.getD3(d*10.0, n)) / 10.0}`;
                //				return StringUtils.rightPad(str, n + 1, "0");
                if (str.length == 1) {
                    str += ".00";
                } else if (str.length == 3) {
                    str += "0";
                } else if (str.length > 4) {
                    str = str.substring(0, 4);
                }
                return str;
            } else if (d >= 10 && d < 100) {
                //(10, 100)调用[1000)的方法
                let str = `${Number(NumFormatUtil.getD3(d*10.0, n)) / 10.0}`;
                if (str.length == 2) {
                    str += ".0";
                }
                return str;
            } else if (d >= 100 && d < 1000) {
                //(100, 1000)调用[10000)的方法
                return `${parseInt(Number(NumFormatUtil.getD3(d*10.0, n)) / 10.0)}`;
            } else if (d >= 1000) {
                return NumFormatUtil.getD(d, n);
            }

        } else {
            return `${d}`;
        }

        return null;
    }
};
