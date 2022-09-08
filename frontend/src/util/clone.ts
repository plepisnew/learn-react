const clone = <T>(instance: T): T => {
    return Object.assign(
        Object.create(Object.getPrototypeOf(instance)),
        JSON.parse(JSON.stringify(instance))
    );
};

export default clone;
