export function getEnumFromStr<TKey extends string, TVal extends string>
(enumType: { [key in TKey]: TVal }, enumValue: TVal) : string | null {
    const keys = (Object.keys(enumType).filter((val) => {
        return val === enumValue;
    }))

    return keys.length == 0 ? null : keys[0];
}