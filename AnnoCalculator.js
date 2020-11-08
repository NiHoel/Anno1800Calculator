let versionCalculator = "v3.9";
let EPSILON = 0.01;
let ALL_ISLANDS = "All Islands";



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
            this.isAllIslands = function() { return false; };
        } else {
            this.name = ko.computed(() => view.texts.allIslands.name());
            this.isAllIslands = function() { return true; };
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
        this.allGoodConsumptionUpgrades = new GoodConsumptionUpgradeIslandList();

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
                        p.fixedFactory.subscribe(
                            f => f ? localStorage.setItem(id, f.guid) : localStorage.removeItem(id));
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
                        b.extraAmount.subscribe(() => n.updateAmount());
                        if (b.palaceBuff)
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

        for (let upgrade of params.goodConsumptionUpgrades) {
            let u = new GoodConsumptionUpgrade(upgrade, assetsMap, this.populationLevels);
            assetsMap.set(u.guid, u);
            this.allGoodConsumptionUpgrades.upgrades.push(u);

            if (localStorage) {
                let id = u.guid + ".checked";
                if (localStorage.getItem(id))
                    u.checked(parseInt(localStorage.getItem(id)));

                u.checked.subscribe(val => localStorage.setItem(id, val ? 1 : 0));
            }
        }

        for (let level of this.populationLevels)
            for (let need of level.needs) {
                this.allGoodConsumptionUpgrades.lists.push(need.goodConsumptionUpgradeList);
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


        this.top2Population = ko.computed(() => {
            var useHouses = view.settings.existingBuildingsInput.checked();
            var comp = useHouses
                ? (a, b) => a.existingBuildings() < b.existingBuildings()
                : (a, b) => a.amount() < b.amount();

            return [...this.populationLevels].sort(comp).slice(0,2).filter(l => useHouses ? l.existingBuildings() : l.amount());
        });

        this.top5Factories = ko.computed(() => {
            var useBuildings = view.settings.missingBuildingsHighlight.checked();
            var comp = useBuildings
                ? (a, b) => a.existingBuildings() < b.existingBuildings()
                : (a, b) => a.buildings() < b.buildings();

            return [...this.factories].sort(comp).slice(0, 5).filter(f => useBuildings ? f.existingBuildings() : f.buildings());
        });
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
                if (a.palaceBuffChecked)
                    a.palaceBuffChecked(false);
                a.percentBoost(100);
                a.extraAmount(0);
            }

            if (a instanceof PopulationLevel) {
                a.existingBuildings(0);
                a.amount(0);
            }
            if (a instanceof Item)
                for(var i of a.equipments)
                    i.checked(false);

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
        this.goodConsumptionUpgradeList = new GoodConsumptionUpgradeList(this);

        this.percentBoost = ko.observable(100);
        this.percentBoost.subscribe(val => {
            val = parseFloat(val);
            if (val <= 0)
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
        this.amount(Math.max(0, overProduction - EPSILON));
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

class Item extends Option {
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
        this.equipments =
            this.factories.map(f => new EquippedItem({ item: this, factory: f, locaText: this.locaText }, assetsMap));

        this.checked.subscribe(checked => this.equipments.forEach(e => e.checked(checked)));
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

class GoodConsumptionUpgrade extends Option{
    constructor(config, assetsMap, levels) {
        super(config, assetsMap);

        this.entries = [];
        this.entriesMap = new Map();
        this.populationLevels = config.populationLevels.map(l => assetsMap.get(l));
        this.populationLevelsSet = new Set(this.populationLevels);

        for (var entry of config.goodConsumptionUpgrade) {
            if (entry.AmountInPercent <= -100)
                continue;

            this.entries.push(new GoodConsumptionUpgradeEntry($.extend({ upgrade: this }, entry), assetsMap));
            this.entriesMap.set(entry.ProvidedNeed, this.entries[this.entries.length - 1]);
        }

        for (var level of levels) {
            if (!this.populationLevelsSet.has(level))
                continue;

            for (var need of level.needs) {
                var entry = this.entriesMap.get(need.allDemands[0].product.guid);
                if (entry)
                    need.goodConsumptionUpgradeList.add(entry);
            }
        }
    }
}

class NewspaperNeedConsumption {
    constructor() {
        this.selectedEffects = ko.observableArray();
        this.allEffects = [];
        this.amount = ko.observable(100);
        this.selectedBuff = ko.observable(0);
        this.selectableBuffs = ko.observableArray();

        this.updateBuff();

        this.selectedEffects.subscribe(() => this.updateBuff());

        this.selectedEffects.subscribe(() => {
            if (this.selectedEffects().length > 3)
                this.selectedEffects.splice(0, 1)[0].checked(false);
        });

        this.amount = ko.computed(() => {
            var sum = 0;
            for (var effect of this.selectedEffects()) {
                sum += effect.amount;
            }

            return sum * (1 + parseInt(this.selectedBuff()) / 100);
        });
    }

    add(effect) {
        this.allEffects.push(effect);
        effect.checked.subscribe(checked => {
            var idx = this.selectedEffects.indexOf(effect);
            if (checked && idx != -1 || !checked && idx == -1)
                return;

            if (checked)
                this.selectedEffects.push(effect);
            else
                this.selectedEffects.remove(effect);
        });
    }

    updateBuff() {
        var influenceCosts = 0;
        for (var effect of this.selectedEffects()) {
            influenceCosts += effect.influenceCosts;
        }

        var threeSelected = this.selectedEffects().length >= 3;
        var selectedBuff = this.selectedBuff();

        this.selectableBuffs.removeAll();
        if (influenceCosts < 50)
            this.selectableBuffs.push(0);
        if (influenceCosts < 150 && (!threeSelected || !this.selectableBuffs().length))
            this.selectableBuffs.push(7);
        if (influenceCosts < 300 && (!threeSelected || !this.selectableBuffs().length))
            this.selectableBuffs.push(15);
        if (!threeSelected || !this.selectableBuffs().length)
            this.selectableBuffs.push(25);

        if (this.selectableBuffs.indexOf(selectedBuff) == -1)
            this.selectedBuff(this.selectableBuffs()[0]);
        else
            this.selectedBuff(selectedBuff);
    }
}

class NewspaperNeedConsumptionEntry extends Option {
    constructor(config) {
        super(config);

        this.amount = config.articleEffects[0].ArticleValue;
    }
}

class GoodConsumptionUpgradeEntry {
    constructor(config, assetsMap) {
        this.upgrade = config.upgrade;
        this.product = assetsMap.get(config.ProvidedNeed);
        this.amount = config.AmountInPercent;
    }
}

class GoodConsumptionUpgradeList {
    constructor(need) {
        this.upgrades = [];
        this.amount = ko.observable(100);
        this.need = need;

        this.updateAmount();
        view.newspaperConsumption.amount.subscribe(() => this.updateAmount());
    }

    add(upgrade) {
        this.upgrades.push(upgrade);
        upgrade.upgrade.checked.subscribe(() => this.updateAmount());
    }

    updateAmount() {
        var factor = (100 + view.newspaperConsumption.amount()) / 100;
        for (var entry of this.upgrades) {
            if (entry.upgrade.checked())
                factor *= (100 + entry.amount) / 100;
        }

        this.amount(100 * factor);
    }

    apply() {
        this.need.percentBoost(this.amount());
    }
}

class GoodConsumptionUpgradeIslandList {
    constructor() {
        this.lists = [];
        this.upgrades = [];
    }

    apply() {
        for (var list of this.lists) {
            list.apply();
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

            for (var isl of (json.islands || [])) {
                view.islandManager.registerName(isl.name);
            }

            var island = null;
            if (json.islandName) {
                island = view.islandManager.getByName(json.islandName);
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


}

class IslandManager {
    constructor(params) {
        let islandKey = "islandName";
        let islandsKey = "islandNames";

        this.islandNameInput = ko.observable();
        this.params = params;
        this.unusedNames = ko.observableArray();
        this.serveNamesMap = new Map();

        this.showIslandOnCreation = new Option({
            name: "Show Island on Creation",
            locaText: texts.showIslandOnCreation
        });
        this.showIslandOnCreation.checked(true);

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
            this.serveNamesMap.set(island.name(), island);

            if (name == islandName)
                view.island(island);
        }

        this.sortIslands();

        var allIslands = new Island(params, localStorage);
        view.islands.unshift(allIslands);
        this.serveNamesMap.set(allIslands.name(), allIslands);
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

            return this.serveNamesMap.has(name) && this.serveNamesMap.get(name).name() == name;
        });
    }

    create(name) {
        if (name == null) {
            if (this.islandExists())
                return;

            name = this.islandNameInput();
        }

        if (this.serveNamesMap.has(name) && this.serveNamesMap.get(name).name() == name)
            return;

        var island = new Island(this.params, new Storage(name));
        view.islands.push(island);
        this.sortIslands();

        if(this.showIslandOnCreation.checked())
            view.island(island);

        this.serveNamesMap.set(name, island);
        var removedNames = this.unusedNames.remove(n => !isNaN(this.compareNames(n, name)));
        for (var n of removedNames)
            this.serveNamesMap.set(n, island);

        if(name == this.islandNameInput())
            this.islandNameInput(null);
    }

    delete(island) {
        if (island == null)
            island = view.island();

        if (island.name() == ALL_ISLANDS || island.isAllIslands())
            return;

        if(view.island() == island)
            view.island(view.islands()[0]);

        view.islands.remove(island);
        if (localStorage)
            localStorage.removeItem(island.name());

        for (var entry of this.serveNamesMap.entries()) {
            if (entry[1] == island)
                this.serveNamesMap.set(entry[0], null);
        }

        this.serveNamesMap.delete(island.name());
        this.unusedNames.push(island.name());
        this.sortUnusedNames();
    }

    getByName(name) {
        return this.serveNamesMap.get(name);
    }

    registerName(name) {
        if (name == ALL_ISLANDS || this.serveNamesMap.has(name))
            return;

        var island = null;
        var bestMatch = Math.Infinity;

        for (var isl of this.islands()) {
            var match = compareNames(isl.name(), name);
            if (!isNaN(match) && match > bestMatch) {
                island = isl;
                bestMatch = match;
            }
        }

        if (island) {
            this.serveNamesMap.set(name, island);
            this.unusedNames.remove(name);
            return;
        }

        this.unusedNames.push(name);
        this.sortUnusedNames();
    }

    compareNames(name1, name2) {
        var totalLength = Math.max(name1.length, name2.length);
        var minLcsLength = totalLength - Math.round(-0.677 + 1.51 * Math.log(totalLength));
        var lcsLength = this.lcsLength(name1, name2);

        if (lcsLength >= minLcsLength)
            return lcsLength / totalLength;
        else
            return NaN;
    }

    sortIslands() {
        view.islands.sort((a, b) => {
            if (a.isAllIslands() || a.name() == ALL_ISLANDS)
                return false;
            else if (b.isAllIslands() || b.name() == ALL_ISLANDS)
                return true;

            return a.name() > b.name();
        })
    }

    sortUnusedNames() {
        this.unusedNames.sort();
    }

    // Function to find length of Longest Common Subsequence of substring
    // X[0..m-1] and Y[0..n-1]
    // From https://www.techiedelight.com/longest-common-subsequence/
    lcsLength(X, Y) {
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

function init() {

    // set up options
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

    // set up newspaper
    view.newspaperConsumption = new NewspaperNeedConsumption();
    if (localStorage) {
        let id = "newspaperPropagandaBuff";
        if (localStorage.getItem(id))
            view.newspaperConsumption.selectedBuff(localStorage.getItem(id));

        view.newspaperConsumption.selectedBuff.subscribe(val => localStorage.setItem(id, val));
    }

    for (var e of (params.newspaper || [])) {
        var effect = new NewspaperNeedConsumptionEntry(e);
        view.newspaperConsumption.add(effect);

        if (localStorage) {
            let id = effect.guid + ".checked";
            if (localStorage.getItem(id) != null)
                effect.checked(parseInt(localStorage.getItem(id)));

            effect.checked.subscribe(val => localStorage.setItem(id, val ? 1 : 0));
        }
    }

    // set up island management
    view.islandManager = new IslandManager(params);

    if (localStorage) {
        let id = "language";
        if (localStorage.getItem(id))
            view.settings.language(localStorage.getItem(id));

        view.settings.language.subscribe(val => localStorage.setItem(id, val));
    }

    // set up modal dialogs
    view.selectedFactory = ko.observable(view.island().factories[0]);
    view.selectedGoodConsumptionUpgradeList =
        ko.observable(view.island().populationLevels[0].needs[0].goodConsumptionUpgradeList);

    ko.applyBindings(view, $(document.body)[0]);

    view.island().name.subscribe(val => { window.document.title = val; });

 
    // set up key bindings
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
                    bindings.set(c, $(`.ui-tier-unit-name[tier-unit-guid=${l.guid}] ~ .input .input-group input`));
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

function formatPercentage(number) {
    var str = (Math.ceil(10 * parseFloat(number)) / 10) + ' %';
    if (number > 0)
        str = '+' + str;

    return str;
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
