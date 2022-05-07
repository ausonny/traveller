class Resource {
    constructor(name) {
        this.name = name;
        this.amount = new JBDecimal(0);
    }
    add(amt) {
        this.amount = this.amount.add(amt);
    }
    subtract(amt) {
        this.amount = this.amount.subtract(amt);
    }
}
//# sourceMappingURL=Resource.js.map