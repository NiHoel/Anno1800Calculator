// @ts-check
import { ACCURACY } from './util.js'
import { PopulationLevel, ResidenceBuilding, Workforce } from './population.js'
import { PopulationNeed, ResidenceEffect, ResidenceEffectCoverage } from './consumption.js'
import { ProductCategory, Product, Demand } from './production.js'
import { Consumer, Factory } from './factories.js'

var ko = require( "knockout" );

export class DarkMode {
    constructor() {
        this.checked = ko.observable(false);

        this.classAdditions = {
            "body": "bg-dark",
            //".ui-fieldset legend, body": "text-light",
            //".form-control": "text-light bg-dark bg-darker",
            //".custom-select": "text-light bg-dark bg-darker",
            //".input-group-text, .modal-content": "bg-dark text-light",
            //".btn-default": "btn-dark btn-outline-light",
            //".btn-light": "btn-dark",
            //".ui-fchain-item": "bg-dark",
            //".card": "bg-dark"
        };

        this.checked.subscribe(() => this.apply());

        if (localStorage) {
            let id = "darkMode.checked";
            if (localStorage.getItem(id) != null)
                this.checked(parseInt(localStorage.getItem(id)));

            this.checked.subscribe(val => localStorage.setItem(id, val ? 1 : 0));
        }
    }

    toggle() {
        this.checked(!this.checked());
    }

    apply() {
        if (this.checked())
            Object.keys(this.classAdditions).forEach((key) => $(key).addClass(this.classAdditions[key]));
        else
            Object.keys(this.classAdditions).reverse()
                .forEach((key) => $(key).removeClass(this.classAdditions[key]));
    }
}

export class ViewMode {
    constructor() {
    }

    start() {
        view.settings.missingBuildingsHighlight.checked(true);
        view.settings.utilizeExistingFactories.checked(true);
        view.settings.needUnlockConditions.checked(true);
    }

    plan() {
        view.settings.decimalsForBuildings.checked(true);

        for (var dlc of view.dlcs.values()) {
            dlc.checked(true);
        }

        for (var dlc of [0, 2, 8, 11]) {
            var d = view.dlcsMap.get("dlc" + dlc);
            if (d)
                d.checked(false);
        }
    }

    master() {
        for (var option of view.settings.options)
            option.checked(true);

        view.settings.hideProductionBoost.checked(false);

        for (var dlc of view.dlcs.values()) {
            dlc.checked(true);
        }
    }
}

export class Template {
    constructor(asset, parentInstance, attributeName, index) {


        this.attributeName = attributeName;
        this.index = index;

        this.name = asset.name;
        this.recipeName = asset.recipeName;
        this.guid = asset.guid;
        this.getRegionExtendedName = asset.getRegionExtendedName;
        this.editable = asset.editable;
        this.region = asset.region;
        this.hotkey = asset.hotkey;

        this.templates = [];
        this.parentInstance = ko.observable(parentInstance);

        this.instance = ko.computed(() => {
            var p = this.parentInstance();

            var inst = p[this.attributeName][this.index];

            this.templates.forEach(t => t.parentInstance(inst));

            return inst;
        });

        for (var attr in asset) {
            var val = asset[attr];

            if (val instanceof Array) {
                this[attr] = val.map((a, index) => {
                    if (Template.prototype.applicable(asset)) {
                        var t = new Template(a, this.instance(), attr, index);
                        this.templates.push(t);
                        return t;
                    } else
                        return a;
                });
            }
            else if (!ko.isObservable(val) && !ko.isComputed(val) && asset.hasOwnProperty(attr))
                this[attr] = val;
        }

    }

    applicable(asset) {
        return asset instanceof PopulationLevel ||
            asset instanceof Workforce ||
            asset instanceof ProductCategory ||
            asset instanceof Product ||
            asset instanceof Factory ||
            asset instanceof Demand;
    }
}

export class ProductionChainView {
    /**
     * 
     * @param {KnockoutObservable<Factory|Consumer>} factory
     * @param {KnockoutObservable<number>|null} amount
     */
    constructor(factory, amount = null) {
        this.factory = factory;
        this.amount = amount;

        this.tree = ko.pureComputed(() => {
            let traverse = (/** @type Factory|Consumer */consumer, amount) => {
                    if (amount < ACCURACY)
                        return null;

                    if (!(consumer instanceof Factory)){
                        return {
                            'amount': amount,
                            'factory': consumer,
                            'buildings': amount / consumer.tpmin / consumer.boost(),
                            'children': consumer.inputDemands().map(d => traverse(d.factory(), amount))
                        }; 
                    }

                    var factory = /** @type Factory */ consumer;

                    var icon = null;
                    var maxSubAmount = factory.outputAmount ? factory.outputAmount() : factory.inputAmount();
                    if (factory.tradeList && factory.tradeList.amount() > maxSubAmount){
                        maxSubAmount = factory.tradeList.amount()
                        icon = "./icons/icon_shiptrade.png"
                    }
                    if (factory.contractList && factory.contractList.amount() > maxSubAmount){
                        maxSubAmount = factory.contractList.amount()
                        icon = "./icons/icon_docklands_2d_white.png"
                    } 
                    if (factory.extraGoodProductionAmount && factory.extraGoodProductionAmount() > maxSubAmount) {
                        maxSubAmount = factory.extraGoodProductionAmount()
                        icon = "./icons/icon_add_goods_socket_white.png"
                    } 
                    
                    if(icon){
                        return {
                            'amount': amount,
                            'factory': factory,
                            'children': [],
                            'icon': icon
                        }
                    }

                    var inputAmount = amount / factory.extraGoodFactor();
                    return {
                        'amount': amount,
                        'factory': factory,
                        'buildings': inputAmount / factory.tpmin / factory.boost(),
                        'children': factory.inputDemands().map(d => traverse(d.factory(), inputAmount))
                    };           

            };

            var amount = this.amount;
            if (amount == null)
                amount = this.factory().outputAmount;
            if (amount == null)
                amount = this.factory().inputAmount;
            return traverse(this.factory(), amount());
             
        });

        this.breadth = ko.pureComputed(() => {
            if (this.tree() == null)
                return 0;

            var traverse = node => Math.max(1, (node.children || []).map(n => traverse(n)).reduce((a,b) => a +b, 0));

            return traverse(this.tree());
        })
    }
}

class ResidenceEffectAggregate {
    /**
     * 
     * @param {KnockoutObservable<number>} totalResidences
     * @param {ResidenceBuilding} residence
     * @param {ResidenceEffectCoverage} residenceEffectCoverage
     */
    constructor(totalResidences, residenceEffectCoverage) {
        this.totalResidences = totalResidences;
        this.residenceEffect = residenceEffectCoverage.residenceEffect;

        this.coverage = [residenceEffectCoverage];
    }

    add(residenceEffectCoverage) {
        this.coverage.push(residenceEffectCoverage);
    }

    finishInitialization() {
        this.averageCoverage = ko.pureComputed(() => {
            var sum = 0;
            this.coverage.forEach(coverage => { sum += coverage.residence.existingBuildings() * coverage.coverage(); });

            return sum / this.totalResidences();
        });
    }
}

export class ResidenceEffectView {
    /**
     * 
     * @param {[ResidenceBuilding]} residences 
     * @param {PopulationNeed} need 
     */
    constructor(residences, heading = null, need = null) {
        this.heading = heading || window.view.texts.needConsumption.name;
        this.residences = residences.filter(r => r.available());
        this.percentCoverage = ko.observable(100);

        this.totalResidences = ko.pureComputed(() => {
            var sum = 0;
            this.residences.forEach(r => { sum += r.existingBuildings(); });
            return sum;
        });

        var effects = new Set();
        var aggregatesMap = new Map();
        this.consumedProducts = new Set();
        this.residences.forEach(r => {
            r.populationLevel.needsMap.forEach(n => {
                this.consumedProducts.add(n.product);
            });

            r.allEffects.forEach((/** @type ResidenceEffect */ e) => {
                if (e.available() && (need == null || e.effectsPerNeed.has(need.guid)))
                    effects.add(e);
            });

            r.effectCoverage().forEach((/** @type ResidenceEffectCoverage */ c) => {
                var e = c.residenceEffect;
                if (aggregatesMap.has(e)) {
                    aggregatesMap.get(e).add(c);
                } else {
                    aggregatesMap.set(e, new ResidenceEffectAggregate(this.totalResidences, c));
                }
            })
        });

        this.allEffects = [...effects];        
        
        this.aggregates = ko.observableArray([]);
        aggregatesMap.forEach((a, e) => {
            a.finishInitialization();
            effects.delete(e);
            this.aggregates.push(a);
        });
        this.unusedEffects = ko.observableArray([...effects]);

        this.need = need;
        if (need instanceof PopulationNeed) {
            this.productionChain = new ProductionChainView(need.factory, need.amount);
        }

        this.sort();
        this.selectedEffect = ko.observable(this.unusedEffects()[0]);
        view.settings.language.subscribe(() => {
            this.sort();
        })
    }

    create() {
        var e = this.selectedEffect();
        var a = null;
        e.residences.forEach(r => {
            if (this.residences.indexOf(r) == -1)
                return;

            var c = new ResidenceEffectCoverage(r, e, this.percentCoverage() / 100);
            r.addEffectCoverage(c);

            if (a == null) {

                a = new ResidenceEffectAggregate(this.totalResidences, c);
            } else {
                a.add(c);
            }
        });

        if (a != null) {
            this.unusedEffects.remove(e);
            this.aggregates.push(a);
            this.sort();
        }
    }

    delete(aggregate) {
        aggregate.coverage.forEach(coverage => {
            coverage.residence.removeEffectCoverage(coverage);
        });

        this.unusedEffects.push(aggregate.residenceEffect);
        this.aggregates.remove(aggregate);
        this.sort();
        this.selectedEffect(aggregate.residenceEffect);
        this.percentCoverage(aggregate.coverage[0].coverage() * 100);
    }

    sort() {
        this.aggregates.sort((a, b) => a.residenceEffect.compare(b.residenceEffect));
        this.unusedEffects.sort((a, b) => a.compare(b));
    }

    applyConfigGlobally() {
        for (var isl of view.islands()) {
            // region is null for allIslands
            if (this.region && isl.region && this.region != isl.region)
                continue;

            for (var r of this.residences)
                if (isl.assetsMap.has(r.guid))
                    isl.assetsMap.get(r.guid).applyEffects(r.serializeEffects());

        }
    }
}

class Collapsible {
    constructor(id, collapsed) {
        this.id = id;
        this.collapsed = ko.observable(!!collapsed);
    }
}

export class CollapsibleStates {
    constructor() {
        this.key = "collapsibleStates";
        this.collapsibles = ko.observableArray([]);

        if (localStorage) {
            try {
                let json = JSON.parse(localStorage.getItem(this.key));
                for (var id in json)
                    this.collapsibles.push(new Collapsible(id, parseInt(json[id])))
            } catch (e) {
                console.error(e);
            }


            this.collapsiblesSubscription = ko.computed(() => {
                var json = {};
                for (var c of this.collapsibles())
                    json[c.id] = c.collapsed() ? 1 : 0;

                localStorage.setItem(this.key, JSON.stringify(json));
            });
        }
    }

    /**
     * 
     * @param {string} id
     * @param {boolean} collapsed
     * @returns {Collapsible}
     */
    get(id, collapsed) {
        for (var c of this.collapsibles())
            if (c.id == id)
                return c;

        var c = new Collapsible(id, collapsed);
        this.collapsibles.push(c);
        return c;
    }
}