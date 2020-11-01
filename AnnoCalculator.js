let versionCalculator = "v3.9";
let EPSILON = 0.01;
let ALL_ISLANDS = "All Islands";

var languageCodes = {
    'en': 'english',
    'de': 'german',
    'fr': 'french',
    'ru': 'russian',
    'ko': 'korean',
    'ja': 'japanese',
    'zh': 'chinese',
    'it': 'italien',
    'es': 'spanish',
    'pl': 'polish'
}

view = {
    settings: {
        language: ko.observable("english")
    },
    texts: {}
};

for (var code in languageCodes)
    if (navigator.language.startsWith(code))
        view.settings.language(languageCodes[code]);

class Storage {
    constructor(key) {
        this.key = key;
        var text = localStorage.getItem(key);
        this.json = text ? JSON.parse(text) : {};

        this.length = 0;
        for (var attr in this.json)
            this.length = this.length + 1;
    }

    setItem(itemKey, value) {
        if (this.json[itemKey] == null)
            this.length = this.length + 1;

        this.json[itemKey] = value;
        this.save();
    }

    getItem(itemKey) {
        return this.json[itemKey];
    }

    removeItem(itemKey) {
        if (this.json[itemKey] != null)
            this.length = this.length - 1;

        delete this.json[itemKey];
        this.save();
    }

    key(index) {
        var i = 0;
        for (let attr in this.json)
            if (i++ == index)
                return attr;

        return null;
    }

    clear() {
        this.json = {}
        this.save();
        this.length = 0;
    }

    save() {
        localStorage.setItem(this.key, JSON.stringify(this.json, null, 4));
    }
}

class NamedElement {
    constructor(config) {
        $.extend(this, config);
        this.locaText = this.locaText || {}
        this.name = ko.computed(() => {

            let text = this.locaText[view.settings.language()];
            if (text)
                return text;

            text = this.locaText["english"];
            return text ? text : config.name;
        })
    }
}

class Region extends NamedElement { }

class Option extends NamedElement {
    constructor(config) {
        super(config);
        this.checked = ko.observable(false);
        this.visible = !!config;
    }
}

class Island {
    constructor(params, localStorage) {
        if (localStorage instanceof Storage) {
            this.name = ko.observable(localStorage.key);
            this.isAllIslands = function () { return false; };
        } else {
            this.name = ko.computed(() => view.texts.allIslands.name());
            this.isAllIslands = function () { return true; };
        }
        this.storage = localStorage;
        var isNew = !localStorage.length;

        var assetsMap = new Map();

        this.regions = [];
        this.populationLevels = [];
        this.consumers = [];
        this.factories = [];
        this.categories = [];
        this.workforce = [];
        this.buildingMaterialsNeeds = [];
        this.multiFactoryProducts = [];
        this.items = [];
        this.replaceInputItems = [];
        this.extraGoodItems = [];

        for (let region of params.regions) {
            let r = new Region(region, assetsMap);
            assetsMap.set(r.guid, r);
            this.regions.push(r);
        }

        for (let workforce of params.workforce) {
            let w = new Workforce(workforce, assetsMap)
            assetsMap.set(w.guid, w);
            this.workforce.push(w);
        }

        for (let consumer of params.powerPlants) {
            let f = new Consumer(consumer, assetsMap)
            assetsMap.set(f.guid, f);
            this.consumers.push(f);

            if (localStorage) {
                {
                    let id = f.guid + ".existingBuildings";
                    if (localStorage.getItem(id))
                        f.existingBuildings(parseInt(localStorage.getItem(id)));

                    f.existingBuildings.subscribe(val => localStorage.setItem(id, val));
                }
            }
        }

        for (let consumer of (params.modules || [])) {
            let f = new Module(consumer, assetsMap);
            assetsMap.set(f.guid, f);
            this.consumers.push(f);
        }

        for (let buff of (params.palaceBuffs || [])) {
            let f = new PalaceBuff(buff, assetsMap);
            assetsMap.set(f.guid, f);
        }

        for (let factory of params.factories) {
            let f = new Factory(factory, assetsMap)
            assetsMap.set(f.guid, f);
            this.consumers.push(f);
            this.factories.push(f);

            if (localStorage) {
                if (f.moduleChecked) { // set moduleChecked before boost, otherwise boost would be increased
                    let id = f.guid + ".module.checked";
                    if (localStorage.getItem(id))
                        f.moduleChecked(parseInt(localStorage.getItem(id)));

                    f.moduleChecked.subscribe(val => localStorage.setItem(id, val ? 1 : 0));
                }

                if (f.palaceBuff) {
                    let id = f.guid + ".palaceBuff.checked";
                    if (localStorage.getItem(id))
                        f.palaceBuffChecked(parseInt(localStorage.getItem(id)));

                    f.palaceBuffChecked.subscribe(val => localStorage.setItem(id, val ? 1 : 0));
                }

                {
                    let id = f.guid + ".percentBoost";
                    if (localStorage.getItem(id))
                        f.percentBoost(parseInt(localStorage.getItem(id)));

                    f.percentBoost.subscribe(val => {
                        val = parseInt(val);

                        if (val == null || !isFinite(val) || isNaN(val)) {
                            f.percentBoost(parseInt(localStorage.getItem(id)) || 100);
                            return;
                        }
                        localStorage.setItem(id, val)
                    });
                }

                {
                    let id = f.guid + ".existingBuildings";
                    if (localStorage.getItem(id))
                        f.existingBuildings(parseInt(localStorage.getItem(id)));

                    f.existingBuildings.subscribe(val => localStorage.setItem(id, val));
                }
            }
        }
        let products = [];
        for (let product of params.products) {
            if (product.producers && product.producers.length) {
                let p = new Product(product, assetsMap);

                products.push(p);
                assetsMap.set(p.guid, p);

                if (p.factories.length > 1)
                    this.multiFactoryProducts.push(p);

                if (localStorage) {
                    {
                        let id = p.guid + ".percentBoost";
                        if (localStorage.getItem(id)) {
                            let b = parseInt(localStorage.getItem(id))
                            p.factories.forEach(f => f.percentBoost(b));
                            localStorage.removeItem(id);
                        }
                    }


                    {
                        let id = p.guid + ".fixedFactory";
                        if (localStorage.getItem(id))
                            p.fixedFactory(assetsMap.get(parseInt(localStorage.getItem(id))));
                        p.fixedFactory.subscribe(f => f ? localStorage.setItem(id, f.guid) : localStorage.removeItem(id));
                    }
                }

                if (isNew && p.guid == 1010240)
                    p.fixedFactory(assetsMap.get(1010318));
            }
        }

        for (let item of (params.items || [])) {
            let i = new Item(item, assetsMap);
            assetsMap.set(i.guid, i);
            this.items.push(i);

            if (i.replacements)
                this.replaceInputItems.push(i);

            if (i.additionalOutputs)
                this.extraGoodItems.push(i);

            if (localStorage) {
                let oldId = i.guid + ".checked";
                var oldChecked = false;
                if (localStorage.getItem(oldId))
                    oldChecked = parseInt(localStorage.getItem(oldId));

                for (var equip of i.equipments) {
                    let id = `${equip.factory.guid}[${i.guid}].checked`;

                    if (oldChecked)
                        equip.checked(true);

                    if (localStorage.getItem(id))
                        equip.checked(parseInt(localStorage.getItem(id)));

                    equip.checked.subscribe(val => localStorage.setItem(id, val ? 1 : 0));
                }

                localStorage.removeItem(oldId);
            }
        }

        this.extraGoodItems.sort((a, b) => a.name() > b.name());
        view.settings.language.subscribe(() => {
            this.extraGoodItems.sort((a, b) => a.name() > b.name());
        })

        // must be set after items so that extraDemand is correctly handled
        this.consumers.forEach(f => f.referenceProducts(assetsMap));

        // setup demands induced by modules
        for (let factory of params.factories) {
            let f = assetsMap.get(factory.guid);
            if (f.module)
                f.moduleDemand = new Demand({ guid: f.module.getInputs()[0].Product, region: f.region }, assetsMap);
        }



        for (let level of params.populationLevels) {
            let l = new PopulationLevel(level, assetsMap)
            assetsMap.set(l.guid, l);
            this.populationLevels.push(l);

            if (localStorage) {
                {
                    let id = l.guid + ".amount";
                    if (localStorage.getItem(id))
                        l.amount(parseInt(localStorage.getItem(id)));

                    l.amount.subscribe(val => {
                        val = parseInt(val);

                        if (val == null || !isFinite(val) || isNaN(val)) {
                            l.amount(parseInt(localStorage.getItem(id)) || 0);
                            return;
                        }
                        localStorage.setItem(id, val);
                    });
                }
                {
                    let id = l.guid + ".existingBuildings";
                    if (localStorage.getItem(id))
                        l.existingBuildings(parseInt(localStorage.getItem(id)));

                    l.existingBuildings.subscribe(val => localStorage.setItem(id, val))
                }
            } else {
                l.amount.subscribe(val => {
                    if (val == null || !isFinite(val) || isNaN(val)) {
                        l.amount(0);
                        return;
                    }
                });
            }

            for (let n of l.needs) {
                if (localStorage) {
                    {
                        let id = `${l.guid}[${n.guid}].checked`;
                        if (localStorage.getItem(id))
                            n.checked(parseInt(localStorage.getItem(id)))

                        n.checked.subscribe(val => localStorage.setItem(id, val ? 1 : 0));

                    }

                    {
                        let id = `${l.guid}[${n.guid}].percentBoost`;
                        if (localStorage.getItem(id))
                            n.percentBoost(parseInt(localStorage.getItem(id)));

                        n.percentBoost.subscribe(val => {
                            val = parseInt(val);

                            if (val == null || !isFinite(val) || isNaN(val)) {
                                n.percentBoost(parseInt(localStorage.getItem(id)) || 100);
                                return;
                            }
                            localStorage.setItem(id, val);
                        });
                    }

                } else {
                    n.percentBoost.subscribe(val => {
                        if (val == null || !isFinite(val) || isNaN(val)) {
                            n.percentBoost(100);
                            return;
                        }
                    });
                }

            }
        }

        for (var category of params.productFilter) {
            let c = new ProductCategory(category, assetsMap);
            assetsMap.set(c.guid, c);
            this.categories.push(c);
        }

        for (let powerPlant of params.powerPlants) {
            var pl = assetsMap.get(powerPlant.guid);
            this.categories[1].consumers.push(pl);
            var pr = pl.getInputs()[0].product;
            let n = new PowerPlantNeed({ guid: pr.guid, factory: pl, product: pr }, assetsMap);
            pl.existingBuildings.subscribe(() => n.updateAmount());
            n.updateAmount();
        }

        for (let p of this.categories[1].products) {
            if (p)
                for (let b of p.factories) {
                    if (b) {
                        b.editable = true;
                        let n = new BuildingMaterialsNeed({ guid: p.guid, factory: b, product: p }, assetsMap);
                        b.boost.subscribe(() => n.updateAmount());
                        b.existingBuildings.subscribe(() => n.updateAmount());
                        b.amount.subscribe(() => n.updateAmount());
                        if(b.palaceBuff)
                            b.palaceBuffChecked.subscribe(() => n.updateAmount());
                        this.buildingMaterialsNeeds.push(n);

                        if (localStorage) {
                            let oldId = b.guid + ".buildings";
                            let id = b.guid + ".existingBuildings"
                            if (localStorage.getItem(id) || localStorage.getItem(oldId))
                                b.existingBuildings(parseInt(localStorage.getItem(id) || localStorage.getItem(oldId)));

                            b.existingBuildings.subscribe(val => localStorage.setItem(id, val));
                        }

                        n.updateAmount();
                    }
                }
        }

        // negative extra amount must be set after the demands of the population are generated
        // otherwise it would be set to zero
        for (let f of this.factories) {

            if (localStorage) {
                let id = f.guid + ".extraAmount";
                if (localStorage.getItem(id)) {
                    f.extraAmount(parseFloat(localStorage.getItem(id)));
                }

                f.extraAmount.subscribe(val => {
                    val = parseFloat(val);

                    if (val == null || !isFinite(val) || isNaN(val)) {
                        f.extraAmount(parseFloat(localStorage.getItem(id)) || 0);
                        return;
                    }
                    localStorage.setItem(id, val);
                });
            } else {
                f.extraAmount.subscribe(val => {
                    if (val == null || !isFinite(val) || isNaN(val)) {
                        f.extraAmount(0);
                    }
                });
            }
        }

        // force update once all pending notifications are processed
        setTimeout(() => { this.buildingMaterialsNeeds.forEach(b => b.updateAmount()) }, 1000);

        this.assetsMap = assetsMap;
        this.products = products;
    }

    reset() {
        this.assetsMap.forEach(a => {
            if (a instanceof Product)
                a.fixedFactory(null);
            if (a instanceof Consumer)
                a.existingBuildings(0);
            if (a instanceof Factory) {
                if (a.moduleChecked)
                    a.moduleChecked(false);
                a.percentBoost(100);
                a.extraAmount(0);
            }

            if (a instanceof PopulationLevel) {
                a.existingBuildings(0);
                a.amount(0);
            }
            if (a instanceof Item)
                a.checked(false);

            if (a.guid == 1010240)
                a.fixedFactory(this.assetsMap.get(1010318));
        });

        this.populationLevels.forEach(l => l.needs.forEach(n => {
            if (n.checked)
                n.checked(true);
            if (n.percentBoost)
                n.percentBoost(100);
        }));
    }
}

class Consumer extends NamedElement {
    constructor(config, assetsMap) {
        super(config);

        if (config.region)
            this.region = assetsMap.get(config.region);

        this.amount = ko.observable(0);
        this.boost = ko.observable(1);

        this.demands = new Set();
        this.buildings = ko.computed(() => Math.max(0, parseFloat(this.amount())) / this.tpmin);
        this.existingBuildings = ko.observable(0);
        this.items = [];

        this.producedAmount = ko.computed(() => this.amount());

        this.workforceDemand = this.getWorkforceDemand(assetsMap);
        this.existingBuildings.subscribe(val => this.workforceDemand.updateAmount(Math.max(val, this.buildings())));
        this.buildings.subscribe(val => this.workforceDemand.updateAmount(Math.max(val, this.buildings())));
    }

    getInputs() {
        return this.inputs || [];
    }


    referenceProducts(assetsMap) {
        this.getInputs().forEach(i => i.product = assetsMap.get(i.Product));
    }


    getWorkforceDemand(assetsMap) {
        for (let m of this.maintenances || []) {
            let a = assetsMap.get(m.Product);
            if (a instanceof Workforce)
                return new WorkforceDemand($.extend({ factory: this, workforce: a }, m), assetsMap);
        }
        return { updateAmount: () => { } };
    }

    getRegionExtendedName() {
        if (!this.region || !this.product || this.product.factories.length <= 1)
            return this.name;

        return `${this.name()} (${this.region.name()})`;
    }

    getIcon() {
        return this.icon;
    }

    updateAmount() {
        var sum = 0;
        this.demands.forEach(d => {
            var a = d.amount();
            //            if (a <= -EPSILON || a > 0)
            sum += a;
        });

        if (sum < -EPSILON) {
            if (sum < this.extraDemand.amount()) {
                this.extraDemand.updateAmount(0);
                this.amount(0);
            } else {

                this.extraDemand.updateAmount(this.extraDemand.amount() - sum);
            }
        }
        else {
            // for initialization before creation this.extraDemand
            var extraDemand = this.extraDemand ? this.extraDemand.amount() : 0;
            var val = Math.max(0, sum - extraDemand);
            if (val < 1e-16)
                val = 0;
            this.amount(val);
        }

    }


    add(demand) {
        this.demands.add(demand);
        this.updateAmount();
    }

    remove(demand) {
        this.demands.delete(demand);
        this.updateAmount();
    }

}

class Module extends Consumer {
    constructor(config, assetsMap) {
        super(config, assetsMap);
        this.checked = ko.observable(false);
        this.visible = !!config;
    }
}

class PalaceBuff extends NamedElement {
    constructor(config, assetsMap) {
        super(config, assetsMap);
    }


}

class Factory extends Consumer {
    constructor(config, assetsMap) {
        super(config, assetsMap);

        this.extraAmount = ko.observable(0);
        this.extraGoods = ko.observableArray();
        this.extraGoodsNonZero = ko.computed(() => {
            var arr = this.extraGoods().filter(i => i.amount());

            if (arr.length)
                arr.push({
                    amount: this.extraGoodsTotal
                });

            return arr;
        });
        this.extraGoodsTotal = ko.computed(() => {
            var total = 0;
            for (var i of (this.extraGoods() || []))
                total += i.amount();

            return total;
        })

        this.percentBoost = ko.observable(100);
        this.boost = ko.computed(() => parseInt(this.percentBoost()) / 100);

        if (this.module) {
            this.module = assetsMap.get(this.module);
            this.moduleChecked = ko.observable(false);
            this.moduleChecked.subscribe(checked => {
                if (checked)
                    this.percentBoost(parseInt(this.percentBoost()) + this.module.productivityUpgrade);
                else {
                    var val = Math.max(1, parseInt(this.percentBoost()) - this.module.productivityUpgrade);
                    this.percentBoost(val);
                }
            })
            //moduleDemand created in island constructor after referencing products
        }

        if (config.palaceBuff) {
            this.palaceBuff = assetsMap.get(config.palaceBuff);
            this.palaceBuffChecked = ko.observable(false);
        }

        this.producedAmount = ko.computed(() => {
            var amount = Math.max(0, parseFloat(this.amount() + parseFloat(this.extraAmount())));

            var factor = 1;
            if (this.module && this.moduleChecked() && this.module.additionalOutputCycle)
                factor += 1 / this.module.additionalOutputCycle;

            if (this.palaceBuff && this.palaceBuffChecked())
                factor += 1 / this.palaceBuff.additionalOutputCycle;

            return amount / factor;
        });

        this.buildings = ko.computed(() => {
            var buildings = this.producedAmount() / this.tpmin / this.boost();

            if (this.moduleDemand)
                if (this.moduleChecked())
                    this.moduleDemand.updateAmount(Math.max(Math.ceil(buildings), this.existingBuildings()) * this.module.tpmin);
                else
                    this.moduleDemand.updateAmount(0);
            return buildings;
        });

        this.buildings.subscribe(val => this.workforceDemand.updateAmount(Math.max(val, this.buildings())));


    }


    getOutputs() {
        return this.outputs || [];
    }

    referenceProducts(assetsMap) {
        super.referenceProducts(assetsMap);
        this.getOutputs().forEach(i => i.product = assetsMap.get(i.Product));

        this.product = this.getProduct();
        if (!this.icon)
            this.icon = this.product.icon;

        this.extraDemand = new Demand({ guid: this.product.guid }, assetsMap);
        this.extraAmount.subscribe(val => {
            val = parseFloat(val);
            if (!isFinite(val) || val == null) {
                this.extraAmount(0);
                return;
            }

            let amount = parseFloat(this.amount());
            if (val < -Math.ceil(amount * 100) / 100)
                this.extraAmount(- Math.ceil(amount * 100) / 100);
            else
                this.extraDemand.updateAmount(Math.max(val, -amount));
        });
        this.extraDemand.updateAmount(parseFloat(this.extraAmount()));
    }

    getProduct() {
        return this.getOutputs()[0] ? this.getOutputs()[0].product : null;
    }

    getIcon() {
        return this.getProduct() ? this.getProduct().icon : super.getIcon();
    }

    incrementBuildings() {
        if (this.buildings() <= 0 || parseInt(this.percentBoost()) <= 1)
            return;

        var minBuildings = Math.ceil(this.buildings() * parseInt(this.percentBoost()) / (parseInt(this.percentBoost()) - 1));
        let nextBoost = Math.ceil(parseInt(this.percentBoost()) * this.buildings() / minBuildings)
        this.percentBoost(Math.min(nextBoost, parseInt(this.percentBoost()) - 1));
    }

    decrementBuildings() {
        let currentBuildings = Math.ceil(this.buildings() * 100) / 100;
        var nextBuildings = Math.floor(currentBuildings);
        if (nextBuildings <= 0)
            return;

        if (currentBuildings - nextBuildings < 0.01)
            nextBuildings = Math.floor(nextBuildings - 0.01);
        var nextBoost = Math.ceil(100 * this.boost() * this.buildings() / nextBuildings);
        if (nextBoost - parseInt(this.percentBoost()) < 1)
            nextBoost = parseInt(this.percentBoost()) + 1;
        this.percentBoost(nextBoost);
    }

    incrementPercentBoost() {
        this.percentBoost(parseInt(this.percentBoost()) + 1);
    }

    decrementPercentBoost() {
        this.percentBoost(parseInt(this.percentBoost()) - 1);
    }

    updateExtraGoods() {
        this.extraAmount(- this.extraGoodsTotal());
    }
}

class Product extends NamedElement {
    constructor(config, assetsMap) {
        super(config);


        this.amount = ko.observable(0);

        this.factories = this.producers.map(p => assetsMap.get(p));
        this.fixedFactory = ko.observable(null);

        if (this.producers) {
            this.amount = ko.computed(() => this.factories.map(f => f.amount()).reduce((a, b) => a + b));
        }
    }
}

class Demand extends NamedElement {
    constructor(config, assetsMap) {
        super(config);

        this.amount = ko.observable(0);


        this.product = assetsMap.get(this.guid);
        if (!this.product)
            throw `No Product ${this.guid}`;
        this.factory = ko.observable(config.factory);

        if (this.product) {
            this.updateFixedProductFactory(this.product.fixedFactory());
            this.product.fixedFactory.subscribe(f => this.updateFixedProductFactory(f));

            this.inputAmount = ko.computed(() => {
                var amount = parseFloat(this.amount());

                var factor = 1;

                // make sure all observables are called when initializing this variable
                var f = this.factory();
                if (f.module && f.moduleChecked() && f.module.additionalOutputCycle)
                    factor += 1 / f.module.additionalOutputCycle;

                if (f.palaceBuff && f.palaceBuffChecked())
                    factor += 1 / f.palaceBuff.additionalOutputCycle;

                return amount / factor;

            });

            if (this.consumer)
                this.consumer.factory.subscribe(() => this.updateFixedProductFactory(this.product.fixedFactory()));

            if (this.product.differentFactoryInputs) {
                this.demands = [new FactoryDemandSwitch(this, assetsMap)];
                this.inputAmount.subscribe(val => this.demands[0].updateAmount(val));
            }
            else
                this.demands = this.factory().getInputs().map(input => {
                    var d;
                    let items = this.factory().items.filter(item => item.replacements && item.replacements.has(input.Product));
                    if (items.length)
                        d = new ItemDemandSwitch(this, input, items, assetsMap);
                    else
                        d = new Demand({ guid: input.Product, consumer: this }, assetsMap);

                    this.inputAmount.subscribe(val => d.updateAmount(val * input.Amount));

                    return d;
                });


            this.amount.subscribe(val => {
                this.factory().updateAmount();
            });

            this.buildings = ko.computed(() => {
                var factory = this.factory();
                var buildings = Math.max(0, this.inputAmount()) / factory.tpmin / factory.boost();

                return buildings;
            });
        }
    }

    updateFixedProductFactory(f) {
        if (f == null) {
            if (this.consumer || this.region) { // find factory in the same region as consumer
                let region = this.region || this.consumer.factory().region;
                if (region) {
                    for (let fac of this.product.factories) {
                        if (fac.region === region) {
                            f = fac;
                            break;
                        }
                    }
                }
            }
        }

        if (f == null) // region based approach not successful
            f = this.product.factories[0];

        if (f != this.factory()) {
            if (this.factory())
                this.factory().remove(this);

            this.factory(f);
            f.add(this);
        }
    }

    updateAmount(amount) {
        this.amount(amount);
    }
}

class ItemDemandSwitch {
    constructor(consumer, input, items, assetsMap) {
        this.items = items;

        this.demands = [ // use array index to toggle
            new Demand({ guid: input.Product, consumer: consumer }, assetsMap),
            new Demand({ guid: items[0].replacements.get(input.Product), consumer: consumer }, assetsMap)
        ];
        this.amount = 0;

        this.items.forEach(item => item.checked.subscribe(() => this.updateAmount(this.amount)));
    }

    updateAmount(amount) {
        this.amount = amount;
        this.demands.forEach((d, idx) => {
            let checked = this.items.map(item => item.checked()).reduce((a, b) => a || b);
            d.updateAmount(checked == idx ? amount : 0)
        });
    }

}

class FactoryDemandSwitch {
    constructor(consumer, assetsMap) {
        this.consumer = consumer;
        this.factory = this.consumer.factory();

        this.demands = [];
        this.demandsMap = new Map();

        for (var factory of consumer.product.factories) {
            var factoryDemands = [];
            for (var input of factory.getInputs()) {

                var d;
                let items = factory.items.filter(item => item.replacements && item.replacements.has(input.Product));
                if (items.length)
                    d = new ItemDemandSwitch(consumer, input, items, assetsMap);
                else
                    d = new Demand({ guid: input.Product, consumer: consumer }, assetsMap);

                factoryDemands.push(d);
                this.demands.push(d);
            }

            this.demandsMap.set(factory, factoryDemands);

        }

        this.amount = 0;

        consumer.factory.subscribe(factory => this.updateAmount(this.amount));
    }

    updateAmount(amount) {
        this.amount = amount;
        var factory = this.consumer.factory();

        if (factory.module && factory.moduleChecked() && factory.module.additionalOutputCycle)
            amount *= factory.module.additionalOutputCycle / (factory.module.additionalOutputCycle + 1);

        if (factory != this.factory) {
            for (var d of this.demandsMap.get(this.factory)) {
                d.updateAmount(0);
            }
        }

        this.factory = factory;


        for (var d of this.demandsMap.get(factory)) {
            d.updateAmount(amount);
        }

    }

}

class Need extends Demand {
    constructor(config, assetsMap) {
        super(config, assetsMap);
        this.allDemands = [];

        let treeTraversal = node => {
            if (node instanceof Demand)
                this.allDemands.push(node);
            (node.demands || []).forEach(treeTraversal);
        }
        treeTraversal(this);
    }

}

class PopulationNeed extends Need {
    constructor(config, assetsMap) {
        super(config, assetsMap);

        this.residents = 0;

        this.percentBoost = ko.observable(100);
        this.percentBoost.subscribe(val => {
            val = parseInt(val);
            if (val < 1)
                this.percentBoost(1);
        })
        this.boost = ko.computed(() => parseInt(this.percentBoost()) / 100);
        this.boost.subscribe(() => this.updateAmount(this.residents));

        this.checked = ko.observable(true);
        this.banned = ko.computed(() => {
            var checked = this.checked();
            var noOptionalNeeds = view.settings.noOptionalNeeds.checked();
            return !checked || this.happiness && noOptionalNeeds;
        })
        this.optionalAmount = ko.observable(0);

        this.banned.subscribe(banned => {
            if (banned)
                this.amount(0);
            else
                this.amount(this.optionalAmount());
        });
    }

    updateAmount(residents) {
        this.residents = residents;
        this.optionalAmount(this.tpmin * residents * this.boost());
        if (!this.banned())
            this.amount(this.optionalAmount());
    }

    incrementPercentBoost() {
        this.percentBoost(parseInt(this.percentBoost()) + 1);
    }

    decrementPercentBoost() {
        this.percentBoost(parseInt(this.percentBoost()) - 1);
    }
}

class BuildingMaterialsNeed extends Need {
    constructor(config, assetsMap) {
        super(config, assetsMap);

        this.product = config.product;
        this.factory(config.factory);

        this.factory().add(this);
    }

    updateAmount() {
        var otherDemand = 0;
        this.factory().demands.forEach(d => otherDemand += d == this ? 0 : d.amount());

        var existingBuildingsOutput =
            this.factory().existingBuildings() * this.factory().tpmin * this.factory().boost();

        if (this.factory().palaceBuff && this.factory().palaceBuffChecked())
            existingBuildingsOutput *= 1 + 1 / this.factory().palaceBuff.additionalOutputCycle;

        var overProduction = existingBuildingsOutput - otherDemand;
        this.amount(Math.max(0, overProduction));
    }

    updateFixedProductFactory() { }
}

class PowerPlantNeed extends Need {
    constructor(config, assetsMap) {
        super(config, assetsMap);

        this.factory(config.factory);
        this.factory().add(this);
    }

    updateAmount() {
        this.amount(this.factory().existingBuildings() * this.factory().tpmin);
    }

    updateFixedProductFactory() { }
}

class PopulationLevel extends NamedElement {
    constructor(config, assetsMap) {
        super(config);

        this.hotkey = ko.observable(null);
        this.amount = ko.observable(0);
        this.existingBuildings = ko.observable(0);
        this.noOptionalNeeds = ko.observable(false);
        this.needs = [];

        config.needs.forEach(n => {
            if (n.tpmin > 0 && assetsMap.get(n.guid))
                this.needs.push(new PopulationNeed(n, assetsMap));
        });
        this.amount.subscribe(val => {
            if (val < 0)
                this.amount(0);
            else if (!view.settings.existingBuildingsInput.checked())
                this.needs.forEach(n => n.updateAmount(parseInt(val)))
        });
        this.existingBuildings.subscribe(val => {
            val = parseInt(val);
            this.existingBuildings(val);
            if (view.settings.existingBuildingsInput.checked())
                this.needs.forEach(n => n.updateAmount(parseInt(val * config.fullHouse)))
        })
        view.settings.existingBuildingsInput.checked.subscribe(enabled => {
            if (enabled)
                this.existingBuildings(Math.max(this.existingBuildings(), Math.ceil(parseInt(this.amount()) / config.fullHouse)))
            else
                this.amount(Math.max(this.amount(), parseInt(this.existingBuildings()) / (config.fullHouse - 10)));
        })
    }

    incrementAmount() {
        this.amount(parseFloat(this.amount()) + 1);
    }

    decrementAmount() {
        this.amount(parseFloat(this.amount()) - 1);
    }
}

class ProductCategory extends NamedElement {
    constructor(config, assetsMap) {
        super(config);
        this.products = config.products.map(p => assetsMap.get(p)).filter(p => p != null);
        this.consumers = [];
    }
}

class Workforce extends NamedElement {
    constructor(config, assetsMap) {
        super(config);
        this.amount = ko.observable(0);
        this.demands = [];
    }

    updateAmount() {
        var sum = 0;
        this.demands.forEach(d => sum += d.amount());
        this.amount(sum);
    }

    add(demand) {
        this.demands.push(demand);
    }
}

class WorkforceDemand extends NamedElement {
    constructor(config, assetsMap) {
        super(config);
        this.amount = ko.observable(0);
        this.workforce.add(this);
        this.amount.subscribe(val => this.workforce.updateAmount());
    }

    updateAmount(buildings) {
        this.amount(Math.ceil(buildings) * this.Amount);
    }
}

class Item extends NamedElement {
    constructor(config, assetsMap) {
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

        if (this.additionalOutputs) {
            this.extraGoods = this.additionalOutputs.map(p => assetsMap.get(p.Product));
        }

        this.factories = this.factories.map(f => assetsMap.get(f));
        this.equipments = this.factories.map(f => new EquippedItem({ item: this, factory: f, locaText: this.locaText }, assetsMap))
    }
}

class EquippedItem extends Option {
    constructor(config, assetsMap) {
        super(config);

        this.replacements = config.item.replacements;
        this.replacementArray = config.item.replacementArray;

        if (config.item.additionalOutputs) {
            this.extraGoods = config.item.additionalOutputs.map(cfg => {
                var config = $.extend(true, {}, cfg, { item: this, factory: this.factory });
                return new ExtraGoodProduction(config, assetsMap);
            })
        }

        this.factory.items.push(this);
    }
}

class ExtraGoodProduction {
    constructor(config, assetsMap) {
        this.item = config.item;
        this.factory = config.factory;

        this.product = assetsMap.get(config.Product);
        this.additionalOutputCycle = config.AdditionalOutputCycle;

        this.amount = ko.computed(() => !!this.item.checked() * config.Amount * this.factory.producedAmount() / this.additionalOutputCycle);

        for (var f of this.product.factories) {
            f.extraGoods.push(this);
        }
    }
}


class PopulationReader {

    constructor() {
        this.url = 'http://localhost:8000/AnnoServer/Population';
        this.notificationShown = false;
        this.currentVersion;
        this.recentVersion;

        // only ping the server when the website is run locally
        if (isLocal()) {
            console.log('waiting for responses from ' + this.url);
            this.requestInterval = setInterval(this.handleResponse.bind(this), 1000);

            $.getJSON("https://api.github.com/repos/NiHoel/Anno1800UXEnhancer/releases/latest").done((release) => {
                this.recentVersion = release.tag_name;
                this.checkVersion();
            });
        }
    }

    async handleResponse() {
        var url_with_params = this.url + "?" +
            jQuery.param({
                lang: view.settings.language(),
                //                optimalProductivity: view.settings.optimalProductivity.checked()
            });
        const response = await fetch(url_with_params);
        const json = await response.json(); //extract JSON from the http response

        if (!json)
            return;

        if (json.version) {
            this.currentVersion = json.version;
            this.checkVersion();
        }


        if (!json.version || json.version.startsWith("v1")) {
            view.island().populationLevels.forEach(function (element) {
                element.amount(0);
            });
            if (json.farmers) {
                view.island().populationLevels[0].amount(json.farmers);
            }
            if (json.workers) {
                view.island().populationLevels[1].amount(json.workers);
            }
            if (json.artisans) {
                view.island().populationLevels[2].amount(json.artisans);
            }
            if (json.engineers) {
                view.island().populationLevels[3].amount(json.engineers);
            }
            if (json.investors) {
                view.island().populationLevels[4].amount(json.investors);
            }
            if (json.jornaleros) {
                view.island().populationLevels[5].amount(json.jornaleros);
            }
            if (json.obreros) {
                view.island().populationLevels[6].amount(json.obreros);
            }
        } else {

            var island = null;
            if (json.islandName) {
                var best_match = 0;

                for (var isl of view.islands()) {
                    if (json.islandName == ALL_ISLANDS && isl.isAllIslands()) {
                        island = isl;
                        break;
                    }

                    var match = this.lcs_length(isl.name(), json.islandName) / Math.max(isl.name().length, json.islandName.length);
                    if (match > 0.66 && match > best_match) {
                        island = isl;
                        best_match = match;
                    }
                }
            }

            if (!island)
                return;

            if (view.settings.updateSelectedIslandOnly.checked() && island != view.island())
                return;


            for (let key in json) {
                let asset = island.assetsMap.get(parseInt(key));
                if (asset instanceof PopulationLevel) {
                    if (json[key].amount && view.settings.populationLevelAmount.checked()) {
                        asset.amount(json[key].amount);
                    }
                    if (json[key].existingBuildings && view.settings.populationLevelExistingBuildings.checked()) {
                        view.settings.existingBuildingsInput.checked(true);
                        asset.existingBuildings(json[key].existingBuildings);
                    }
                }
                else if (asset instanceof Consumer) {
                    if (json[key].existingBuildings && view.settings.factoryExistingBuildings.checked())
                        asset.existingBuildings(parseInt(json[key].existingBuildings));
                    if (json[key].percentBoost && view.settings.factoryPercentBoost.checked())
                        asset.percentBoost(parseInt(json[key].percentBoost));
                }
            }
        }
    }

    checkVersion() {
        if (!this.notificationShown && this.recentVersion && this.currentVersion && this.recentVersion !== this.currentVersion) {
            this.notificationShown = true;
            $.notify({
                // options
                message: view.texts.serverUpdate.name()
            }, {
                // settings
                type: 'warning',
                placement: { align: 'center' }
            });
        }
    }

    // Function to find length of Longest Common Subsequence of substring
    // X[0..m-1] and Y[0..n-1]
    // From https://www.techiedelight.com/longest-common-subsequence/
    lcs_length(X, Y) {
        var m = X.length, n = Y.length;

        // lookup table stores solution to already computed sub-problems
        // i.e. lookup[i][j] stores the length of LCS of substring
        // X[0..i-1] and Y[0..j-1]
        var lookup = [];
        for (var i = 0; i <= m; i++)
            lookup.push(new Array(n + 1).fill(0));

        // fill the lookup table in bottom-up manner
        for (var i = 1; i <= m; i++) {
            for (var j = 1; j <= n; j++) {
                // if current character of X and Y matches
                if (X[i - 1] == Y[j - 1])
                    lookup[i][j] = lookup[i - 1][j - 1] + 1;

                // else if current character of X and Y don't match
                else
                    lookup[i][j] = Math.max(lookup[i - 1][j], lookup[i][j - 1]);
            }
        }

        // LCS will be last entry in the lookup table
        return lookup[m][n];
    }
}

class IslandManager {
    constructor(params) {
        let islandKey = "islandName";
        let islandsKey = "islandNames";

        this.islandNameInput = ko.observable();
        this.params = params;


        var islandNames = [];
        if (localStorage && localStorage.getItem(islandsKey))
            islandNames = JSON.parse(localStorage.getItem(islandsKey))

        var islandName = localStorage.getItem(islandKey);
        view.islands = ko.observableArray();
        view.island = ko.observable();

        view.island.subscribe(isl => window.document.title = isl.name());

        for (var name of islandNames) {
            var island = new Island(params, new Storage(name));
            view.islands.push(island);

            if (name == islandName)
                view.island(island);
        }

        var allIslands = new Island(params, localStorage);
        view.islands.unshift(allIslands);
        if (!view.island())
            view.island(allIslands);



        if (localStorage) {
            view.islands.subscribe(islands => {
                let islandNames = JSON.stringify(islands.filter(i => !i.isAllIslands()).map(i => i.name()));
                localStorage.setItem(islandsKey, islandNames);
            });

            view.island.subscribe(island => {
                localStorage.setItem(islandKey, island.name())
            });

        }

        this.islandExists = ko.computed(() => {
            var name = this.islandNameInput();
            if (!name || name == ALL_ISLANDS || name == view.texts.allIslands.name())
                return true;

            for (var island of view.islands()) {
                if (island.name() == name)
                    return true;
            }

            return false;
        });
    }

    create() {
        if (this.islandExists())
            return;

        var island = new Island(this.params, new Storage(this.islandNameInput()));
        view.islands.push(island);
        view.island(island);
        this.islandNameInput(null);
    }

    delete() {
        if (view.island().name() == ALL_ISLANDS || view.island().isAllIslands())
            return;

        var island = view.island();
        view.island(view.islands()[0]);
        view.islands.remove(island);
        if (localStorage)
            localStorage.removeItem(island.name());
    }
}

function init() {

    view.settings.options = [];
    for (let attr in options) {
        let o = new Option(options[attr]);
        o.id = attr;
        view.settings[attr] = o;
        view.settings.options.push(o);

        if (localStorage) {
            let id = "settings." + attr;
            if (localStorage.getItem(id) != null)
                o.checked(parseInt(localStorage.getItem(id)));

            o.checked.subscribe(val => localStorage.setItem(id, val ? 1 : 0));
        }
    }

    view.settings.languages = params.languages;

    view.settings.serverOptions = [];
    for (let attr in serverOptions) {
        let o = new Option(serverOptions[attr]);
        o.id = attr;
        if (attr != "optimalProductivity")
            o.checked(true);
        view.settings[attr] = o;
        view.settings.serverOptions.push(o);

        if (localStorage) {
            let id = "serverSettings." + attr;
            if (localStorage.getItem(id) != null)
                o.checked(parseInt(localStorage.getItem(id)));

            o.checked.subscribe(val => localStorage.setItem(id, val ? 1 : 0));
        }
    }


    view.islandManager = new IslandManager(params);

    if (localStorage) {
        let id = "language";
        if (localStorage.getItem(id))
            view.settings.language(localStorage.getItem(id));

        view.settings.language.subscribe(val => localStorage.setItem(id, val));
    }

    view.selectedFactory = ko.observable(view.island().factories[0]);

    ko.applyBindings(view, $(document.body)[0]);

    view.island().name.subscribe(val => { window.document.title = val; });

 

    var keyBindings = ko.computed(() => {
        var bindings = new Map();

        var language = view.settings.language();
        if (language == 'chinese' || language == 'korean' || language == 'japanese' || language == 'taiwanese') {
            language = 'english';
        }

        for (var l of view.island().populationLevels) {
            var name = l.locaText[language];

            for (var c of name.toLowerCase()) {
                if (!bindings.has(c)) {
                    bindings.set(c, $(`.ui-race-unit-name[race-unit-guid=${l.guid}] ~ .input .input-group input`));
                    l.hotkey(c);
                    break;
                }
            }
        }

        return bindings;
    })

    $(document).on("keydown", (evt) => {
        if (evt.altKey || evt.ctrlKey || evt.shiftKey)
            return true;

        if (evt.target.tagName === 'INPUT' && evt.target.type === "text")
            return true;

        var focused = false;
        var bindings = keyBindings();
        if (bindings.has(evt.key)) {
            focused = true;
            bindings.get(evt.key).focus().select();
        }

        if (evt.target.tagName === 'INPUT' && !isNaN(parseInt(evt.key)) || focused) {
            let isDigit = evt.key >= "0" && evt.key <= "9";
            return ['ArrowUp', 'ArrowDown', 'Backspace', 'Delete'].includes(evt.key) || isDigit || evt.key === "." || evt.key === ",";
        }
    });


    // listen for the server providing the population count
    window.reader = new PopulationReader();
}

function removeSpaces(string) {
    if (typeof string === "function")
        string = string();
    return string.replace(/\W/g, "");
}

function isLocal() {
    return window.location.protocol == 'file:' || /localhost|127\.0\.0\.1/.test(window.location.host.replace);
}

function exportConfig() {
    var saveData = (function () {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function (data, fileName) {
            var blob = new Blob([JSON.stringify(data, null, 4)], { type: "text/json" }),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());

    saveData(localStorage, ("Anno1800CalculatorConfig") + ".json");
}

function checkAndShowNotifications() {
    $.getJSON("https://api.github.com/repos/NiHoel/Anno1800Calculator/releases/latest").done((release) => {
        $('#download-calculator-button').attr("href", release.zipball_url);

        if (isLocal()) {
            if (release.tag_name !== versionCalculator) {
                $.notify({
                    // options
                    message: view.texts.calculatorUpdate.name()
                }, {
                    // settings
                    type: 'warning',
                    placement: { align: 'center' }
                });
            }
        }

        if (localStorage) {
            if (localStorage.getItem("versionCalculator") != versionCalculator) {
                if (view.texts.newFeature.name() && view.texts.newFeature.name().length)
                    $.notify({
                        // options
                        message: view.texts.newFeature.name()
                    }, {
                        // settings
                        type: 'success',
                        placement: { align: 'center' },
                        timer: 10000
                    });
            }

            localStorage.setItem("versionCalculator", versionCalculator);
        }

    });
}

function installImportConfigListener() {
    if (localStorage) {
        $('#config-selector').on('change', event => {
            event.preventDefault();
            if (!event.target.files || !event.target.files[0])
                return;

            let file = event.target.files[0];
            console.log(file);
            var fileReader = new FileReader();

            fileReader.onload = function (ev) {
                let text = ev.target.result || ev.currentTarget.result;

                try {
                    let config = JSON.parse(text);

                    if (localStorage) {

                        if (config.islandName && config.islandName != "Anno 1800 Calculator" &&
                            !config.islandNames && !config[config.islandName]) {
                            // import old, one island save
                            delete config.versionCalculator;
                            delete config.versionServer;

                            view.islandManager.islandNameInput(config.islandName);
                            view.islandManager.create();
                            var island = view.islands().filter(i => i.name() == config.islandName)[0];
                            island.storage.json = config;
                            island.storage.save();
                            localStorage.setItem("islandName", config.islandName);
                        } else {
                            localStorage.clear();
                            for (var a in config)
                                localStorage.setItem(a, config[a]);
                            localStorage.setItem("versionCalculator", versionCalculator);

                            if (!config.islandNames) { // old save, restore islands
                                for (var island of view.islands()) {
                                    if (!island.isAllIslands())
                                        island.storage.save();
                                }
                                let islandNames = JSON.stringify(view.islands().filter(i => !i.isAllIslands()).map(i => i.name()));
                                localStorage.setItem("islandNames", islandNames);
                            }
                        }
                        location.reload();

                    } else {
                        console.error("No local storage accessible to write result into.");
                    }

                } catch (e) {
                    console.error(e);
                }
            };
            fileReader.onerror = function (err) {
                console.error(err);
            };

            fileReader.readAsText(file);
        });
    }
}

$(document).ready(function () {
    // parse the parameters
    for (let attr in texts) {
        view.texts[attr] = new NamedElement({ name: attr, locaText: texts[attr] });
    }

    // check version of calculator - display update and new featur notification
    checkAndShowNotifications();

    //update links of download buttons
    $.getJSON("https://api.github.com/repos/NiHoel/Anno1800UXEnhancer/releases/latest").done((release) => {
        $('#download-calculator-server-button').attr("href", release.assets[0].browser_download_url);
    });

    installImportConfigListener();


    //load parameters
    if (window.params == null)
        $('#params-dialog').modal("show");
    else
        init();

    $('#params-dialog').on('hide.bs.modal', () => {
        try {
            window.params = JSON.parse($('textarea#input-params').val());
            init();
        } catch (e) {
            console.log(e);
            $('#params-dialog').modal("show");
        }
    });

    $('[data-toggle="popover"]').popover(); 
})

texts = {
    allIslands: {
        "french": "Toutes les îles",
        "english": "All Islands",
        "italian": "Tutte le isole",
        "chinese": "所有岛屿",
        "spanish": "Todas las islas",
        "japanese": "すべての島",
        "taiwanese": "所有島嶼",
        "polish": "Wszystkie wyspy",
        "german": "Alle Inseln",
        "korean": "모든 섬",
        "russian": "Все острова"
    },
    residents: {
        "french": "Résidents",
        "english": "Residents",
        "italian": "Residenti",
        "chinese": "居民",
        "spanish": "Residentes",
        "japanese": "住民",
        "taiwanese": "居民",
        "polish": "Mieszkańcy",
        "german": "Einwohner",
        "korean": "주민",
        "russian": "Жители"
    },
    workforce: {
        english: "Required Workforce",
        german: "Benötigte Arbeitskraft",
        korean: "필요한 인력"
    },
    productionBoost: {
        "french": "Productivité",
        "brazilian": "Production",
        "english": "Productivity",
        "portuguese": "Production",
        "italian": "Produzione",
        "chinese": "生产力",
        "spanish": "Productividad",
        "japanese": "生産性",
        "taiwanese": "生產力",
        "polish": "Wydajność",
        "german": "Produktivität",
        "korean": "생산성",
        "russian": "Производительность"
    },
    reset: {
        "english": "Reset",
        "french": "Réinitialiser",
        "german": "Zurücksetzen",
        "korean": "재설정",
        "portuguese": "Reset",
        "brazilian": "Reset",
        "taiwanese": "重設",
        "chinese": "重设",
        "spanish": "Reiniciar",
        "italian": "Azzera",
        "russian": "Сбросить",
        "polish": "Wyzeruj",
        "japanese": "リセット"
    },
    itemsEquipped: {
        "english": "Items Equipped",
        "chinese": "已装备物品",
        "taiwanese": "已裝備物品",
        "italian": "Oggetti in uso",
        "spanish": "Objetos equipados",
        "german": "Ausgerüstete Items",
        "polish": "Przedmioty w użyciu",
        "french": "Objets en stock",
        "korean": "배치한 아이템",
        "japanese": "装備したアイテム",
        "russian": "Используемые предметы"
    },
    productionBuildings: {
        "english": "Production Buildings",
        "chinese": "生产建筑",
        "taiwanese": "生產建築",
        "italian": "Edifici produttivi",
        "spanish": "Edificios de producción",
        "german": "Produktionsgebäude",
        "polish": "Budynki produkcyjne",
        "french": "Bâtiments de production",
        "korean": "생산 건물",
        "japanese": "生産施設",
        "russian": "Производственные здания"
    },
    extraGoods: {
        "english": "Extra Goods",
        "chinese": "额外货物",
        "taiwanese": "額外貨物",
        "italian": "Merci aggiuntive",
        "spanish": "Bienes extra",
        "german": "Zusatzwaren",
        "polish": "Dodatkowe towary",
        "french": "Marchandises supplémentaires",
        "korean": "추가 물품",
        "japanese": "追加品物",
        "russian": "Дополнительные товары"
    },
    total: {
        "english": "Total",
        "chinese": "总计",
        "taiwanese": "總計",
        "italian": "Totale",
        "spanish": "Total",
        "german": "Gesamt",
        "polish": "Razem",
        "french": "Total",
        "korean": "합계",
        "japanese": "合計",
        "russian": "Всего"
    },
    requiredNumberOfBuildings: {
        english: "Required Number of Buildings",
        german: "Benötigte Anzahl an Gebäuden",
        korean: "필요한 건물 수"
    },
    existingNumberOfBuildings: {
        english: "Existing Number of Buildings",
        german: "Vorhandene Anzahl an Gebäuden",
        korean: "현재 건물 수"
    },
    existingNumberOfBuildingsIs: {
        english: "Is:",
        german: "Ist:",
        korean: "현재:"
    },
    requiredNumberOfBuildings: {
        english: "Required:",
        german: "Benötigt:",
        korean: "필요:"
    },
    requiredNumberOfBuildingsDescription: {
        english: "Required number of buildings to produce consumer products",
        german: "Benötigte Gebäudeanzahl zur Produktion von Verbrauchsgütern",
        korean: "소비재 생산에 필요한 건물 수"
    },
    tonsPerMinute: {
        english: "Production in Tons per Minute",
        german: "Produktion in Tonnen pro Minute",
        korean: "분당 생산량"
    },
    producedAmount: {
        english: "Plain building output after taking extra goods into account",
        german: "Reiner Gebäudeoutput nach Berücksichtigung von Zusatzwaren",
        korean: "분당 생산량"
    },
    language: {
        english: "Language",
        german: "Sprache",
        korean: "언어"
    },
    islandName: {
        english: "New island name",
        german: "Neuer Inselname",
        korean: "새로운 섬 이름"
    },
    selectedIsland: {
        english: "Selected Island",
        german: "Ausgewählte Insel",
        korean: "선택된 섬"
    },
    settings: {
        english: "Settings",
        german: "Einstellungen",
        korean: "설정"
    },
    help: {
        english: "Help",
        german: "Hilfe",
        korean: "도움말"
    },
    chooseFactories: {
        english: "Modify Production Chains",
        german: "Modifiziere Produktionsketten",
        korean: "생산 체인 수정"
    },
    noFixedFactory: {
        english: "Automatic: same region as consumer",
        german: "Automatisch: gleichen Region wie Verbraucher",
        korean: "자동 : 소비자와 동일한 지역"
    },
    consumptionModifier: {
        english: "Modify the percental amount of consumption for this tier and product",
        german: "Verändere die prozentuale Verbrauchsmenge für diese Ware und Bevölkerungsstufe",
        korean: "이 계층 및 제품의 사용량(백분율)을 수정하십시요"
    },
    download: {
        english: "Downloads",
        german: "Downloads",
        korean: "다운로드"
    },
    downloadConfig: {
        english: "Import / Export configuration.",
        german: "Konfiguration importieren / exportieren.",
        korean: "설정 가져오기 / 내보내기"
    },
    downloadCalculator: {
        english: "Download the calculator (source code of this website) to run it locally. To do so, extract the archive and double click index.html.",
        german: "Lade den Warenrechner (Quellcode dieser Seite) herunter, um ihn lokal auszuführen. Zum Ausführen, extrahiere das Archiv und doppelklicke auf index.html.",
        korean: "Anno 계산기 (이 웹 사이트의 소스 코드)를 다운로드 하여 로컬로 실행 하십시오. 압축을 풀고 index.html 실행 하십시오."
    },
    downloadCalculatorServer: {
        english: `Download a standalone executable that reads the current population count while playing the game. Usage:
1. Download server application and calculator (using the source code from above).
2. Start Anno 1800.
3. Start server (Server.exe) and open downloaded calculator (index.html).
4. Expand the population statistics (global or island) or open the statistics screen (finance, production, population) to update the values in the calculator.

 See the following link for more information: `,
        german: `Lade eine ausführbare Datei herunter, die beim Spielen die aktuellen Bevölkerungszahlen erfasst. Verwendung:
1. Lade die Serveranwendung und den Warenrechner (siehe obiger Quellcode) herunter.
2. Starte Anno 1800.
3. Führe den Server (Server.exe) aus und öffne den heruntergeladenen Warenrechner (index.html).
4. Klappe die Bevölkerungsstatistiken (global oder inselweit) aus oder öffne das Statistikmenü (Finanzen, Produktion, Bevölkerung), um die Werte im Warenrechner zu aktualisieren.

Siehe folgenden Link für weitere Informationen: `,
        korean: `게임을 하는 동안 현재 인구 수를 읽는 실행 파일을 다운로드 하십시오. 방법:
1. 서버 프로그램 및 계산기를 다운로드 하십시오. (위의 소스 코드 사용).
2. Anno 1800을 실행 하십시오.
3. 서버 (Server.exe)를 실행하고 다운로드한 Anno1800 계산기 (index.html)를 엽니다.
4. 인구 통계 (모든 섬 또는 일부 섬)를 펼쳐서 열거나 통계 화면 (금융, 생산, 인구)을 열어 계산기의 값을 업데이트하십시오.
  자세한 내용은 다음 링크를 참조하십시오: `
    },
    serverUpdate: {
        english: "A new server version is available. Click the download button.",
        german: "Eine neue Serverversion ist verfügbar. Klicke auf den Downloadbutton.",
        korean: "새로운 서버 버전을 사용할 수 있습니다. 다운로드 버튼을 클릭하십시오."
    },
    calculatorUpdate: {
        english: "A new calculator version is available. Click the download button.",
        german: "Eine neue Version des Warenrechners ist verfügbar. Klicke auf den Downloadbutton.",
        korean: "새로운 Anno1800 계산기 버전이 제공됩니다. 다운로드 버튼을 클릭하십시오."
    },
    newFeature: {
        english: "Game Update 9 - Land of Lions",
        german: "Game Update 9 - Land der Löwen",
        korean: "게임 업데이트 9 - 사자의 땅"
    },
    helpContent: {
        german:
            `Verwendung: Trage die aktuellen oder angestrebten Einwohner pro Stufe in die oberste Reihe ein. Die Produktionsketten aktualisieren sich automatisch sobald man die Eingabe verlässt. Es werden nur diejenigen Fabriken angezeigt, die benötigt werden.

Der Buchstabe in eckigen Klammern vor dem Bevölkerungsnamen ist der Hotkey zum Fokussieren des Eingabefeldes. Die Anzahl dort kann ebenfalls durch Drücken der Pfeiltasten erhöht und verringert werden.

In der darunterliegenden Reihe wird die Arbeitskraft angezeigt, die benötigt wird, um alle Gebäude zu betreiben (jeweils auf die nächste ganze Fabrik gerundet).

Danach folgen zwei große Abschnitte, die sich wiederum in Unterabschnitte unterteilen. Der erste gibt einen Überblick über alle benötigten Gebäude, sortiert nach dem produzierten Warentyp. Der zweite schlüsselt die einzelnen Produktionsketten nach Bevölkerungsstufen auf. Jeder der Abschnitte kann durch einen Klick auf die Überschrift zusammengeklappt werden. Durch das Abwählen des Kontrollkästchens wird das entsprechende Bedürfnis von der Berechnung ausgenommen.

In jeder Kachel wird der Name der Fabrik, das Icon der hergestellten Ware, der Boost für den Gebäudetyp, die Anzahl der benötigten Gebäude und die Produktionsrate in Tonnen pro Minute angezeigt. Die Anzahl der Gebäude wird mit zwei Nachkommastellen angezeigt, um die Höhe der Überkapazitäten direkt ablesen zu können. Daneben befinden sich zwei Buttons. Diese versuchen den Boost so einzustellen, dass alle Gebäude des Typs bestmöglich ausgelastet sind und dabei ein Gebäude mehr (+) bzw. eines weniger (-) benötigt wird.

Da Baumaterialien sich Zwischenmaterialien mit Konsumgütern teilen sind sie (im Gegensatz zu Warenrechnern früherer Annos) mit aufgeführt, um so den Verbrauch von Minen besser planen zu können. Es muss die Anzahl der Endbetriebe per Hand eingegeben werden.

Über das Zahnrad am rechten oberen Bildschirmrand gelangt man zu den Einstellungen. Dort können die Sprache ausgewählt und die Menge der dargestellten Informationen angepasst werden.

Über die drei Zahnräder neben dem Einstellungsdialog öffnet sich der Dialog zur Modifikation der Produktionsketten. In der oberen Hälfte kann die Fabrik ausgewählt werden, die die dargestellte Ware herstellen soll. In der unter Hälfte können Spezialisten aktiviert werden, welche die Eingangswaren der Fabriken verändern. Standardmäßig ist die Gleiche-Region-Regel eingestellt. Exemplarisch besagt diese, dass das Holz für die Destillerien in der Neuen Welt, das Holz für Nähmaschinen aber in der Alten Welt produziert wird.

Über den Downloadbutton kann dieser Rechner sowie eine zusätzliche Serveranwendung heruntergeladen werden. Mit der Serveranwendung lassen sich die Bevölkerungszahlen, Produktivitäten sowie Fabrikanzahl automatisch aus dem Statisitkmenü des Spiels auslesen. Ich danke meinem Kollegen Josua Bloeß für die Umsetzung.

Haftungsausschluss:
Der Warenrechner wird ohne irgendeine Gewährleistung zur Verfügung gestellt. Die Arbeit wurde in KEINER Weise von Ubisoft Blue Byte unterstützt. Alle Assets aus dem Spiel Anno 1800 sind © by Ubisoft.
Dies sind insbesondere, aber nicht ausschließlich alle Icons der Bevölkerung, Waren und Gegenstände sowie die Daten der Produktionsketten und die Verbrachswerte der Bevölkerung.

Diese Software steht unter der MIT-Lizenz.


Autor:
Nico Höllerich

Fehler und Verbesserungen:
Falls Sie auf Fehler oder Unannehmlichkeiten stoßen oder Verbesserungen vorschlagen möchten, erstellen Sie ein Issue auf GitHub (https://github.com/NiHoel/Anno1800Calculator/issues)`,

        english:
            `Usage: Enter the current or desired number of residents per level into the top most row. The production chains will update automatically when one leaves the input field. Only the required factories are displayed.

The letter in square brackets before the resident's name is the hotkey to focus the input field. There, one can use the arrow keys to inc-/decrement the number.

The row below displays the workforce that is required to run all buildings (rounded towards the next complete factory).

Afterwards two big sections follow that are subdivided into smaller sections. The first one gives an overview of the required buildings sorted by the type of good that is produced. The second one lists the individual production chains for each population level. Clicking the heading collapses each section. Deselecting the checkbox leads to the need being excluded from the calculation.

Each card displays the name of the factory, the icon of the produced good, the boost for the given type of building, the number of required buildings, and the production rate in tons per minute. The number of buildings has two decimal places to directly show the amount of overcapacities. There are two buttons next to it. Those try to adjust the boost such that all buildings operate at full capacity and one more (+) or one building less (-) is required.

Since construction materials share intermediate products with consumables they are explicitly listed (unlike in calculators for previous Annos) to better plan the production of mines. The number of factories must be entered manually.

When clicking on the cog wheel in the upper right corner of the screen the settings dialog opens. There, one can chose the language, give the browser tab a name and customize the information presented by the calculator.

The three cog wheels next to the settings dialog open a dialog to modify the production chains. In the upper part, the factory can be chosen to produce the noted product. In the lower part, specialists that change the input for factories can be applied. By default, the same region policy is selected. By example, this means that the wood for desitilleries is produced in the New World while the wood for sewing machines is produced in the Old World.

Pressing the download button one can download the configuration, this calculator and an additional server application. The server application automatically reads the population, productivity and factory count from the statistics menu in the game. I thank my colleague Josua Bloeß for the implementation.

Disclaimer:
The calculator is provided without warranty of any kind. The work was NOT endorsed by Ubisoft Blue Byte in any kind. All the assets from Anno 1800 game are © by Ubsioft.
These are especially but not exclusively all the icons of population, goods and items and the data of production chains and the consumptions values of population.

This software is under the MIT license.


Author:
Nico Höllerich

Bugs and improvements:
If you encounter any bugs or inconveniences or if you want to suggest improvements, create an Issue on GitHub (https://github.com/NiHoel/Anno1800Calculator/issues)`,

        korean:
            `사용법 : 레벨 당 현재 또는 원하는 주민 수를 최상위 행에 입력하십시오. 
주민 이름 앞에 사각 괄호 안에 있는 알파벳은 입력필드 단축키 입니다. 그곳에 화살표 키를 사용해서 인구를 줄이거나 높일 수 있습니다.

생산 체인은 입력 필드를 벗어나면 자동으로 업데이트됩니다. 필요한 건물만 표시됩니다.
아래 행에는 모든 건물을 운영하는 데 필요한 인력이 표시됩니다 (다음 완전한 공장으로 반올림).
그 후 두 개의 큰 섹션이 이어지고 더 작은 섹션으로 세분됩니다. 첫 번째는 필요한 건물의 유형을 생산 된 제품 유형별로 정렬하여 보여줍니다. 
두 번째는 각 인구 수준에 대한 개별 생산 체인을 나열합니다. 제목을 클릭하면 각 섹션이 축소됩니다. 네모 확인란을 선택 취소하면 계산에서 제외됩니다. 
각 카드에는 건물 이름, 생산 된 제품의 아이콘, 건물 유형에 대한 생산성, 필요한 건물 수 및 분당 생산률이 표시됩니다. 
건물 수에는 과잉 용량을 직접 표시하기 위해 소수점 이하 두 자리로 표시되어 있습니다. 그리고 우측에 두 개의 버튼이 있습니다. 모든 건물이 최대 용량으로 작동하고 한 개 이상 (+) 또는 한 개 미만 (-)이 필요하도록 생산성 조정을 시도합니다.
건설재는 소모품과 중간 제품을 공유하므로 광산 생산 계획을 개선하기 위해 명시 적으로 표시됩니다. 팩토리 수는 수동으로 입력해야합니다.

화면 오른쪽 상단에있는 톱니 바퀴를 클릭하면 설정 대화 상자가 열립니다. 거기에서 언어를 선택하고 브라우저 탭에 이름을 지정하고 Anno1800 계산기가 제공하는 정보를 사용자 정의 할 수 있습니다.
설정 대화 상자 옆에있는 3 개의 톱니 바퀴는 생산 체인을 수정하는 대화 상자를 엽니다. 상단에는 제품을 생산하기 생산건물의 지역을 선택할 수 있습니다. 하단에는 생산건물의 생산성을 변경하는 전문가를 적용할 수 있습니다. 
기본값은 소비자와 동일한 지역 정책이 선택됩니다. 예를 들어, 이는 데시 빌리 용 목재가 신세계에서 생산되고 재봉틀 용 목재는 구세계에서 생산됨을 의미합니다.

다운로드 버튼을 누르면 설정,Anno1800 계산기 및 추가 서버 프로그램을 다운로드 할 수 있습니다. 
서버 프로그램은 게임의 통계 메뉴에서 인구, 생산 및 재정-생산 건물을 자동으로 가져옵니다. 구현에 도움을 준 동료 Josua Bloeß에게 감사드립니다.

추신:
Anno1800 계산기는 어떠한 종류의 보증도 제공되지 않습니다. 이 프로그램은 Ubisoft Blue Byte가 어떤 종류의 보증도 하지 않았습니다. Anno 1800 게임의 모든 것은 Ubsioft의 자산 입니다.
특히 인구, 상품 및 품목의 아이콘과 생산 체인 데이터 및 인구의 소비 가치를 모두 포함하는 것은 아닙니다.
이 소프트웨어는 MIT 에게 라이센스가 있습니다.

개발자:
Nico Höllerich
버그 및 개선 사항 :
버그 나 불편한 점이 있거나 개선을 제안하려면 GitHub (https://github.com/NiHoel/Anno1800Calculator/issues)에 문의하십시오`
    }
}

options = {
    "existingBuildingsInput": {
        "name": "Input number of houses instead of residents",
        "locaText": {
            "english": "Input number of houses instead of residents",
            "german": "Gib Anzahl an Häusern anstelle der Einwohner ein",
            "korean": "주민 수 대신 주택 수를 입력"
        }
    },
    "noOptionalNeeds": {
        "name": "Do not produce luxury goods",
        "locaText": {
            "english": "Do not produce luxury goods",
            "german": "Keine Luxusgüter produzieren",
            "korean": "사치품을 생산하지 않습니다."
        }
    },
    "decimalsForBuildings": {
        "name": "Show number of buildings with decimals",
        "locaText": {
            "english": "Show number of buildings with decimals",
            "german": "Zeige Nachkommastellen bei der Gebäudeanzahl",
            "korean": "건물 수를 소수점 단위로 표시"
        }
    },
    "missingBuildingsHighlight": {
        "name": "Highlight missing buildings",
        "locaText": {
            "english": "Highlight missing buildings",
            "german": "Fehlende Gebäude hervorheben",
            "korean": "부족한 건물 강조"
        }
    },
    "additionalProduction": {
        "name": "Show input field for additional production",
        "locaText": {
            "english": "Show input field for additional production (negative values possible)",
            "german": "Zeige Eingabefeld für Zusatzproduktion (negative Werte möglich)",
            "korean": "추가 생산을 위한 입력 필드 표시 (음수 값 가능)"
        }
    },
    "consumptionModifier": {
        "name": "Show input field for percental consumption modification",
        "locaText": {
            "english": "Show input field for percental consumption modification",
            "german": "Zeige Eingabefeld für prozentuale Änderung des Warenverbrauchs",
            "korean": "소비 수정(백분율)을 위한 입력 필드 표시"
        }
    },
    "hideNames": {
        "name": "Hide the names of products, factories, and population levels",
        "locaText": {
            "english": "Hide the names of products, factories, and population levels",
            "german": "Verberge die Namen von Produkten, Fabriken und Bevölkerungsstufen",
            "korean": "제품, 건물명 및 인구 이름 숨기기"
        }
    },
    "hideProductionBoost": {
        "name": "Hide the input fields for production boost",
        "locaText": {
            "english": "Hide the input fields for production boost",
            "german": "Verberge das Eingabefelder für Produktionsboosts",
            "korean": "생산성 입력 필드 숨기기"
        }
    },
    "hideNewWorldConstructionMaterial": {
        "name": "Hide factory cards for construction material that produce in the new world",
        "locaText": {
            "english": "Hide factory cards for construction material that is produced in the New world",
            "german": "Verberge die Fabrikkacheln für Baumaterial, das in der Neuen Welt produziert wird",
            "korean": "새로운 지역(북극)에서 생산되는 건축 자재 숨기기"
        }
    }
}

serverOptions = {
    "populationLevelAmount": {
        "name": "PopulationLevel Amount",
        "locaText": {
            "english": "Update residents count",
            "german": "Aktualisiere Einwohneranzahl",
            "korean": "주민 수 가져오기"
        }
    },
    "populationLevelExistingBuildings": {
        "name": "PopulationLevel ExistingBuildings",
        "locaText": {
            "english": "Update houses count",
            "german": "Aktualisiere Häuseranzahl",
            "korean": "주택 수 가져오기"
        }
    },
    "factoryExistingBuildings": {
        "name": "FactoryExistingBuildings",
        "locaText": {
            "english": "Update factories count",
            "german": "Aktualisiere Fabrikanzahl",
            "korean": "생산건물 수 가져오기"
        }
    },
    "factoryPercentBoost": {
        "name": "FactoryPercentBoost",
        "locaText": {
            "english": "Update productivity",
            "german": "Aktualisiere Produktivität",
            "korean": "생산성 가져오기"
        }
    },
    /*    "optimalProductivity": {
            "name": "Optimal Productivity",
            "locaText": {
                "english": "Read maximum possible productivity instead of current average",
                "german": "Lies best mögliche Produktivität anstelle des gegenwärtigen Durchschnitts aus",
                "korean": "평균 대신 최대 생산성을 가져오기"
            }
        }, */
    "updateSelectedIslandOnly": {
        "name": "Update selected islands only",
        "locaText": {
            "english": "Restrict updates to the selected island",
            "german": "Beschränke Updates auf die ausgewählte Insel",
            "korean": "선택한 섬만 가져오기"
        }
    }
}