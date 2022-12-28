// @ts-check
import { ACCURACY, EPSILON, delayUpdate, createIntInput, createFloatInput, NamedElement } from './util.js'
import { MetaProduct, NoFactoryProduct, Product } from './production.js'
import { NoFactoryNeed, PopulationNeed, PublicBuildingNeed, ResidenceEffectCoverage, ResidenceEffectEntryCoverage, ResidenceNeed } from './consumption.js'
import { ResidenceEffectView} from './views.js'

var ko = require( "knockout" );

export class ResidenceBuilding extends NamedElement {
    constructor(config, assetsMap, island) {
        super(config);
        this.island = island;

        this.region = assetsMap.get(config.region)

        this.existingBuildings = createIntInput(0, 0);
        this.lockDLCIfSet(this.existingBuildings);

        this.allEffects = new Map();
        this.effectCoverage = ko.observableArray([]);
        this.panoramaCoverage = ko.pureComputed(() => {
            var sum = 0;
            for (/** @type ResidenceEffectCoverage */var effect of this.effectCoverage())
                if (effect.residenceEffect.panoramaLevel != null)
                    sum += effect.coverage();
            return sum;
        });

        this.residentsPerNeed = new Map();
        for (var guid in config.residentsPerNeed)
            this.residentsPerNeed.set(parseInt(guid), config.residentsPerNeed[guid]);

        this.entryCoveragePerProduct = ko.pureComputed(() => {
            var result = new Map();
            for (var coverage of this.effectCoverage())
                for (/** @type {ResidenceEffectCoverage} */var entry of coverage.residenceEffect.entries){
                    if(result.has(entry.product))
                        result.get(entry.product).push(new ResidenceEffectEntryCoverage(coverage, entry))
                    else
                        result.set(entry.product, [new ResidenceEffectEntryCoverage(coverage, entry)])
                }

            return result;
        });
        
        this.consumingLimit = null;
        this.needsMap = null;
        this.residenceNeedsMap = null;
        this.residents = ko.observable(0);
    }

    initializeNeeds(needsMap){
        this.needsMap = needsMap;
        this.consumingLimit = ko.pureComputed(() => {
            var sum = 0;
            for (var n of this.needsMap.values()){
                if(!n.available() || n.excludePopulationFromMoneyAndConsumptionCalculation)
                    continue;

                sum += this.existingBuildings() * (this.residentsPerNeed.get(n.guid) || 0);
                

                for (/** @type [ResidenceEffectEntryCoverage] */ const entry of this.getConsumptionEntries(n))
                    sum += this.existingBuildings() * entry.getResidents();

            }

            return sum;
        });

        this.residenceNeedsMap = new Map();
        this.residentsPerNeed.forEach((_, guid) => {
            var n = this.needsMap.get(guid); // some residence needs come from buff but have no need in population level
            if(n)
                this.residenceNeedsMap.set(guid, new ResidenceNeed(this, n));
        });

        this.residenceNeedsMap.forEach(n => n.initDependencies(this.residenceNeedsMap));
        this.residentsSubscription = ko.computed(() => {
            var sum = 0;
            for (var n of this.residenceNeedsMap.values()) {
                if (!n.residents)
                    console.log(n);
                sum += n.residents();
            }

            this.residents(sum);
        });
    }

    addEffect(effect) {
        this.allEffects.set(effect.guid, effect);
    }

    addEffectCoverage(effectCoverage) {
        this.effectCoverage.push(effectCoverage);
        this.sortEffectCoverage();
    }

    removeEffectCoverage(effectCoverage) {
        this.effectCoverage.remove(effectCoverage);
    }

    sortEffectCoverage() {
        this.effectCoverage.sort((a, b) => a.residenceEffect.compare(b.residenceEffect));
    }


    getNoConsumptionResidents() {
        var residents = 0;

        for (var [guid, res] of this.residentsPerNeed) {
            var need = this.populationLevel.needsMap.get(guid);
            if (need && need.available() &&
                need.excludePopulationFromMoneyAndConsumptionCalculation &&
                (need.requiredBuildings == null || need.requiredBuildings.indexOf(this.guid) != -1))
                residents += res;
        }

        return residents * this.existingBuildings();
    }

    /**
     * @param {Product|ResidenceNeed|Need } need
     * @returns {[ResidenceEffectEntryCoverage]}
     */
    getConsumptionEntries(need) {
        if (!(need instanceof Product)) {
            if (need instanceof ResidenceNeed)
                need = need.need;

            need = need.product;
        }

        return this.entryCoveragePerProduct().get(need) || [];
    }

    serializeEffects() {
        var coverageMap = {};
        for (var coverage of this.effectCoverage())
            coverageMap[coverage.residenceEffect.guid] = coverage.coverage();

        return coverageMap;
    }

    applyEffects(json) {
        var coverage = [];
        for (var guid in json) {
            var e = this.allEffects.get(parseInt(guid));

            if (e == null)
                continue;

            coverage.push(new ResidenceEffectCoverage(this, e, parseFloat(json[guid])));
        }
        this.effectCoverage.removeAll();
        this.effectCoverage(coverage);
        this.sortEffectCoverage();
    }

    prepareResidenceEffectView() {
        view.selectedResidenceEffectView(new ResidenceEffectView([this], this.name));
    }
}

export class PopulationLevel extends NamedElement {
    constructor(config, assetsMap, island) {
        super(config);
        this.island = island

        this.hotkey = ko.observable(null);

        this.needs = [];
        this.buildingNeeds = [];
        this.basicNeeds = [];
        this.luxuryNeeds = [];
        this.lifestyleNeeds = [];
        this.needsMap = new Map();
        this.region = assetsMap.get(config.region);

        this.allResidences = [];
        this.notes = ko.observable("");

        if (this.residence) {
            this.residence = assetsMap.get(this.residence);
            this.residence.populationLevel = this;
            this.allResidences.push(this.residence);
        }

        if (config.skyscraperLevels) {
            this.skyscraperLevels = config.skyscraperLevels.map(l => assetsMap.get(l));
            this.skyscraperLevels.forEach(l => l.populationLevel = this);
            this.allResidences = this.allResidences.concat(this.skyscraperLevels);
        }
        if (config.specialResidence) {
            this.specialResidence = assetsMap.get(config.specialResidence);
            this.specialResidence.populationLevel = this;
            this.allResidences.push(this.specialResidence);
        }
        this.availableResidences = ko.pureComputed(() => this.allResidences.filter(r => r.available()));

        this.canEdit = ko.pureComputed(() => {
            for (var i = 1; i < this.allResidences.length; i++)
                if (this.allResidences[i].existingBuildings() > 0)
                    return false;

            return true;
        });


        this.existingBuildings = ko.pureComputed({
            read: () => {
                var sum = 0;
                for (var r of this.allResidences)
                    sum += r.existingBuildings();

                return sum;
            },

            write: val => {
                if(this.canEdit())
                   this.residence.existingBuildings(val);
            }
        });

        
        config.needs.forEach(n => {
            var need;
            var product = assetsMap.get(n.guid);

            if (n.tpmin > 0 && product && !(product instanceof MetaProduct)) {
                need = product instanceof NoFactoryProduct ? new NoFactoryNeed(n, this, assetsMap) : new PopulationNeed(n, this, assetsMap);
                this.needs.push(need);
            } else {
                need = new PublicBuildingNeed(n, this, assetsMap);
                this.buildingNeeds.push(need);
            }

            if (n.isBonusNeed || n.excludePopulationFromMoneyAndConsumptionCalculation) {
                need.checked(false);
                for (var dlc of (need.dlcs || []))
                    dlc.checked.subscribe(checked => {
                        if (!checked)
                            need.checked(false);
                    });

                this.lifestyleNeeds.push(need);
                this.needsMap.set(need.guid, need);
                return;
            }

            if (n.residents || n.requiredFloorLevel)
                this.basicNeeds.push(need);
            else
                this.luxuryNeeds.push(need);
            this.needsMap.set(need.guid, need);
        });

        this.hasBonusNeeds = ko.pureComputed(() => {
            for (var n of this.lifestyleNeeds || [])
                if (!n.hidden())
                    return true;

            return false;
        });

        this.allResidences.forEach(r => r.initializeNeeds(this.needsMap));
        this.residents = ko.pureComputed(() => {
            var sum = 0;
            for (var r of this.allResidences)
                sum += r.residents();

            return sum;
        });
        this.residentsInput = ko.pureComputed({
            read: () => formatNumber(this.residents()),
            write: val => {
                val = parseInt(val.replace(/[^\d]/g, ""));
                if (!this.canEdit() || !isFinite(val) || val < 0) {
                    this.residentsInput.notifySubscribers();
                    return;
                }
                
                var perHouse = 0;

                for (var n of this.residence.residenceNeedsMap.values()) {
                    if (n.need.residentsUnlockCondition && val < n.need.residentsUnlockCondition)
                        continue;

                    var fulfillment = n.need.checked() ? 1 : n.substitution();

                    perHouse += fulfillment * this.residence.residentsPerNeed.get(n.need.guid);
                    for (var c of this.residence.getConsumptionEntries(n)) {
                        var coverage = c.residenceEffectCoverage.coverage();
                        perHouse += coverage * fulfillment * (c.residenceEffectEntry.residents || 0);
                    }
                }

                var buildings = Math.round(val / perHouse);
                if (buildings !== this.residence.existingBuildings())
                    this.residence.existingBuildings(buildings);
                else
                    this.residentsInput.notifySubscribers();
            }
        }).extend({ deferred: true }); // deferred necessary for updating population level residents

        if (this.skyscraperLevels || this.specialResidence) {
            // ensure that the value for the population level and those summed over the buildings match
            // the observables are only used for change propagation, the up-to-date values are available via the functions
            this.getFloorsSummedExistingBuildings = () => {
                var specialResidence = this.specialResidence ? this.specialResidence.existingBuildings() : 0;
                var levelSum = this.skyscraperLevels ? this.skyscraperLevels.map(s => s.existingBuildings()).reduce((a, b) => a + b) : 0;
                return specialResidence + levelSum;
            };
            this.floorsSummedExistingBuildings = ko.computed(() => this.getFloorsSummedExistingBuildings());

            this.hasSkyscrapers = () => this.getFloorsSummedExistingBuildings() ;

 
            this.canEditPerHouse = ko.pureComputed(() => {
                return !this.hasSkyscrapers() && !(this.specialResidence && this.specialResidence.existingBuildings());
            });
        } else {
            this.hasSkyscrapers = () => false;

            this.canEditPerHouse = ko.pureComputed(() => {
                return true;
            });
        }

        this.visible = ko.pureComputed(() => {
            if (!this.available())
                return false;

            if (!view.island || !view.island())
                return true;

            var region = view.island().region;
            if (!region)
                return true;

            return this.region === region;
        });
    }

    initBans(assetsMap) {
        for (var n of this.needs.concat(this.buildingNeeds))
            n.initBans(this, assetsMap);
    }

    getNoConsumptionResidents() {
        var residents = 0;
        for (var r of this.allResidences)
            residents += r.getNoConsumptionResidents();

        return residents;
    }

    incrementAmount() {
        this.residents(parseFloat(this.residents()) + 1);
    }

    decrementAmount() {
        this.residents(parseFloat(this.residents()) - 1);
    }

    applyConfigGlobally() {
        for (var isl of view.islands()) {
            // region is null for allIslands
            if (this.region && isl.region && this.region != isl.region)
                continue;

            var other = isl.assetsMap.get(this.guid);

            for (var r of this.allResidences)
                if (isl.assetsMap.has(r.guid))
                    isl.assetsMap.get(r.guid).applyEffects(r.serializeEffects());

            for (var guid of this.needsMap.keys())
                other.needsMap.get(guid).checked(this.needsMap.get(guid).checked());

        }
    }

    prepareResidenceEffectView(need = null) {
        var heading = this.name;
        if (need)
            heading = ko.pureComputed(() => this.name() + ": " + need.product.name());
        view.selectedResidenceEffectView(new ResidenceEffectView(this.allResidences, heading, need));
    }
}

export class CommuterWorkforce extends NamedElement {
    constructor(config, session) {
        super(config);

        this.session = session;

        this.amount = ko.pureComputed(() => {
            var amount = 0;

            for (var isl of this.session.islands()) {
                if (isl.commuterPier.checked())
                    amount += isl.assetsMap.get(this.guid).amount();
            }

            return amount;
        });

        this.visible = ko.pureComputed(() => {
            if (!this.available())
                return false;

            return this.amount() != 0;
        });
    }
}

export class Workforce extends NamedElement {
    constructor(config, assetsMap) {
        super(config);
        this.demands = ko.observableArray([]);

        this.amount = ko.pureComputed(() => {
            var sum = 0;
            for (var d of this.demands())
                sum += d.amount();

            return sum;
        });

        this.visible = ko.pureComputed(() => {
            if (!this.available())
                return false;

            return this.amount() != 0;
        });
    }



    add(demand) {
        this.demands.push(demand);
    }

    remove(demand){
        this.demands.remove(demand);
    }
}

export class WorkforceDemand extends NamedElement {
    constructor(config) {
        super(config);
        this.buildings = 0;

        this.amount = ko.observable(0);
        this.percentBoost = createIntInput(100, 0);
        this.percentBoost.subscribe(val => {
            this.updateAmount(this.buildings);
        });

        /** @type KnockoutObservable<Workforce> */
        this.workforce = ko.observable(config.workforce);
        this.defaultWorkforce = config.workforce;
        this.workforce().add(this);

    }

    /**
     * 
     * @param {Workforce|null} workforce 
     */
    updateWorkforce(workforce = null){
        if(workforce == null)
            workforce = this.defaultWorkforce;

        if (workforce !== this.workforce()){
            this.workforce().remove(this);
            this.workforce(workforce);
            this.workforce().add(this);
        }
    }

    updateAmount(buildings) {
        this.buildings = buildings;

        var perBuilding = Math.ceil(this.Amount * this.percentBoost() / 100);
        this.amount(Math.ceil(buildings) * perBuilding);
    }
}

