class JBDecimal {
    constructor(input) {
        if (input instanceof JBDecimal) {
            this.mantissa = input.mantissa;
            this.exponent = input.exponent;
        }
        else if (typeof input === "number") {
            this.mantissa = input;
            this.exponent = 0;
        }
        else {
            addToDisplay('Invalid JBDecimal construtor input', 'achievement');
        }
        this.normalize();
    }
    pow(value) {
        var ret = new JBDecimal(1);
        if (value === 0) {
            return ret;
        }
        ret.mantissa = Math.pow(this.mantissa, value);
        if (!isFinite(ret.mantissa)) {
            return this.pow2(value);
        }
        ret.exponent = this.exponent * value;
        ret.normalize();
        return ret;
    }
    pow2(value) {
        if (value === 0) {
            return new JBDecimal(1);
        }
        var x = new JBDecimal(this.pow2(Math.floor(value / 2)));
        if (value % 2 === 0) {
            return x.multiply(new JBDecimal(x));
        }
        else {
            return this.multiply(new JBDecimal(x).multiply(new JBDecimal(x)));
        }
    }
    equals(input) {
        var val = new JBDecimal(input);
        if (this.mantissa === val.mantissa && this.exponent === val.exponent) {
            return true;
        }
        return false;
    }
    between(val1, val2, inclusive = true) {
        if (inclusive) {
            if (this.greaterThanOrEqualTo(val1)) {
                if (val2.greaterThanOrEqualTo(this)) {
                    return true;
                }
            }
            if (val1.greaterThanOrEqualTo(this)) {
                if (this.greaterThanOrEqualTo(val2)) {
                    return true;
                }
            }
        }
        if (this.greaterThan(val1)) {
            if (val2.greaterThan(this)) {
                return true;
            }
        }
        if (val1.greaterThan(this)) {
            if (this.greaterThan(val2)) {
                return true;
            }
        }
        return false;
    }
    setToExponent(exp) {
        while (this.exponent < exp) {
            this.exponent += 1;
            this.mantissa /= 10;
        }
        while (this.exponent > exp) {
            this.exponent -= 1;
            this.mantissa *= 10;
        }
    }
    add(input) {
        var val = new JBDecimal(input);
        var ret = new JBDecimal(0);
        var expdiff = val.exponent - this.exponent;
        if (expdiff > 15) {
            if (this.greaterThan(val)) {
                ret = new JBDecimal(this);
            }
            else {
                ret = new JBDecimal(val);
            }
            return ret;
        }
        val.mantissa = val.mantissa * Math.pow(10, expdiff);
        ret.mantissa = this.mantissa + val.mantissa;
        ret.exponent = this.exponent;
        ret.normalize();
        return ret;
    }
    subtract(input) {
        var val = new JBDecimal(input);
        var ret = new JBDecimal(this);
        var expdiff = val.exponent - ret.exponent;
        if (expdiff > 15) {
            val.mantissa = 0 - val.mantissa;
            return val;
        }
        if (expdiff < -15) {
            return ret;
        }
        val.mantissa = val.mantissa * Math.pow(10, expdiff);
        ret.mantissa -= val.mantissa;
        ret.normalize();
        return ret;
    }
    difference(val) {
        var larger = new JBDecimal(0);
        var smaller = new JBDecimal(0);
        var swap = false;
        if (this.greaterThan(val)) {
            larger = new JBDecimal(this);
            smaller = new JBDecimal(val);
        }
        else {
            larger = new JBDecimal(val);
            smaller = new JBDecimal(this);
            swap = true;
        }
        while (larger.exponent > smaller.exponent) {
            smaller.mantissa /= 10;
            smaller.exponent += 1;
        }
        var val = new JBDecimal(0);
        val.mantissa = larger.mantissa - smaller.mantissa;
        if (swap) {
            val.mantissa = 0 - val.mantissa;
        }
        val.exponent = larger.exponent;
        val.normalize();
        return val;
    }
    multiply(input) {
        var val = new JBDecimal(input);
        var ret = new JBDecimal(this);
        ret.mantissa = ret.mantissa * val.mantissa;
        ret.exponent = ret.exponent + val.exponent;
        ret.normalize();
        return ret;
    }
    divide(input) {
        var val = new JBDecimal(input);
        var ret = new JBDecimal(this);
        ret.mantissa = ret.mantissa / val.mantissa;
        ret.exponent = ret.exponent - val.exponent;
        ret.normalize();
        return ret;
    }
    lessThan(input) {
        var val = new JBDecimal(input);
        if (this.mantissa >= 0 && val.mantissa < 0) {
            return false;
        }
        if (val.mantissa >= 0 && this.mantissa < 0) {
            return true;
        }
        if (this.mantissa === 0) {
            if (val.mantissa > 0) {
                return true;
            }
            else {
                return false;
            }
        }
        if (val.mantissa === 0) {
            if (this.mantissa >= 0) {
                return false;
            }
            else {
                return true;
            }
        }
        if (this.exponent > val.exponent) {
            return false;
        }
        else if (this.exponent < val.exponent) {
            return true;
        }
        else if (this.mantissa >= val.mantissa) {
            return false;
        }
        return true;
    }
    lessThanOrEqualTo(input) {
        var val = new JBDecimal(input);
        if (this.mantissa >= 0 && val.mantissa < 0) {
            return false;
        }
        if (val.mantissa >= 0 && this.mantissa < 0) {
            return true;
        }
        if (this.mantissa === 0) {
            if (val.mantissa >= 0) {
                return true;
            }
            else {
                return false;
            }
        }
        if (val.mantissa === 0) {
            if (this.mantissa > 0) {
                return false;
            }
            else {
                return true;
            }
        }
        if (this.exponent > val.exponent) {
            return false;
        }
        else if (this.exponent < val.exponent) {
            return true;
        }
        else if (this.mantissa > val.mantissa) {
            return false;
        }
        return true;
    }
    greaterThan(input) {
        var val = new JBDecimal(input);
        if (this.mantissa >= 0 && val.mantissa < 0) {
            return true;
        }
        if (val.mantissa >= 0 && this.mantissa < 0) {
            return false;
        }
        if (this.mantissa === 0) {
            if (val.mantissa >= 0) {
                return false;
            }
            else {
                return true;
            }
        }
        if (val.mantissa === 0) {
            if (this.mantissa > 0) {
                return true;
            }
            else {
                return false;
            }
        }
        if (this.exponent > val.exponent) {
            return true;
        }
        else if (this.exponent < val.exponent) {
            return false;
        }
        else if (this.mantissa > val.mantissa) {
            return true;
        }
        return false;
    }
    greaterThanOrEqualTo(input) {
        var val = new JBDecimal(input);
        if (this.mantissa >= 0 && val.mantissa < 0) {
            return true;
        }
        if (val.mantissa >= 0 && this.mantissa < 0) {
            return false;
        }
        if (this.mantissa === 0) {
            if (val.mantissa > 0) {
                return false;
            }
            else {
                return true;
            }
        }
        if (val.mantissa === 0) {
            if (this.mantissa >= 0) {
                return true;
            }
            else {
                return false;
            }
        }
        if (this.exponent > val.exponent) {
            return true;
        }
        else if (this.exponent < val.exponent) {
            return false;
        }
        else if (this.mantissa >= val.mantissa) {
            return true;
        }
        return false;
    }
    floor(divisor = 1) {
        var val2 = new JBDecimal(this).divide(new JBDecimal(divisor));
        if (val2.exponent < 0) {
            return new JBDecimal(0);
        }
        else if (val2.exponent > 8) {
            return new JBDecimal(val2);
        }
        else {
            var val = val2.ToNumber();
            return new JBDecimal(Math.floor(val));
        }
    }
    normalize() {
        if (this.mantissa === 0) {
            this.exponent = 0;
            return;
        }
        ;
        while (Math.abs(this.mantissa) >= 10) {
            this.exponent += 1;
            this.mantissa /= 10;
        }
        while (Math.abs(this.mantissa) < 1) {
            this.exponent -= 1;
            this.mantissa *= 10;
        }
        this.mantissa = parseFloat(this.mantissa.toFixed(10));
    }
    ToString() {
        this.normalize();
        if (this.exponent === 0) {
            var val = this.mantissa;
            val = Number(val.toFixed(2));
            return val.toString();
        }
        if (this.exponent < -2) {
            return '0';
        }
        if (this.exponent === -2) {
            var val = this.ToNumber();
            val = Number(val.toFixed(2));
            return val.toString();
        }
        if (this.exponent === -1) {
            var val = this.ToNumber();
            val = Number(val.toFixed(2));
            return val.toString();
        }
        /*     if (this.exponent === -2) {
              var val = this.ToNumber();
              val = Number(val.toFixed(2));
              return val.toString();
            }
            if (this.exponent === -1) {
              var val = this.ToNumber();
              val = Number(val.toFixed(2));
              return val.toString();
            }
         */
        if (this.exponent === 1) {
            var val = this.ToNumber();
            val = Number(val.toFixed(1));
            return val.toString();
        }
        if (this.exponent === 2) {
            var val = this.ToNumber();
            val = Number(val.toFixed(0));
            return val.toString();
        }
        if (this.exponent === 3) {
            var val = this.ToNumber();
            val = Number(val.toFixed(0));
            return val.toString();
        }
        var val = Number(this.mantissa.toFixed(2));
        return val.toString() + 'e' + this.exponent.toString();
    }
    ToNumber() {
        if (this.exponent > 307) {
            addToDisplay('nope', 'achievement');
        }
        var ret = this.mantissa * Math.pow(10, this.exponent);
        return ret;
    }
}
//# sourceMappingURL=JBDecimal.js.map