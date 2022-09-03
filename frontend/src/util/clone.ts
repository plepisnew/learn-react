export default <T>(instance: T): T => {
    return Object.assign(
        Object.create(
            Object.getPrototypeOf(instance),
        ),
        JSON.parse(JSON.stringify(instance)),
    );
}