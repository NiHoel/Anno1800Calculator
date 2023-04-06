// @ts-check

var ko = require( "knockout" );

export let versionCalculator = "v11.0";
export let isPreview = false;
export let ACCURACY = 0.01;
export let EPSILON = 0.0000001;
export let ALL_ISLANDS = "All Islands";



export function setDefaultFixedFactories(assetsMap) {
    // Default rum, cotton fabric and coffee to the new world production
    assetsMap.get(1010240).fixedFactory(assetsMap.get(1010318));
    assetsMap.get(1010257).fixedFactory(assetsMap.get(1010340));
    assetsMap.get(120032).fixedFactory(assetsMap.get(101252));
    assetsMap.get(1010216).fixedFactory(assetsMap.get(1010294));
    assetsMap.get(1010214).fixedFactory(assetsMap.get(1010292));
    assetsMap.get(1010206).fixedFactory(assetsMap.get(1010284));
}

function removeSpaces(string) {
    if (typeof string === "function")
        string = string();
    return string.replace(/\W/g, "");
}

var formater = new Intl.NumberFormat(navigator.language || "en").format;
export function formatNumber(num, forceSign = false) {
    var rounded = Math.ceil(100 * parseFloat(num)) / 100;
    if (Math.abs(rounded) < EPSILON)
        rounded = 0;
    var str = formater(rounded);
    if (forceSign && rounded > EPSILON)
        str = '+' + str;
    return str;
}

export class NumberInputHandler {
    constructor(params) {
        this.obs = params.obs;
        this.id = params.id;
        this.max = parseFloat($('#' + this.id).attr('max') || Infinity);
        this.min = parseFloat($('#' + this.id).attr('min') || -Infinity);
        this.step = parseFloat($('#' + this.id).attr('step') || 1);
        this.input = $('#' + this.id);
        if (this.input.length != 1)
            console.log("Invalid binding", this.id, this.input);
        this.input.on("wheel", evt => {
            if (document.activeElement !== this.input.get(0))
                return;

            evt.preventDefault();
            var deltaY = evt.deltaY || (evt.originalEvent || {}).deltaY;
            var sign = -Math.sign(deltaY);
            var factor = this.getInputFactor(evt);

            var val = parseFloat(this.obs()) + sign * factor * this.step + ACCURACY;
            val = Math.max(this.min, Math.min(this.max, val));
            this.obs(Math.floor(val / this.step) * this.step);

            return false;
        });
    }

    getInputFactor(evt) {
        var factor = 1
        if (evt.ctrlKey)
            factor *= 10
        if (evt.shiftKey)
            factor *= 100
        return factor
    }
}

export function formatPercentage(number, forceSign = true) {
    return window.formatNumber(Math.ceil(10 * parseFloat(number)) / 10, forceSign) + ' %';
}

export function delayUpdate(obs, val) {
    var version = obs.getVersion ? obs.getVersion() : obs();
    setTimeout(() => {
        if (obs.getVersion && !obs.hasChanged(version) || version === obs())
            obs(val);
    });
}



// from https://knockoutjs.com/documentation/extenders.html
ko.extenders.numeric = function (target, bounds) {
    //create a writable computed observable to intercept writes to our observable
    var result = ko.computed({
        read: target,  //always return the original observables value
        write: function (newValue) {
            var current = target();

            if (bounds.precision === 0)
                var valueToWrite = parseInt(newValue);
            else if (bounds.precision) {
                var roundingMultiplier = Math.pow(10, bounds.precision);
                var newValueAsNum = isNaN(newValue) ? 0 : +newValue;
                var valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;
            } else {
                var valueToWrite = parseFloat(newValue);
            }

            if (!isFinite(valueToWrite) || valueToWrite == null) {
                if (newValue != current)
                    target.notifySubscribers(); // reset input field

                return;
            }

            if (valueToWrite > bounds.max)
                valueToWrite = bounds.max;

            if (valueToWrite < bounds.min)
                valueToWrite = bounds.min;

            if (bounds.callback && typeof bounds.callback === "function") {
                valueToWrite = bounds.callback(valueToWrite, current, newValue);
                if (valueToWrite == null)
                    return;
            }

            //only write if it changed
            if (valueToWrite !== current || newValue !== valueToWrite) {
                if (result._state && result._state.isBeingEvaluated) {
                    console.log("cycle detected, propagation stops");
                    return;
                }

                target(valueToWrite);
                if (newValue !== valueToWrite)
                    target.valueHasMutated()
            }
        }
    }).extend({ notify: 'always' });

    //initialize with current value to make sure it is rounded appropriately
    result(target());

    //return the new computed observable
    return result;
};


/**
 * 
 * @param {number} init - inital value
 * @param {number} min
 * @param {number} max
 * @param {beforeValueUpdateCallback} callback
 */
export function createIntInput(init, min = -Infinity, max = Infinity, callback = null) {
    return ko.observable(init).extend({
        numeric: {
            precision: 0,
            min: min,
            max: max,
            callback: callback
        }
    });
}

export function createFloatInput(init, min = -Infinity, max = Infinity, callback = null) {
    return ko.observable(init).extend({
        numeric: {
            min: min,
            max: max,
            precision: 6,
            callback: callback
        }
    });
}



export class NamedElement {
    constructor(config) {
        $.extend(this, config);
        this.locaText = this.locaText || {}
        this.name = ko.computed(() => {

            let text = this.locaText[view.settings.language()];
            if (text)
                return text;

            text = this.locaText["english"];
            return text ? text : config.name;
        });

        if (this.iconPath && params && params.icons)
            this.icon = params.icons[this.iconPath];

        if (this.dlcs && params && params.dlcs) {
            this.dlcs = this.dlcs.map(d => view.dlcsMap.get(d)).filter(d => d);
            this.available = ko.pureComputed(() => {
                for (var d of this.dlcs) {
                    if (d.checked())
                        return true;
                }

                return false;
            });
            this.dlcLockingObservables = [];
        } else {
            this.available = ko.pureComputed(() => true)
        }

    }

    lockDLCIfSet(obs) {
        if (this.dlcs == null || this.dlcs.length != 1)
            return;

        this.dlcLockingObservables.push(obs);
        this.dlcs[0].addDependentObject(obs);
    }

    delete() {
        if (this.dlcs == null || this.dlcs.length != 1)
            return;

        for (var obs of this.dlcLockingObservables)
            this.dlcs[0].removeDependentObject(obs);
    }
}

export class Option extends NamedElement {
    constructor(config) {
        super(config);
        this.checked = ko.observable(false);
        this.visible = ko.observable(!!config);
    }
}

export class DLC extends Option {
    constructor(config) {
        super(config);

        this.dependentObjects = ko.observableArray([]).extend({ deferred: true }); // notify subscribers at most once per 500 ms

        this.used = ko.pureComputed(() => {
            for (var obs of this.dependentObjects())
                if (obs() != 0) // can be int, float or bool -> non-strict comparison
                    return true;

            return false;
        });

        this.used.subscribe(val => {
            if (val)
                this.checked(true);
        })
    }

    /**
     * 
     * @param {ko.observable} obs
     */
    addDependentObject(obs) {
        this.dependentObjects.push(obs);
    }

    /**
     *
     * @param {ko.observable} obs
     */
    removeDependentObject(obs) {
        this.dependentObjects.remove(obs);
    }
}


