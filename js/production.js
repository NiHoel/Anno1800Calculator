// @ts-check
import { EPSILON, NamedElement, Option } from './util.js'

var ko = require( "knockout" );

export class Product extends NamedElement {
    constructor(config, assetsMap) {
        super(config);


        //this.amount = ko.observable(0);

        this.factories = this.producers.map(p => assetsMap.get(p)).filter(p => !!p);
        this.availableFactories = ko.pureComputed(() => this.factories.filter(f => f.available()));

        this.fixedFactory = ko.observable(null);
        if (this.mainFactory)
            this.mainFactory = assetsMap.get(this.mainFactory);

        if (this.producers && this.factories.length) {
            //this.amount = ko.computed(() => this.factories.map(f => f.outputAmount()).reduce((a, b) => a + b));
            //this.lockDLCIfSet(this.amount); // if routes sum up to exactly zero, usage might still end up at 0.
        }

        this.visible = ko.pureComputed(() => this.available());
    }
}

export class MetaProduct extends NamedElement {
    constructor(config, assetsMap) {
        super(config);
    }
}

export class NoFactoryProduct extends NamedElement {
    constructor(config, assetsMap) {
        super(config);

        this.needs = ko.observableArray([]);
        this.amount = ko.computed(() => this.needs().map(n => n.amount()).reduce((a, b) => a + b, 0));
        this.lockDLCIfSet(this.amount);

        this.residentsInput = ko.pureComputed(() => {
            return this.amount() * this.residentsInputFactor;
        });

        this.visible = ko.computed(() => {
            return this.available() && this.amount() > 0;
        });
    }

    addNeed(need) {
        this.needs.push(need);
    }
}




export class Demand extends NamedElement {
    constructor(config, assetsMap) {
        super(config);

        this.amount = ko.observable(0);
        if (this.factor == null)
            this.factor = 1;

        this.product = assetsMap.get(this.guid);
        if (!this.product)
            throw `No Product ${this.guid}`;
        this.factory = ko.observable(config.factory);

        if (this.product) {
            this.updateFixedProductFactory(this.product.fixedFactory());
            this.product.fixedFactory.subscribe(f => this.updateFixedProductFactory(f));
        }


    }

    updateFixedProductFactory(f) {
        if (f == null && (this.consumer || this.region)) { // find factory in the same region as consumer
            let region = this.region || this.consumer.region;
            if (region && !(this.product.mainFactory && this.product.mainFactory.region === region)) {
                for (let fac of this.product.factories) {
                    if (fac.region === region) {
                        f = fac;
                        break;
                    }
                }
            }
        }

        if (f == null) // region based approach not successful
            f = this.product.mainFactory || this.product.factories[0];

        if (f != this.factory()) {
            if (this.factory())
                this.factory().remove(this);

            this.factory(f);
            f.add(this);
        }
    }

    updateAmount(amount) {
        amount *= this.factor;
        if (Math.abs(this.amount() - amount) >= EPSILON)
            this.amount(amount);
    }
}



export class ProductCategory extends NamedElement {
    constructor(config, assetsMap) {
        super(config);
        this.products = config.products.map(p => assetsMap.get(p)).filter(p => p != null && p instanceof Product);
    }
}

export class Item extends NamedElement {
    constructor(config, assetsMap, region) {
        super(config);

        if (this.replaceInputs) {
            this.replacements = new Map();
            this.replacementArray = [];


            this.replaceInputs.forEach(r => {
                this.replacementArray.push({
                    old: assetsMap.get(r.OldInput),
                    new: assetsMap.get(r.NewInput)
                });
                this.replacements.set(r.OldInput, r.NewInput);
            });
        }

        this.factories = this.factories.map(f => assetsMap.get(f)).filter(f => !!f);

        if (this.additionalOutputs) {
            this.extraGoods = [];
            for (var p of this.additionalOutputs) {
                if (p.ForceProductSameAsFactoryOutput)
                    for (var f of this.factories)
                        this.extraGoods.push(assetsMap.get(f.getOutputs()[0].Product));
                else {
                    p = assetsMap.get(p.Product);
                    if (p)
                        this.extraGoods.push(p);
                }
            }
            this.availableExtraGoods = ko.pureComputed(() => this.extraGoods.filter(p => p.available()));
        }

        if (this.replacingWorkforce)
            this.replacingWorkforce = assetsMap.get(this.replacingWorkforce);


        this.equipments =
            this.factories.map(f => new EquippedItem({ item: this, factory: f, icon: this.icon, locaText: this.locaText, dlcs: config.dlcs }, assetsMap));
        this.availableEquipments = ko.pureComputed(() => this.equipments.filter(e => e.factory.available()));

        this.checked = ko.pureComputed({
            read: () => {
                for (var eq of this.equipments)
                    if (!eq.checked())
                        return false;

                return true;
            },
            write: (checked) => {
                this.equipments.forEach(e => e.checked(checked));
            }

        });

        this.visible = ko.computed(() => {
            if (!this.available() || this.availableEquipments().length == 0)
                return false;

            if (this.availableExtraGoods && this.availableExtraGoods().length == 0)
                return false;

            if (!view.island || !view.island())
                return true;

            var region = view.island().region;
            if (!region)
                return true;

            for (var f of this.factories)
                if (f.region === region)
                    return true;

            return false;
        });
    }
}

class EquippedItem extends Option {
    constructor(config, assetsMap) {
        super(config);

        this.lockDLCIfSet(this.checked);

        this.replacements = config.item.replacements;
        this.replacementArray = config.item.replacementArray;
        this.replacingWorkforce = config.item.replacingWorkforce;

        if (config.item.additionalOutputs) {
            this.extraGoods = []
            for (var cfg of config.item.additionalOutputs) {
                try {
                    var config = $.extend(true, {}, cfg, { item: this, factory: this.factory });
                    this.extraGoods.push(new ExtraGoodProduction(config, assetsMap));
                } catch (e) { }
            }
        }

        this.factory.items.push(this);

        this.visible = ko.pureComputed(() => {
            if (!this.available())
                return false;

            if (!view.island || !view.island())
                return true;

            var region = view.island().region;
            if (!region)
                return true;

            return this.factory.region === region;
        });
    }
}

class ExtraGoodProduction {
    constructor(config, assetsMap) {
        this.item = config.item;
        this.factory = config.factory;

        var product = config.ForceProductSameAsFactoryOutput ? config.factory.getOutputs()[0].Product : config.Product;
        this.product = assetsMap.get(product);
        if (!this.product)
            throw "Product " + product + " not found";

        this.additionalOutputCycle = config.AdditionalOutputCycle;
        this.Amount = config.Amount;

        this.amount = ko.computed(() => !!this.item.checked() * config.Amount * (this.factory.clipped && this.factory.clipped() ? 2 : 1) * this.factory.inputAmount() / this.additionalOutputCycle);

        for (var f of this.product.factories) {
            f.extraGoodProductionList.entries.push(this);

            if (f == this.factory)
                f.extraGoodProductionList.selfEffecting.push(this);
        }
    }
}

export class ExtraGoodProductionList {
    constructor(factory) {
        this.factory = factory;

        this.checked = ko.observable(true);
        this.selfEffecting = ko.observableArray();

        this.entries = ko.observableArray();
        this.nonZero = ko.computed(() => {
            return this.entries().filter(i => i.amount());
        });
        this.amount = ko.computed(() => {
            var total = 0;
            for (var i of (this.entries() || []))
                if (this.selfEffecting.indexOf(i) == -1) // self effects considered in factory.extraGoodFactor
                    total += i.amount();

            return total;
        });
        this.amountWithSelf = ko.computed(() => {
            var total = 0;
            for (var i of (this.entries() || []))
                total += i.amount();

            return total;
        })
    }
}

