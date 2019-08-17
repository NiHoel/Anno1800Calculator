products = new Map();
assetsMap = new Map();
view = {
    regions: [],
    populationLevels: [],
    factories: [],
    categories: [],
    workforce: [],
    buildingMaterialsNeeds: [],
    multiFactoryProducts: [],
    items: [],
    settings: {
        language: ko.observable(navigator.language.startsWith("de") ? "german" : "english")
    },
    texts: {}
};


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

class Factory extends NamedElement {
    constructor(config) {
        super(config);

        if (config.region)
            this.region = assetsMap.get(config.region);

        this.amount = ko.observable(0);
        this.extraAmount = ko.observable(0);
 
        this.percentBoost = ko.observable(100);
        this.boost = ko.computed(() => parseInt(this.percentBoost()) / 100);
        this.demands = new Set();
        this.buildings = ko.computed(() => Math.max(0,parseFloat(this.amount()) + parseFloat(this.extraAmount())) / this.tpmin / this.boost());
        this.existingBuildings = ko.observable(0);
        this.items = [];

        this.workforceDemand = this.getWorkforceDemand();
        this.buildings.subscribe(val => this.workforceDemand.updateAmount(val));
    }

    getInputs() {
        return this.inputs || [];
    }

    getOutputs() {
        return this.outputs || [];
    }

    referenceProducts() {
        this.getInputs().forEach(i => i.product = assetsMap.get(i.Product));
        this.getOutputs().forEach(i => i.product = assetsMap.get(i.Product));

        this.product = this.getProduct();
        if (!this.icon)
            this.icon = this.product.icon;

        this.extraDemand = new Demand({ guid: this.getOutputs()[0].Product});
        this.extraAmount.subscribe(val => {
            val = parseFloat(val);
            if (isNaN(val))
                this.extraAmount(0);
                val = 0;
            let amount = parseFloat(this.amount());
            if (val < -amount)
                this.extraAmount(-amount);
            else
                this.extraDemand.updateAmount(val);
        });
        this.extraDemand.updateAmount(parseFloat(this.extraAmount()));
    }

    getProduct() {
        return this.getOutputs()[0].product;
    }

    getWorkforceDemand() {
        for (let m of this.maintenances) {
            let a = assetsMap.get(m.Product);
            if (a instanceof Workforce)
                return new WorkforceDemand($.extend({ factory: this, workforce: a }, m));
        }
    }

    getRegionExtendedName() {
        if (!this.region || this.product.factories.length <= 1)
            return this.name;

        return `${this.name()} (${this.region.name()})`;
    }

    updateAmount() {
        var sum = 0;
        this.demands.forEach(d => sum += d.amount());
        if (sum < 0)
            this.extraAmount(this.extraAmount() - sum);
        else 
            this.amount(sum - this.extraAmount());
        
    }


    add(demand) {
        this.demands.add(demand);
        this.updateAmount();
    }

    remove(demand) {
        this.demands.delete(demand);
        this.updateAmount();
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
}

class Product extends NamedElement {
    constructor(config) {
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
    constructor(config) {
        super(config);

        this.amount = ko.observable(0);

        this.product = assetsMap.get(this.guid);
        this.factory = ko.observable(config.factory);

        if (this.product) {
            this.updateFixedProductFactory(this.product.fixedFactory());
            this.product.fixedFactory.subscribe(f => this.updateFixedProductFactory(f));
            if (this.consumer)
                this.consumer.factory.subscribe(() => this.updateFixedProductFactory(this.product.fixedFactory()));

            this.demands = this.factory().getInputs().map(input => {
                var d;
                let items = this.factory().items.filter(item => item.replacements.has(input.Product));
                if (items.length)
                    d = new DemandSwitch(this, input, items);
                else
                    d = new Demand({ guid: input.Product, consumer: this });

                this.amount.subscribe(val => d.updateAmount(val * input.Amount));
                return d;
            });


            this.amount.subscribe(val => {
                this.factory().updateAmount();
            });

            this.buildings = ko.computed(() => parseFloat(this.amount()) / this.factory().tpmin / this.factory().boost());
        }
    }

    updateFixedProductFactory(f) {
        if (f == null) {
            if (this.consumer) { // find factory in the same region as consumer
                let region = this.consumer.factory().region;
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

class DemandSwitch {
    constructor(consumer, input, items) {
        this.items = items;

        this.demands = [ // use array index to toggle
            new Demand({ guid: input.Product, consumer: consumer }),
            new Demand({ guid: items[0].replacements.get(input.Product), consumer: consumer })
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

class Need extends Demand {
    constructor(config) {
        super(config);
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
    constructor(config) {
        super(config);

        this.inhabitants = 0;

        this.percentBoost = ko.observable(100);
        this.percentBoost.subscribe(val => {
            val = parseInt(val);
            if (val < 1)
                this.percentBoost(1);
        })
        this.boost = ko.computed(() => parseInt(this.percentBoost()) / 100);
        this.boost.subscribe(() => this.updateAmount(this.inhabitants));

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

    updateAmount(inhabitants) {
        this.inhabitants = inhabitants;
        this.optionalAmount(this.tpmin * inhabitants * this.boost());
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
    constructor(config) {
        super(config);

        this.product = config.product;
        this.factory(config.factory);

        this.factory().add(this);
    }

    updateAmount() {
        var otherDemand = 0;
        this.factory().demands.forEach(d => otherDemand += d == this ? 0 : d.amount());
        var overProduction = this.factory().existingBuildings() * this.factory().tpmin * this.factory().boost() - otherDemand;
        this.amount(Math.max(0, overProduction));
    }

    updateFixedProductFactory() { }
}

class PopulationLevel extends NamedElement {
    constructor(config) {
        super(config);
        this.amount = ko.observable(0);
        this.noOptionalNeeds = ko.observable(false);
        this.needs = [];
        config.needs.forEach(n => {
            if (n.tpmin > 0)
                this.needs.push(new PopulationNeed(n));
        });
        this.amount.subscribe(val => this.needs.forEach(n => n.updateAmount(parseInt(val))));
    }

    incrementAmount() {
        this.amount(parseFloat(this.amount()) + 1);
    }

    decrementAmount() {
        this.amount(parseFloat(this.amount()) - 1);
    }
}

class ProductCategory extends NamedElement {
    constructor(config) {
        super(config);
        this.products = config.products.map(p => assetsMap.get(p));
    }
}

class Workforce extends NamedElement {
    constructor(config) {
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
    constructor(config) {
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
    constructor(config) {
        super(config);
        this.replacements = new Map();
        this.replacementArray = [];

        if (this.replaceInputs)
            this.replaceInputs.forEach(r => {
                this.replacementArray.push({
                    old: assetsMap.get(r.OldInput),
                    new: assetsMap.get(r.NewInput)
                });
                this.replacements.set(r.OldInput, r.NewInput);
            });

        this.factories = this.factories.map(f => assetsMap.get(f)); 
    }
}

function reset() {
    assetsMap.forEach(a => {
        if (a instanceof Product)
            a.fixedFactory(null);
        if (a instanceof Factory) {
            a.percentBoost(100);
            a.extraAmount(0);
        }
        if (a instanceof Factory)
            a.existingBuildings(0);
        if (a instanceof PopulationLevel)
            a.amount(0);
        if (a instanceof Item)
            a.checked(false);
    });

    view.buildingMaterialsNeeds.forEach(b => b.factory().buildings(0));
    view.populationLevels.forEach(l => l.needs.forEach(n => {
        if (n.checked)
            n.checked(true);
        if (n.percentBoost)
            n.percentBoost(100);
    }));
}

function init() {


    for (let attr in texts) {
        view.texts[attr] = new NamedElement({ name: attr, locaText: texts[attr] });
    }

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

    for (let region of params.regions) {
        let r = new Region(region);
        assetsMap.set(r.guid, r);
        view.regions.push(r);
    }

    for (let workforce of params.workforce) {
        let w = new Workforce(workforce)
        assetsMap.set(w.guid, w);
        view.workforce.push(w);
    }

    for (let factory of params.factories) {
        let f = new Factory(factory)
        assetsMap.set(f.guid, f);
        view.factories.push(f);

        if (localStorage) {
            {
                let id = f.guid + ".percentBoost";
                if (localStorage.getItem(id))
                    f.percentBoost(parseInt(localStorage.getItem(id)));

                f.percentBoost.subscribe(val => localStorage.setItem(id, val));
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
            let p = new Product(product);

            products.push(p);
            assetsMap.set(p.guid, p);

            if (p.factories.length > 1)
                view.multiFactoryProducts.push(p);

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
        }
    }

    view.factories.forEach(f => f.referenceProducts());

    for (let item of (params.items || [])) {
        let i = new Item(item);
        assetsMap.set(i.guid, i);
        view.items.push(i);

        i.factories.forEach(f => f.items.push(i));

        if (localStorage) {
            let id = i.guid + ".checked";
            if (localStorage.getItem(id))
                i.checked(parseInt(localStorage.getItem(id)));

            i.checked.subscribe(val => localStorage.setItem(id, val ? 1 : 0));
        }
    }

    for (let level of params.populationLevels) {
        let l = new PopulationLevel(level)
        assetsMap.set(l.guid, l);
        view.populationLevels.push(l);

        if (localStorage) {
            let id = l.guid + ".amount";
            if (localStorage.getItem(id))
                l.amount(parseInt(localStorage.getItem(id)));

            l.amount.subscribe(val => localStorage.setItem(id, val));
        }

        for (let n of l.needs) {
            if (localStorage) {
                let id = `${l.guid}[${n.guid}].checked`;
                if (localStorage.getItem(id))
                    n.checked(parseInt(localStorage.getItem(id)))

                n.checked.subscribe(val => localStorage.setItem(id, val ? 1 : 0));

                id = `${l.guid}[${n.guid}].percentBoost`;
                if (localStorage.getItem(id)) 
                    n.percentBoost(parseInt(localStorage.getItem(id)));

                n.percentBoost.subscribe(val => localStorage.setItem(id, val));

            }

        }
    }

    for (category of params.productFilter) {
        let c = new ProductCategory(category);
        assetsMap.set(c.guid, c);
        view.categories.push(c);
    }

    for (let p of view.categories[1].products) {
        for (let b of p.factories) {
            if (b) {
                b.editable = true;
                let n = new BuildingMaterialsNeed({ guid: p.guid, factory: b, product: p });
                b.boost.subscribe(() => n.updateAmount());
                b.existingBuildings.subscribe(() => n.updateAmount());
                view.buildingMaterialsNeeds.push(n);

                if (localStorage) {
                    let oldId = b.guid + ".buildings";
                    let id = b.guid + ".existingBuildings"
                    if (localStorage.getItem(id) || localStorage.getItem(oldId))
                        b.existingBuildings(parseInt(localStorage.getItem(id) || localStorage.getItem(oldId)));

                    b.existingBuildings.subscribe(val => localStorage.setItem(id, val));
                }
            }
        }
    }

    
    ko.applyBindings(view, $(document.body)[0]);

    // negative extra amount must be set after the demands of the population are generated
    // otherwise it would be set to zero
    for (let f of view.factories) {
       
        if (localStorage) {
                let id = f.guid + ".extraAmount";
                if (localStorage.getItem(id)) {
                    f.extraAmount(parseFloat(localStorage.getItem(id)));
                }
                f.extraAmount.subscribe(val => localStorage.setItem(id, val));
        }
    }

    var keyBindings = ko.computed(() => {
        var bindings = new Map();

        for (var l of view.populationLevels) {
            for (var c of l.name().toLowerCase()) {
                if (!bindings.has(c)) {
                    bindings.set(c, $(`.ui-race-unit-name[race-unit-name=${l.name()}] ~ .input .input-group input`));
                    break;
                }
            }
        }

        return bindings;
    })

    $(document).on("keydown", (evt) => {
        if (evt.altKey || evt.ctrlKey || evt.shiftKey)
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
}

function removeSpaces(string) {
    if (typeof string === "function")
        string = string();
    return string.replace(/\W/g, "");
}

$(document).ready(function () {
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
    })
})

texts = {
    inhabitants: {
        english: "Inhabitants",
        german: "Bevölkerung"
    },
    workforce: {
        english: "Required Workforce",
        german: "Benötigte Arbeitskraft"
    },
    productionBoost: {
        english: "Production Boost",
        german: "Produktionsboost"
    },
    requiredNumberOfBuildings: {
        english: "Required Number of Buildings",
        german: "Benötigte Anzahl an Gebäuden"
    },
    existingNumberOfBuildings: {
        english: "Existing Number of Buildings",
        german: "Vorhandene Anzahl an Gebäuden"
    },
    existingNumberOfBuildingsIs: {
        english: "Is:",
        german: "Ist:"
    },
    requiredNumberOfBuildings: {
        english: "Required:",
        german: "Benötigt:"
    },
    requiredNumberOfBuildingsDescription: {
        english: "Required number of buildings to produce consumer products",
        german: "Benötigte Gebäudeanzahl zur Produktion von Verbrauchsgütern"
    },
    tonsPerMinute: {
        english: "Production in Tons per Minute",
        german: "Produktion in Tonnen pro Minute"
    },
    language: {
        english: "Language",
        german: "Sprache"
    },
    settings: {
        english: "Settings",
        german: "Einstellungen"
    },
    help: {
        english: "Help",
        german: "Hilfe"
    },
    chooseFactories: {
        english: "Modify Production Chains",
        german: "Modifiziere Produktionsketten"
    },
    noFixedFactory: {
        english: "Automatic: same region as consumer",
        german: "Automatisch: gleichen Region wie Verbraucher"
    },
    consumptionModifier: {
        english: "Modify the percental amount of consumption for this tier and product",
        german: "Verändere die prozentuale Verbrauchsmenge für diese Ware und Bevölkerungsstufe"
    },
    helpContent: {
        german:
            `Verwendung: Trage die aktuellen oder angestrebten Einwohner pro Stufe in die oberste Reihe ein. Die Produktionsketten aktualisieren sich automatisch sobald man die Eingabe verlässt. Es werden nur diejenigen Fabriken angezeigt, die benötigt werden.

In der darunterliegenden Reihe wird die Arbeitskraft angezeigt, die benötigt wird, um alle Gebäude zu betreiben (jeweils auf die nächste ganze Fabrik gerundet).

Danach folgen zwei große Abschnitte, die sich wiederum in Unterabschnitte unterteilen. Der erste gibt einen Überblick über alle benötigten Gebäude, sortiert nach dem produzierten Warentyp. Der zweite schlüsselt die einzelnen Produktionsketten nach Bevölkerungsstufen auf. Jeder der Abschnitte kann durch einen Klick auf die Überschrift zusammengeklappt werden. Durch das Abwählen des Kontrollkästchens wird das entsprechende Bedürfnis von der Berechnung ausgenommen.

In jeder Kachel wird der Name der Fabrik, das Icon der hergestellten Ware, der Boost für den Gebäudetyp, die Anzahl der benötigten Gebäude und die Produktionsrate in Tonnen pro Minute angezeigt. Die Anzahl der Gebäude wird mit zwei Nachkommastellen angezeigt, um die Höhe der Überkapazitäten direkt ablesen zu können. Daneben befinden sich zwei Buttons. Diese versuchen den Boost so einzustellen, dass alle Gebäude des Typs bestmöglich ausgelastet sind und dabei ein Gebäude mehr (+) bzw. eines weniger (-) benötigt wird.

Da Baumaterialien sich Zwischenmaterialien mit Konsumgütern teilen sind sie (im Gegensatz zu Warenrechnern früherer Annos) mit aufgeführt, um so den Verbrauch von Minen besser planen zu können. Es muss die Anzahl der Endbetriebe per Hand eingegeben werden.

Über das Zahnrad am rechten oberen Bildschirmrand gelangt man zu den Einstellungen. Dort können die Sprache ausgewählt und die Menge der dargestellten Informationen angepasst werden.

Über die drei Zahnräder neben dem Einstellungsdialog öffnet sich der Dialog zur Modifikation der Produktionsketten. In der oberen Hälfte kann die Fabrik ausgewählt werden, die die dargestellte Ware herstellen soll. In der unter Hälfte können Spezialisten aktiviert werden, welche die Eingangswaren der Fabriken verändern. Standardmäßig ist die Gleiche-Region-Regel eingestellt. Exemplarisch besagt diese, dass das Holz für die Destillerien in der Neuen Welt, das Holz für Nähmaschinen aber in der Alten Welt produziert wird.

Durch Eingabe des ersten (bzw. zweiten - bei Uneindeutigkeiten) Buchstaben des Bevölkerungsnames wird das zugehörige Eingabefeld fokussiert. Die Anzahl dort kann ebenfalls durch Drücken der Pfeiltasten erhöht und verringert werden.

Haftungsausschluss:
Der Warenrechner wird ohne irgendeine Gewährleistung zur Verfügung gestellt. Die Arbeit wurde in KEINER Weise von Ubisoft Blue Byte unterstützt. Alle Assets aus dem Spiel Anno 1800 sind © by Ubisoft.
Dies sind insbesondere, aber nicht ausschließlich alle Icons der Bevölkerung, Waren und Gegenstände sowie die Daten der Produktionsketten und die Verbrachswerte der Bevölkerung.

Diese Software steht unter der MIT-Lizenz.


Autor:
Nico Höllerich

Fehler und Verbesserungen:
Falls Sie auf Fehler oder Unannehmlichkeiten stoßen oder Verbesserungen vorschlagen möchten, erstellen Sie ein Issue auf Github (https://github.com/NiHoel/Anno1800Calculator/issues)`,

        english:
            `Usage: Enter the current or desired number of inhabitants per level into the top most row. The production chains will update automatically when one leaves the input field. Only the required factories are displayed. 

The row below displays the workforce that is required to run all buildings (rounded towards the next complete factory).

Afterwards two big sections follow that are subdivided into smaller sections. The first one gives an overview of the required buildings sorted by the type of good that is produced. The second one lists the individual production chains for each population level. Clicking the heading collapses each section. Deselecting the checkbox leads to the need being excluded from the calculation.

Each card displays the name of the factory, the icon of the produced good, the boost for the given type of building, the number of required buildings, and the production rate in tons per minute. The number of buildings has two decimal places to directly show the amount of overcapacities. There are two buttons next to it. Those try to adjust the boost such that all buildings operate at full capacity and one more (+) or one building less (-) is required.

Since construction materials share intermediate products with consumables they are explicitly listed (unlike in calculators for previous Annos) to better plan the production of mines. The number of factories must be entered manually.

When clicking on the cog wheel in the upper right corner of the screen the settings dialog opens. There, one can chose the language and customize the information presented by the calculator.

The three cog wheels next to the settings dialog open a dialog to modify the production chains. In the upper part, the factory can be chosen to produce the noted product. In the lower part, specialists that change the input for factories can be applied. By default, the same region policy is selected. By example, this means that the wood for desitilleries is produced in the New World while the wood for sewing machines is produced in the Old World.

Press the key corresponding to the first (or second in case of ambiguities) letter of the name of a population level to focus the input field. There, one can use the arrow keys to inc-/decrement the number.

Disclaimer: 
The calculator is provided without warranty of any kind. The work was NOT endorsed by Ubisoft Blue Byte in any kind. All the assets from Anno 1800 game are © by Ubsioft.
These are especially but not exclusively all the icons of population, goods and items and the data of production chains and the consumptions values of population.

This software is under the MIT license.


Author:
Nico Höllerich

Bugs and improvements:
If you encounter any bugs or inconveniences or if you want to suggest improvements, create an Issue on Github (https://github.com/NiHoel/Anno1800Calculator/issues)`
    }
}

options = {
    "noOptionalNeeds": {
        "name": "Do not produce luxury goods",
        "locaText": {
            "english": "Do not produce luxury goods",
            "german": "Keine Luxusgüter produzieren"
        }
    },
    "decimalsForBuildings": {
        "name": "Show number of buildings with decimals",
        "locaText": {
            "english": "Show number of buildings with decimals",
            "german": "Zeige Nachkommastellen bei der Gebäudeanzahl"
        }
    },
    "missingBuildingsHighlight": {
        "name": "Highlight missing buildings",
        "locaText": {
            "english": "Highlight missing buildings",
            "german": "Fehlende Gebäude hervorheben"
        }
    },
    "additionalProduction": {
        "name": "Show input field for additional production",
        "locaText": {
            "english": "Show input field for additional production (negative values possible)",
            "german": "Zeige Eingabefeld für Zusatzproduktion (negative Werte möglich)"
        }
    },
    "consumptionModifier": {
        "name": "Show input field for percental consumption modification",
        "locaText": {
            "english": "Show input field for percental consumption modification",
            "german": "Zeige Eingabefeld für prozentuale Änderung des Warenverbrauchs"
        }
    },
    "hideNames": {
        "name": "Hide the names of products, factories, and population levels",
        "locaText": {
            "english": "Hide the names of products, factories, and population levels",
            "german": "Verberge die Namen von Produkten, Fabriken und Bevölkerungsstufen"
        }
    },
    "hideProductionBoost": {
        "name": "Hide the input fields for production boost",
        "locaText": {
            "english": "Hide the input fields for production boost",
            "german": "Verberge das Eingabefelder für Produktionsboosts"
        }
    },
    "hideNewWorldConstructionMaterial": {
        "name": "Hide factory cards for construction material that produce in the new world",
        "locaText": {
            "english": "Hide factory cards for construction material that is produced in the New world",
            "german": "Verberge die Fabrikkacheln für Baumaterial, das in der Neuen Welt produziert wird"
        }
    }
}
