class Resource{
    name: string;
  
    amount: JBDecimal;
  
    constructor(
      name: string,
    ) {
      this.name = name;
      this.amount = new JBDecimal(0)
    }
  
    add(amt: JBDecimal) {
        this.amount = this.amount.add(amt);
    }
  
    subtract(amt: JBDecimal) {
        this.amount = this.amount.subtract(amt)
    }
  }