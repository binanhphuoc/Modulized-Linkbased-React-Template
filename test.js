class test {
    static instance = null;
    constructor(value) {
        if (test.instance === null){
            this.prevValue = -1;
            this.value = value;
            test.instance = this;
            return test.instance;
        }
        let instance = test.instance;
        instance.prevValue = instance.value;
        instance.value = value;
        return test.instance;
    }
}

const maketest = (value) => {
    return new test(value);
}

let object = maketest(12);
console.log(`${object.prevValue} ${object.value}`);

let object2 = maketest(14);
console.log(`${object2.prevValue} ${object2.value}`)

console.log(2 instanceof test);