// @ts-check
import { EPSILON, createFloatInput, NamedElement, Option } from './util.js'
import { Demand } from './production.js'
import { ResidenceBuilding } from './population.js';

var ko = require( "knockout" );



export class Need extends Demand {
    constructor(config, assetsMap) {
        super(config, assetsMap);
        this.isNeed = true;
    }

}

export class ResidenceNeed {
    /**
     * 
     * @param {ResidenceBuilding} residence 
     * @param {PopulationNeed} need 
     */
    constructor(residence, need) {
        this.residence = residence;
        this.need = need;
        
        this.substitution = ko.observable(0);
        this.fulfillment = ko.observable(this.need.checked() ? 1 : 0);

        if(this.need.amount){
            this.amount = ko.pureComputed(() => {
                var newspaper = (100 + window.view.newspaperConsumption.amount()) / 100;
                var total = this.residence.consumingLimit() * this.need.tpmin * newspaper;
                return total * (Math.max(0, this.fulfillment() - this.substitution()));
            });
        }

        this.need.addResidenceNeed(this);

        this.residentsPerHouse = ko.pureComputed(() => {
            var sum = this.residence.residentsPerNeed.get(this.need.guid) || 0;
            for (var c of this.residence.getConsumptionEntries(this.need)) {
                var coverage = c.residenceEffectCoverage.coverage();
                sum += coverage * (c.residenceEffectEntry.residents || 0);
            }
            return sum;
        });

        this.residents = ko.pureComputed(() => {
            var sum = this.residence.existingBuildings() * (this.residence.residentsPerNeed.get(this.need.guid) || 0);
            for (var c of this.residence.getConsumptionEntries(this.need)) {
                var coverage = c.residenceEffectCoverage.coverage();
                sum += Math.round(coverage * this.residence.existingBuildings()) *(c.residenceEffectEntry.residents || 0);
            }
            return Math.floor(sum * this.fulfillment());
        })
    }

    initDependencies(residenceNeedsMap){
        this.residenceNeedsMap = residenceNeedsMap;
        this.substitutionSubscription = ko.computed(() => {
            /** @type [ResidenceEffectEntryCoverage] */
            var arr = this.residence.getConsumptionEntries(this.need);
            if(arr == null)
                return; // no effect for this product
            
            var suppliedByFulfillment = 0;
            var modifier = 0;
            for (var c of arr){
                var coverage = c.residenceEffectCoverage.coverage();
                modifier += c.residenceEffectEntry.consumptionModifier * coverage;
                for (/** @type Product */var p of c.residenceEffectEntry.suppliedBy){
                    var n = this.residenceNeedsMap.get(p.guid);

                    if(n != null)
                        suppliedByFulfillment = Math.max(suppliedByFulfillment, coverage * n.fulfillment())
                }
            }

            this.substitution(Math.min(1, suppliedByFulfillment - modifier / 100));

            if (this.need.isInactive()) {
                this.fulfillment(0);
                return;
            }

            if (!this.need.banned()) {
                this.fulfillment(1);
                return;
            }

            this.fulfillment(suppliedByFulfillment);
        });

    }
}

export class PublicBuildingNeed extends Option {
    constructor(config, level, assetsMap) {
        super(config);

        this.level = level;

        this.checked(true);

        this.product = assetsMap.get(this.guid);
        if (!this.product)
            throw `No Product ${this.guid}`;

        PopulationNeed.prototype.initHidden.bind(this)(assetsMap);
        this.initBans = PopulationNeed.prototype.initBans;
    }
}

export class NoFactoryNeed extends PublicBuildingNeed {
    constructor(config, level, assetsMap) {
        super(config, level, assetsMap);
        this.level = level;
        this.isNoFactoryNeed = true;

        this.amount = ko.observable(0);
        if (this.factor == null)
            this.factor = 1;
       

        this.residentsInput = ko.pureComputed(() => {
            return this.amount() * this.residentsInputFactor;
        });

        PopulationNeed.prototype.initAggregation.bind(this)(assetsMap);

        this.product.addNeed(this);
    }
}

export class PopulationNeed extends Need {
    constructor(config, level, assetsMap) {
        super(config, assetsMap);
        this.level = level;

        this.residentsUnlockCondition = 0;
        if (this.unlockCondition && this.unlockCondition.populationLevel == level.guid)
            this.residentsUnlockCondition = this.unlockCondition.amount;

        this.initHidden(assetsMap);
        this.initAggregation(assetsMap);
    }

    initHidden(assetsMap){
        this.banned = ko.observable(false);
        this.isInactive = ko.observable(false);

        if (this.requiredBuildings) {
            this.residences = this.requiredBuildings.map(r => assetsMap.get(r));

            this.hidden = ko.computed(() => {
                if (!this.available())
                    return true;

                for (var r of this.residences)
                    if (r.existingBuildings() > 0 || this.level.residence == r)
                        return false;

                return true;
            });
        } else {
            this.hidden = ko.computed(() => !this.available());
            this.residences = this.level.allResidences;
        }

        this.residenceNeeds = ko.observableArray([]);

        this.addResidenceNeed = function (need) {
            this.residenceNeeds.push(need);
        }

        this.totalResidents = ko.pureComputed(() => {
            var sum = 0;
            for (var n of this.residenceNeeds()) {
                sum += n.residents();
            }

            return sum;
        });
    }

    initAggregation(assetsMap) {
        this.region = this.level.region;        

        this.checked = ko.observable(true);

        this.notes = ko.observable("");   


        this.residenceNeedsSubscription = ko.computed(() => {
            var sum = 0;
            for (var n of this.residenceNeeds())
                sum += n.amount();

            this.amount(sum);
        });


    }

    initBans(level, assetsMap) {
        if (this.unlockCondition) {
            var config = this.unlockCondition;
            this.locked = ko.computed(() => {
                if (!config || !view.settings.needUnlockConditions.checked())
                    return false;

                if (level.skyscraperLevels && level.hasSkyscrapers())
                    return false;

                if (config.populationLevel != level.guid) {
                    var l = assetsMap.get(config.populationLevel);
                    return l.residents() < config.amount;
                }

                if (level.residents() >= config.amount)
                    return false;

                var residence = level.residence.upgradedBuilding;
                while (residence) {
                    var l = residence.populationLevel;
                    var amount = l.residents();
                    if (amount > 0)
                        return false;

                    residence = residence.upgradedBuilding;
                }

                return true;
            }).extend({ deferred: true }); // deferred necessary for updating population level residents

            this.isInactive(this.locked());
            this.locked.subscribe(locked => this.isInactive(locked));
        }

        this.bannedSubscription = ko.computed(() => {
            var checked = this.checked();
            this.banned(!checked || this.locked && this.locked());
        });

    }

    updateAmount(population) { }
}

export class NewspaperNeedConsumption {
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
                sum += Math.ceil(effect.amount * (1 + parseInt(this.selectedBuff()) / 100));
            }

            return sum;
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

    apply() {
        
    }
}

export class NewspaperNeedConsumptionEntry extends Option {
    constructor(config) {
        super(config);

        this.lockDLCIfSet(this.checked);

        this.amount = config.articleEffects[0].ArticleValue;

        this.visible = ko.pureComputed(() => this.available())
    }
}

class ResidenceEffectEntry {
    constructor(config, assetsMap) {
        this.guid = parseInt(config.guid);
        this.product = assetsMap.get(this.guid);
        this.consumptionModifier = config.consumptionModifier;
        this.residents = config.residents;
        this.suppliedBy = config.suppliedBy.map(e => assetsMap.get(e));
    }
}

export class ResidenceEffect extends NamedElement {
    constructor(config, assetsMap) {
        super(config);
        this.entries = config.effects.map(e => new ResidenceEffectEntry(e, assetsMap));
        this.effectsPerNeed = new Map();

        for (var effect of this.entries) {
            this.effectsPerNeed.set(effect.guid, effect);
        }

        this.residences = [];
        for (var residence of config.residences) {
            let r = assetsMap.get(residence);
            this.residences.push(r);
            r.addEffect(this);
        }
    }

    /**
     * 
     * Expected usage: array.sort((a,b) => a.compare(b))
     * @param {ResidenceEffect} other
     */
    compare(other) {
        if (this.panoramaLevel != null && other.panoramaLevel != null)
            return 10 * (other.residences[0].populationLevel.guid - this.residences[0].populationLevel.guid) + other.panoramaLevel - this.panoramaLevel;

        if (this.panoramaLevel != null)
            return -1000;

        if (other.panoramaLevel != null)
            return 1000;

        return this.name().localeCompare(other.name());
    }
}

export class ResidenceEffectCoverage {
    /**
     * @param {ResidenceBuilding} residence
     * @param {ResidenceEffect} residenceEffect
     */
    constructor(residence, residenceEffect, coverage = 1) {
        this.residence = residence;
        this.residenceEffect = residenceEffect;
        this.coverage = ko.observable(coverage);
    }
}

export class ResidenceEffectEntryCoverage{
    /**
     * @param {ResidenceEffectCoverage} residenceEffectCoverage
     * @param {ResidenceEffectEntry} residenceEffectEntry
     */
        constructor(residenceEffectCoverage, residenceEffectEntry) {
        this.residenceEffectCoverage = residenceEffectCoverage;
        this.residenceEffectEntry = residenceEffectEntry;
    }

    getResidents() {
        return this.residenceEffectCoverage.coverage() * this.residenceEffectEntry.residents;
    }
}

export class RecipeList extends NamedElement {
    constructor(list, assetsMap, island) {
        super(list);

        this.island = island;

        if (list.region)
            this.region = assetsMap.get(list.region);

        this.recipeBuildings = list.recipeBuildings.map(r => {
            var a = assetsMap.get(r);
            a.recipeList = this;
            return a;
        });

        this.unusedRecipes = ko.computed(() => {
            var result = [];
            for (var recipe of this.recipeBuildings) {
                if (!recipe.existingBuildings())
                    result.push(recipe);
            }

            return result;
        });
        this.selectedRecipe = ko.observable(this.recipeBuildings[0]);

        this.canCreate = ko.pureComputed(() => {
            return this.unusedRecipes().length && this.selectedRecipe();
        });

        this.visible = ko.pureComputed(() => {
            if (!this.available())
                return false;

            return this.unusedRecipes().length != 0;
        });
    }

    create() {
        if (!this.canCreate())
            return;

        this.selectedRecipe().existingBuildings(1);
    }
}
