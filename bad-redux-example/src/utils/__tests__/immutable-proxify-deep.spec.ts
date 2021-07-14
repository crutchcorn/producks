import {immutableProxifyDeep} from "../immutable-proxify-deep";

let obj = {} as any;

beforeEach(() => {
    obj = {
        lv1: {
            lv2: {
                lv3: 1
            }
        },
        num: 12
    }
})

describe('Immutable proxify deep', () => {
    test('Should reflect data from promise to original', () => {
        const proxyObj = immutableProxifyDeep(obj);
        expect(proxyObj.num).toBe(12);
        expect(obj.num).toBe(12);
        proxyObj.num = 999;
        expect(proxyObj.num).toBe(999);
        expect(obj.num).toBe(999);
    })

    test('should reflect deep data', () => {
        const proxyObj = immutableProxifyDeep(obj);
        expect(proxyObj.lv1.lv2.lv3).toBe(1);
        expect(obj.lv1.lv2.lv3).toBe(1);
        proxyObj.lv1.lv2.lv3 = 999;
        expect(proxyObj.lv1.lv2.lv3).toBe(999);
        expect(obj.lv1.lv2.lv3).toBe(999);
    })
})
