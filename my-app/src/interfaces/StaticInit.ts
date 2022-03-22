export interface IStaticInit<Prop, Return> {
    init(fn: () => {}, args: Prop): Return;
}

export function staticImplements<Interface>() {
    return <U extends Interface>(constructor: U) => {constructor};
}