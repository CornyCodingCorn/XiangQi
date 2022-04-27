export default class EventHander<TParam> {
    private _callbacks: ((arg0: TParam) => void)[] = [];

    public addCallback(callback: (args: TParam) => void) {
        let index = this._callbacks.indexOf(callback);
        if (index < 0)
            return;

        this._callbacks.push(callback);
    }

    public removeCallback(callback: (args: TParam) => void) {
        let index = this._callbacks.indexOf(callback);
        if (index < 0)
            return;

        this._callbacks.splice(index, 1);
    }

    public invoke(param: TParam) {
        this._callbacks.forEach((fn) => {
            fn(param);
        })
    }
}