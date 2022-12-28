// @ts-check
import { ACCURACY, ALL_ISLANDS, createIntInput, createFloatInput, NamedElement, EPSILON } from './util.js'
import { Product } from './production.js'
import { Factory } from './factories.js'

var ko = require( "knockout" );

class TradeRoute {
    constructor(config) {
        $.extend(this, config);

        this.amount = createFloatInput(0, 0);
        this.amount(config.amount);
    }

    getOpposite(list) {
        if (list.island == this.from)
            return this.to;
        else
            return this.from;
    }

    getOppositeFactory(factory) {
        if (this.fromFactory == factory)
            return this.toFactory;
        else
            return this.fromFactory;
    }

    isExport(list) {
        return list.island == this.from;
    }

    delete() {
        view.tradeManager.remove(this);
    }
}

export class NPCTrader extends NamedElement {
    constructor(config) {
        super(config);
    }
}

class NPCTradeRoute {
    constructor(config) {
        $.extend(this, config);

        this.amount = this.ProductionPerMinute;
        this.checked = ko.observable(false);
        this.checked.subscribe(checked => {
            if (view.tradeManager) {
                if (checked)
                    view.tradeManager.npcRoutes.push(this);
                else
                    view.tradeManager.npcRoutes.remove(this);
            }
        });
    }
}

export class TradeList {
    constructor(island, factory) {
        this.island = island;
        this.factory = factory;

        this.routes = ko.observableArray();
        if (this.factory.outputs) {
            var traders = view.productsToTraders.get(this.factory.outputs[0].Product);
            if (traders)
                this.npcRoutes = traders.map(t => new NPCTradeRoute($.extend({}, t, { to: island, toFactory: factory })));
        }

        this.inputAmount = ko.pureComputed(() => {
            var amount = 0;
            for (var route of this.routes())
                if(route.isExport(this))
                    amount += route.amount();

            return amount;
        });

        this.outputAmount = ko.pureComputed(() => {
            var amount = 0;

            for (var route of (this.npcRoutes || []))
                amount += route.checked() ? route.amount : 0;

            for (var route of this.routes())
                if (!route.isExport(this))
                    amount += route.amount();

            return amount;
        });

        this.amount = ko.pureComputed(() => this.outputAmount() - this.inputAmount() );

        // interface elements to create a new route
        this.unusedIslands = ko.observableArray();
        this.selectedIsland = ko.observable();
        this.export = ko.observable(false);
        this.newAmount = ko.observable(0);

        this.visible = ko.pureComputed(() => {
            if (this.npcRoutes != null && this.npcRoutes.length > 0)
                return true;

            if (this.island.isAllIslands())
                return false;

            return view.islands().length > 2;
        });
    }

    canCreate() {
        return this.selectedIsland() && !this.selectedIsland().isAllIslands() && this.newAmount();
    }

    create() {
        if (!this.canCreate())
            return;

        var otherFactory;
        for (var f of this.selectedIsland().factories)
            if (f.guid == this.factory.guid) {
                otherFactory = f;
                break;
            }

        if (!otherFactory)
            return;

        if (this.export()) {
            var route = new TradeRoute({
                from: this.island,
                to: this.selectedIsland(),
                fromFactory: this.factory,
                toFactory: otherFactory,
                amount: this.newAmount()
            });
        } else {
            var route = new TradeRoute({
                to: this.island,
                from: this.selectedIsland(),
                toFactory: this.factory,
                fromFactory: otherFactory,
                amount: this.newAmount()
            });
        }

        this.routes.push(route);
        this.unusedIslands.remove(this.selectedIsland());
        otherFactory.tradeList.routes.push(route);

        view.tradeManager.add(route);
    }

    onShow() {
        var usedIslands = new Set(this.routes().flatMap(r => [r.from, r.to]));
        var islands = view.islands().slice(1).filter(i => !usedIslands.has(i) && i != this.island);
        islands.sort((a, b) => {
            var sIdxA = view.sessions.indexOf(a.session);
            var sIdxB = view.sessions.indexOf(b.session);

            if (sIdxA == sIdxB) {
                return a.name().localeCompare(b.name());
            } else {
                return sIdxA - sIdxB;
            }
        });
        var overProduction = this.factory.overProduction();

        this.export(overProduction > EPSILON);
        this.newAmount(Math.max(overProduction, this.factory.substitutableOutputAmount()));

        this.unusedIslands(islands);
    }
}

export class TradeManager {
    constructor() {
        this.key = "tradeRoutes";
        this.npcKey = "npcTradeRoutes";
        this.npcRoutes = ko.observableArray();
        this.routes = ko.observableArray();

        view.selectedFactory.subscribe(f => {
            if (!(f instanceof Factory))
                return;

            if (f.tradeList)
                f.tradeList.onShow();
        });



        if (localStorage) {
            // trade routes
            var islands = new Map();
            for (var i of view.islands())
                if (!i.isAllIslands())
                    islands.set(i.name(), i);

            var resolve = name => name == ALL_ISLANDS ? view.islandManager.allIslands : islands.get(name);

            var text = localStorage.getItem(this.key);
            var json = text ? JSON.parse(text) : [];
            for (var r of json) {
                var config = {
                    from: resolve(r.from),
                    to: resolve(r.to),
                    amount: parseFloat(r.amount)
                };

                if (!config.from || !config.to)
                    continue;

                config.fromFactory = config.from.assetsMap.get(r.factory);
                config.toFactory = config.to.assetsMap.get(r.factory);

                if (!config.fromFactory || !config.toFactory)
                    continue;

                var route = new TradeRoute(config);
                this.routes.push(route);
                config.fromFactory.tradeList.routes.push(route);
                config.toFactory.tradeList.routes.push(route);
            }


            this.persistenceSubscription = ko.computed(() => {
                var json = [];

                for (var r of this.routes()) {
                    json.push({
                        from: r.from.isAllIslands() ? ALL_ISLANDS : r.from.name(),
                        to: r.to.isAllIslands() ? ALL_ISLANDS : r.to.name(),
                        factory: r.fromFactory.guid,
                        amount: r.amount()
                    });
                }

                localStorage.setItem(this.key, JSON.stringify(json, null, 4));

                return json;
            });

            // npc trade routes
            text = localStorage.getItem(this.npcKey);
            json = text ? JSON.parse(text) : [];
            for (var r of json) {
                var to = resolve(r.to);

                if (!to)
                    continue;

                var factory = to.assetsMap.get(r.factory);
                if (!factory)
                    continue;

                factory.tradeList.npcRoutes.forEach(froute => {
                    if (froute.trader.guid === r.trader) {
                        froute.checked(true);
                        this.add(froute);
                    }
                });
            }


            this.npcPersistenceSubscription = ko.computed(() => {
                var json = [];

                for (var r of this.npcRoutes()) {
                    json.push({
                        trader: r.trader.guid,
                        to: r.to.isAllIslands() ? ALL_ISLANDS : r.to.name(),
                        factory: r.toFactory.guid
                    });
                }

                localStorage.setItem(this.npcKey, JSON.stringify(json, null, 4));

                return json;
            });
        }
    }

    add(route) {
        if (route instanceof NPCTradeRoute)
            this.npcRoutes.push(route);
        else
            this.routes.push(route);
    }

    remove(route) {
        if (route instanceof NPCTradeRoute) {
            this.npcRoutes.remove(route);
            route.checked(false);
            return;
        }

        route.fromFactory.tradeList.routes.remove(route);
        route.toFactory.tradeList.routes.remove(route);
        this.routes.remove(route);

        route.toFactory.tradeList.unusedIslands.unshift(route.from);
        route.fromFactory.tradeList.unusedIslands.unshift(route.to);
    }

    islandDeleted(island) {
        {
            var deletedRoutes = this.routes().filter(r => r.to === island || r.from === island);
            deletedRoutes.forEach(r => this.remove(r));
        }

        {
            var deletedRoutes = this.npcRoutes().filter(r => r.to === island);
            deletedRoutes.forEach(r => this.remove(r));
        }
    }
}

class Pier extends NamedElement {
    constructor(config) {
        super(config);
    }
}

class TradeContract {
    constructor(config) {
        $.extend(this, config);

        this.exportProduct = this.exportFactory.product;
        this.importProduct = this.importFactory.product;

        this.importAmount = createFloatInput(0, 0);

        this.ratio = ko.computed(() => {
            return (this.importProduct.agio || 1) * this.importProduct.exchangeWeight /
                this.exportProduct.exchangeWeight /
                (view.contractUpgradeManager.upgradesMap().get(this.exportProduct.guid) || 1);
        });

        this.exportAmount = ko.pureComputed({
            read: () => this.ratio() * this.importAmount(),
            write: val => this.importAmount(parseFloat(val) / this.ratio())
        });

        if (config.importAmount)
            this.importAmount(config.importAmount);
        else
            this.exportAmount(config.exportAmount);

        this.importCount = ko.observable(0);
        this.exportCount = ko.observable(0);
        this.fixed = ko.observable(this.fixed || false);
    }

    delete() {
        this.importFactory.island.contractManager.remove(this);
    }
}

export class ContractList {
    constructor(island, factory) {
        this.island = island;
        this.factory = factory;

        this.imports = ko.observableArray();
        this.exports = ko.observableArray();

        this.inputAmount = ko.pureComputed(() => {
            var amount = 0;

            for (var contract of this.exports())
                amount += contract.exportAmount();

            return amount;
        });

        this.outputAmount = ko.pureComputed(() => {
            var amount = 0;

            for (var contract of this.imports())
                amount += contract.importAmount();

            return amount;
        })

        this.amount = ko.pureComputed(() => this.outputAmount() - this.inputAmount());
    }
}

export class ContractManager {
    constructor(island) {
        this.key = "tradingContracts";
        this.paramKey = "tradingContractParams";
        this.island = island;
        this.contracts = ko.observableArray();
        this.contractsLength = ko.pureComputed(() => this.contracts().length);

        var dlc = view.dlcsMap.get("dlc7");
        if (dlc) {
            dlc.addDependentObject(this.contractsLength);
        }

        var localStorage = island.storage;
        if (localStorage) {
            // trade routes
            var assetsMap = island.assetsMap;

            var text = localStorage.getItem(this.key);
            var json = text ? JSON.parse(text) : [];
            for (var r of json) {
                var config = {
                    importFactory: assetsMap.get(r.importFactory),
                    exportFactory: assetsMap.get(r.exportFactory),
                    importAmount: parseFloat(r.importAmount),
                    fixed: r.fixed
                };

                if (!config.importFactory || !config.exportFactory || !config.importFactory.contractList || !config.exportFactory.contractList)
                    continue;

                var contract = new TradeContract(config);
                this.contracts.push(contract);
                config.importFactory.contractList.imports.push(contract);
                config.exportFactory.contractList.exports.push(contract);
            }


            this.persistenceSubscription = ko.computed(() => {
                var json = [];

                for (var r of this.contracts()) {
                    json.push({
                        importFactory: r.importFactory.guid,
                        exportFactory: r.exportFactory.guid,
                        importAmount: r.importAmount(),
                        fixed: r.fixed() ? 1 : 0
                    });
                }

                localStorage.setItem(this.key, JSON.stringify(json, null, 4));

                return json;
            });

        }

        this.traderLoadingSpeed = createFloatInput(2, 1, 50);
        this.existingStorageCapacity = createIntInput(2000, 100, 50000);
        this.traderTransferTime = createIntInput(params.tradeContracts.traderTransferMinutes + 4, 20)

        if (localStorage) {
            {
                let id = "traderLoadingSpeed.amount";
                if (localStorage.getItem(id) != null)
                    this.traderLoadingSpeed(parseFloat(localStorage.getItem(id)));

                this.traderLoadingSpeed.subscribe(val => localStorage.setItem(id, val));
            }

            {
                let id = "existingStorageCapacity.amount";
                if (localStorage.getItem(id) != null)
                    this.existingStorageCapacity(parseInt(localStorage.getItem(id)));

                this.existingStorageCapacity.subscribe(val => localStorage.setItem(id, val));
            }

            {
                let id = "traderTransferTime.amount";
                if (localStorage.getItem(id) != null)
                    this.traderTransferTime(parseInt(localStorage.getItem(id)));

                this.traderTransferTime.subscribe(val => localStorage.setItem(id, val));
            }
        }

        this.traderLoadingDuration = ko.computed(() => {
            var totalAmount = 0;
            for (var c of this.contracts())
                totalAmount += c.importAmount() + c.exportAmount();

            var transferTime = this.traderTransferTime();

            if (totalAmount >= 60 * this.traderLoadingSpeed() * params.tradeContracts.loadingSpeedFactor) {
                for (var c of this.contracts()) {
                    c.importCount(Infinity);
                    c.exportCount(Infinity);
                }

                return Infinity;
            }

            var x = totalAmount / (60 * this.traderLoadingSpeed() * params.tradeContracts.loadingSpeedFactor);
            var loadingDuration = Math.max(params.tradeContracts.minimumLoadingTime / 60, - transferTime * x / (x - 1));
            var totalDuration = transferTime + loadingDuration;

            for (var c of this.contracts()) {
                c.importCount(Math.ceil(c.importAmount() * totalDuration));
                c.exportCount(Math.ceil(c.exportAmount() * totalDuration));
            }

            return loadingDuration;
        });

        this.totalAmount = ko.pureComputed(() => {
            var sum = 0;

            for (var c of this.contracts())
                sum += c.importAmount() + c.exportAmount();

            return sum;
        });

        this.storageCapacity = ko.pureComputed(() => {
            var productToCount = new Map();

            for (var c of this.contracts()) {
                // import
                var guid = c.importProduct.guid;
                if (productToCount.has(guid))
                    productToCount.set(guid, c.importCount() + productToCount.get(guid));
                else
                    productToCount.set(guid, c.importCount());

                // export
                guid = c.exportProduct.guid;
                if (productToCount.has(guid))
                    productToCount.set(guid, c.exportCount() + productToCount.get(guid));
                else
                    productToCount.set(guid, c.exportCount());

            }

            if (!productToCount.size)
                return 0;

            var m = 0;
            for (var val of productToCount.values())
                if (val > m)
                    m = val;

            return m;
        });

    }

    add(contract) {
        this.contracts.push(contract);
    }

    remove(contract) {
        contract.importFactory.contractList.imports.remove(contract);
        contract.exportFactory.contractList.exports.remove(contract);
        this.contracts.remove(contract);
    }

    islandDeleted(island) {
        var dlc = view.dlcsMap.get("dlc7");
        if (dlc) {
            dlc.removeDependentObject(this.contractsLength);
        }
    }

    setStorageCapacity() {
        if (!this.contracts().length)
            return;

        var transferTime = this.traderTransferTime();

        var getAmounts = (fixed) => {
            var totalAmount = 0;
            var productToAmount = new Map();
            for (var c of this.contracts()) {
                if (fixed != c.fixed())
                    continue;

                var importAmount = c.importAmount() || ACCURACY;
                var exportAmount = c.exportAmount() || (ACCURACY * c.ratio());
                totalAmount += importAmount + exportAmount;

                // import
                var guid = c.importProduct.guid;
                if (productToAmount.has(guid))
                    productToAmount.set(guid, importAmount + productToAmount.get(guid));
                else
                    productToAmount.set(guid, importAmount);

                // export
                guid = c.exportProduct.guid;
                if (productToAmount.has(guid))
                    productToAmount.set(guid, exportAmount + productToAmount.get(guid));
                else
                    productToAmount.set(guid, exportAmount);
            }

            var maxAmount = 0;
            var maximizer = 0;
            for (var key of productToAmount.keys()) {
                var val = productToAmount.get(key);
                if (val > maxAmount) {
                    maxAmount = val;
                    maximizer = key;
                }
            }

            return {
                "max": maxAmount,
                "maximizer": maximizer,
                "total": totalAmount,
                "perProduct": productToAmount
            };
        };

        var fixedAmounts = getAmounts(true);
        var volatileAmounts = getAmounts(false);

        if (volatileAmounts.total == 0)
            return;

        var s = 60 * this.traderLoadingSpeed() * params.tradeContracts.loadingSpeedFactor;
        var c = this.existingStorageCapacity();

        //x = newTotalAmount / s
        //existingStorageCapactiy = newMaxAmount * (loadingDuration + transferTime) 
        //    = newMaxAmount * (-transferTime * x/(x-1) + transferTime)
        //    = newMaxAmount * (- transferTime * (newTotalAmount / s) / ((newTotalAmount / s) - 1) + transferTime)
        //    = f * maxAmount * (- transferTime * (f * totalAmount / s) / ((f * totalAmount / s) - 1) + transferTime)

        if (fixedAmounts.total == 0) {
            var f = c * s / (volatileAmounts.max * s * transferTime + c * volatileAmounts.total);

            for (var c of this.contracts()) {
                c.importAmount(f * (c.importAmount() || ACCURACY));
            }
            // fixed contracts exceed capacity
        } else if (s * c <= fixedAmounts.max * s * transferTime + c * fixedAmounts.total + ACCURACY) {
            for (var c of this.contracts()) {
                if (!c.fixed())
                    c.importAmount(0 * c.importAmount());
            }
        } else {
            var prevGuid = 0;
            var prevF = 0;
            var guid = fixedAmounts.maximizer;
            var f = 1;

            while (prevGuid != guid && Math.abs(f - prevF) > ACCURACY) {
                var maxFixed = fixedAmounts.perProduct.get(guid) || 0;
                var maxVolatile = volatileAmounts.perProduct.get(guid) || 0;
                prevF = f;

                f = (-maxFixed * s * transferTime + s * c - c * fixedAmounts.total) / (maxVolatile * s * transferTime + c * volatileAmounts.total);

                var maxAmount = maxFixed + f * maxVolatile;
                prevGuid = guid;

                for (var g of volatileAmounts.perProduct.keys()) {
                    var amount = f * volatileAmounts.perProduct.get(g) + (fixedAmounts.perProduct.get(g) || 0);

                    if (amount > maxAmount + ACCURACY) {
                        maxAmount = amount;
                        guid = g;
                    }
                }
            }

            for (var c of this.contracts()) {
                if (!c.fixed())
                    c.importAmount(f * (c.importAmount() || ACCURACY));
            }
        }
    }
}

class ContractUpgrade {
    constructor(config) {
        $.extend(this, config);
    }

    delete() {
        view.contractUpgradeManager.upgrades.remove(this);
    }
}

export class ContractUpgradeManager {
    constructor() {
        this.key = "contractUpgrades";
        this.upgrades = ko.observableArray();

        this.productsMap = new Map();
        var assetsMap = new Map();
        for (var p of params.products)
            if (p.exchangeWeight)
                this.productsMap.set(p.guid, new Product(p, assetsMap));


        if (localStorage) {

            var text = localStorage.getItem(this.key);
            var json = text ? JSON.parse(text) : {};
            for (var p in json) {
                var config = {
                    product: this.productsMap.get(parseInt(p)),
                    factor: json[p],
                };

                this.upgrades.push(new ContractUpgrade(config));
            }


            this.persistenceSubscription = ko.computed(() => {
                var json = {};

                for (var u of this.upgrades()) {
                    json[u.product.guid] = u.factor;
                }

                localStorage.setItem(this.key, JSON.stringify(json));

                return json;
            });

        }

        this.sortUpgrades();

        this.upgradesMap = ko.pureComputed(() => {
            var map = new Map();
            for (var u of this.upgrades())
                map.set(u.product.guid, u.factor);

            return map;
        });

        this.products = ko.computed(() => {
            return [...this.productsMap.values()]
                .filter(p => !this.upgradesMap().has(p.guid))
                .sort((a, b) => a.name().localeCompare(b.name()));
        });
        this.product = ko.observable(null);
        this.factors = ko.computed(() => {
            var factorToAmount = new Map();

            for (var u of params.tradeContracts.upgrades)
                factorToAmount.set(u.factor, 0);

            for (var u of this.upgrades())
                factorToAmount.set(u.factor, factorToAmount.get(u.factor) + 1);

            return params.tradeContracts.upgrades.filter(u => factorToAmount.get(u.factor) < u.maximumAllowedGoods).map(u => u.factor);
        });
        this.factor = ko.observable(this.factors[0]);

        this.canCreate = ko.pureComputed(() => this.product() && this.factor());
    }

    create() {
        this.upgrades.push(new ContractUpgrade({
            product: this.product(),
            factor: this.factor()
        }));

        this.sortUpgrades();
    }

    sortUpgrades() {
        this.upgrades.sort((a, b) => {
            if (a.factor != b.factor)
                return b.factor - a.factor;

            return a.product.name().localeCompare(b.product.name());
        });
    }
}

export class ContractCreatorFactory {
    constructor() {
        // interface elements to create a new contract in factory config dialog
        this.export = ko.observable(false);

        this.exchangeProducts = ko.computed(() => {
            if (!view.selectedFactory() || !view.selectedFactory().contractList)
                return [];

            var f = view.selectedFactory();
            var fl = f.contractList;
            var i = fl.island
            var il = i.contractManager.contracts();

            var usedProducts = [f.product]
            if (this.export())
                usedProducts = usedProducts.concat(fl.exports().map(c => c.importProduct))
            else
                usedProducts = usedProducts.concat(fl.imports().map(c => c.exportProduct));

            if (!i.isAllIslands())
                if (this.export())
                    usedProducts = usedProducts.concat(il.map(c => c.exportProduct))
                else
                    usedProducts = usedProducts.concat(il.map(c => c.importProduct))

            usedProducts = new Set(usedProducts);
            usedProducts.add(f.product);

            var list;
            if (this.export())
                list = i.products
                    .filter(p => p.guid != 1010566 && p.guid != 270042 && p.canImport && !usedProducts.has(p) && p.available());
            else
                list = i.products
                    .filter(p => p.guid != 1010566 && p.guid != 270042 && !usedProducts.has(p) && p.available());

            return list.sort((a, b) => a.name().localeCompare(b.name()));
        });
        this.exchangeProduct = ko.observable(null);

        this.exchangeFactories = ko.computed(() => {
            var list;
            if (this.exchangeProduct())
                list = this.exchangeProduct().factories;
            else
                list = this.exchangeProducts().flatMap(p => p.factories);


            return list.sort((a, b) => a.getRegionExtendedName().localeCompare(b.getRegionExtendedName()));
        });
        this.exchangeFactory = ko.observable();
        this.exchangeFactory.subscribe(f => this.exchangeProduct(f ? f.product : null));

        this.newAmount = createFloatInput(0, 0);

        this.contractList = ko.pureComputed(() => {
            return view.selectedFactory().contractList;
        });

        this.canImport = ko.pureComputed(() => {
            var f = view.selectedFactory();

            return !!(f.product.canImport && (f.contractList.island.isAllIslands() || !f.contractList.exports().length));
        });

        this.canExport = ko.pureComputed(() => {
            var f = view.selectedFactory();

            return !!(f.contractList.island.isAllIslands() || !f.contractList.imports().length);
        });

        view.selectedFactory.subscribe(f => {
            if (!(f instanceof Factory) || !f.contractList)
                return;

            var overProduction = f.overProduction();
            var outputAmount = f.substitutableOutputAmount();


            if (!f.contractList.island.isAllIslands() && f.contractList.exports().length) {
                this.export(true);
                this.newAmount(Math.max(0, overProduction));
            } else if (f.contractList.imports().length) {
                this.export(false);
                this.newAmount(outputAmount);
            } else {
                if (outputAmount > 0 &&
                    (f.product.canImport && (f.contractList.island.isAllIslands() || !f.contractList.exports().length))) {
                    // do not use this.canImport() since it may not be updated yet
                    this.export(false);
                    this.newAmount(outputAmount);
                } else {
                    this.export(true);
                    this.newAmount(Math.max(0, overProduction));
                }
            }
        });
    }

    canCreate() {
        return this.exchangeFactory() && this.newAmount() && (this.export() || this.canImport()) && this.exchangeFactory().getProduct().exchangeWeight && view.selectedFactory().getProduct().exchangeWeight;
    }

    create() {
        if (!this.canCreate())
            return;

        var f = view.selectedFactory();
        var l = f.contractList;
        if (!l)
            return;

        var otherF = this.exchangeFactory();

        if (this.export()) {
            var contract = new TradeContract({
                exportFactory: f,
                importFactory: otherF,
                exportAmount: this.newAmount()
            });

            l.exports.push(contract);
            otherF.contractList.imports.push(contract);
        } else {
            var contract = new TradeContract({
                exportFactory: otherF,
                importFactory: f,
                importAmount: this.newAmount()
            });

            l.imports.push(contract);
            otherF.contractList.exports.push(contract);
        }

        l.island.contractManager.add(contract);
    }
}
