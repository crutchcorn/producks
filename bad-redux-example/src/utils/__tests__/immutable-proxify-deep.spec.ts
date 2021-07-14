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
    test('Proxifing should not mutate the original in any way', () => {
        const proxyObj = immutableProxifyDeep(obj);
        expect(proxyObj).not.toBe(obj);
        expect(proxyObj.lv1).not.toBe(obj.lv1);
        expect(proxyObj.lv1.lv2).not.toBe(obj.lv1.lv2);
        expect(obj.num).toBe(12);
        expect(proxyObj.lv1.lv2.lv3).toBe(1);
    })

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

    test('should create new subproxy when object added', () => {
        const proxyObj = immutableProxifyDeep(obj);
        expect(proxyObj.num).toBe(12);
        expect(obj.num).toBe(12);
        proxyObj.num = {
            hello: 9
        }
        expect(proxyObj.num.hello).toBe(9);
        expect(obj.num.hello).toBe(9);
        proxyObj.num.hello = 1;
        expect(proxyObj.num.hello).toBe(1);
        expect(obj.num.hello).toBe(1);
    })

    test('change function should run', () => {
        const changeFn = jest.fn();
        const proxyObj = immutableProxifyDeep(obj, changeFn);
        proxyObj.num = {
            hello: 9
        }
        expect(changeFn).toHaveBeenCalled();
    })

    test("updating original object should update proxy on GET trap call", () => {
      const changeFn = jest.fn();
      const proxyObj = immutableProxifyDeep(obj, changeFn);
      obj.num = {
        hello: 9,
      };
      expect(proxyObj.num.hello).toBe(9);
      // OK, now verify that it's actually proxy trapped
      proxyObj.num.hello = 100;
      expect(obj.num.hello).toBe(100);
    });
    
    test("preserved prototype of array store", () => {
      const proxyArr = immutableProxifyDeep([1, 2, 3]);
      
      expect(proxyArr.map(i => i + 1)).toEqual([2, 3, 4]);
    });
})
