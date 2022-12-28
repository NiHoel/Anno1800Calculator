import { ACCURACY, isPreview, formatNumber, formatPercentage, versionCalculator, NamedElement, Option, DLC } from './util.js'
import { languageCodes, texts as locaTexts, options, serverOptions } from './i18n.js'


import { PopulationLevel, ResidenceBuilding } from './population.js'
import { NewspaperNeedConsumption, NewspaperNeedConsumptionEntry } from './consumption.js'
import { Consumer } from './factories.js'
import { NPCTrader, ContractUpgradeManager, TradeManager, ContractCreatorFactory } from './trade.js'
import { Region, Session, IslandManager } from './world.js'
import { DarkMode, ViewMode, Template, ProductionChainView, ResidenceEffectView, CollapsibleStates } from './views.js'


import './components.js'
import './params.js'

var ko = require("knockout");
require("knockout-amd-helpers");

// @ts-check

var moduleContext = require.context(".", true);
var templateContext = require.context("../templates", true);

ko.bindingHandlers.module.loader = function (moduleName, done) {
    var mod = moduleContext("./" + moduleName);
    done(mod);
}

ko.amdTemplateEngine.defaultSuffix = ".html";
ko.amdTemplateEngine.loader = function (templateName, done) {
    var template = templateContext("./" + templateName + ko.amdTemplateEngine.defaultSuffix);
    done(template.default);
}

window.ACCURACY = ACCURACY;
window.formatNumber = formatNumber;
window.formatPercentage = formatPercentage;
window.factoryReset = factoryReset;
window.exportConfig = exportConfig;

window.view = {
    settings: {
        language: ko.observable("english")
    },
    texts: {},
    dlcs: [],
    dlcsMap: new Map()
};

for (var code in languageCodes)
    if (navigator.language.startsWith(code))
        view.settings.language(languageCodes[code]);

// called after initialization
// checks if loaded config is old and applies upgrade
function configUpgrade(configVersion) {
    if (configVersion == null)
        configVersion = "v1.0";

    try {
        configVersion = configVersion.replace(/[^.\d]/g, "").split(".").map(d => parseInt(d));
        function isChecked(settingName) {
            var val = localStorage.getItem(`settings.${settingName}`);
            return val != null && parseInt(val);
        }
        function remove(settingName) {
            localStorage.removeItem(`settings.${settingName}`);
        }

        {
            let id = "contracts";
            if (isChecked(id)) {
                var dlc = view.dlcsMap.get("dlc7");
                if (dlc)
                    dlc.checked(true);
            }
            remove(id);
        }

        if (configVersion[0] < 10) {
            if (isChecked("noOptionalNeeds"))
                for (var isl of view.islands())
                    for (var l of isl.populationLevels)
                        for (var n of l.luxuryNeeds)
                            n.checked(false);

            for (var key of ["simpleView", "hideNewWorldConstructionMaterial", "populationInput", "consumptionModifier", "additionalProduction", "tradeRoutes", "autoApplyExtraNeed", "autoApplyConsumptionUpgrades", "deriveResidentsPerHouse", "noOptionalNeeds"])
                remove(key);

            for (var key of ["populationLevelAmount"])
                localStorage.removeItem(`serverSettings.${key}`);

            for (var isl of view.islands()) {
                for (var b of isl.residenceBuildings) {
                    for (var key of ["limitPerHouse", "limit", "fixLimitPerHouse"])
                        isl.storage.removeItem(`${b.guid}.${key}`);
                }

                for (var l of isl.populationLevels) {
                    for (var key of ["limitPerHouse", "limit", "fixLimitPerHouse", "amountPerHouse", "amount", "fixAmountPerHouse"])
                        isl.storage.removeItem(`${l.guid}.${key}`);

                    for (let n of l.needs)
                        isl.storage.removeItem(`${l.guid}[${n.guid}].percentBoost`);

                }
            }
        }
    } catch (e) { console.warn(e); }
}

function factoryReset() {
    if (localStorage)
        localStorage.clear();

    location.reload();
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
                        timer: 60000
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
                            !config.islandNames && !config[config.islandName] && (!config.versionCalculator || config.versionCalculator.startsWith("v1") || config.versionCalculator.startsWith("v2"))) {
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

        try {
            const response = await fetch(url_with_params);
            const json = await response.json(); //extract JSON from the http response

            if (!json)
                return;

            if (json.version) {
                this.currentVersion = json.version;
                this.checkVersion();
            }


            if (view.settings.proposeIslandNames.checked()) {
                for (var isl of (json.islands || [])) {
                    view.islandManager.registerName(isl.name, view.assetsMap.get(isl.session));
                }
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
                    if (!asset.canEdit()) {
                        continue; // do not update summary values if skyscrapers are used
                    }

                    if (json[key].existingBuildings && view.settings.populationLevelExistingBuildings.checked()) {
                        asset.existingBuildings(json[key].existingBuildings);
                    }


                } else if (asset instanceof Consumer) {
                    if (json[key].existingBuildings && view.settings.factoryExistingBuildings.checked())
                        asset.existingBuildings(parseInt(json[key].existingBuildings));

                    if (view.settings.factoryPercentBoost.checked()) {
                        if (view.settings.optimalProductivity.checked()) {
                            if (asset.existingBuildings() && json[key].limit) {

                                var limit = Math.max(0, json[key].limit - asset.extraGoodProductionList.amount());

                                if (asset.getOutputs().length && asset.getOutputs()[0].product.producers.length > 1) {

                                    // in all islands view, multiple factories can be produce one good
                                    // the server stored the same values for all of these factories
                                    // we consider them together and sum their existing buildings

                                    var factories = [];
                                    var countBuildings = 0;

                                    for (var guid of asset.getOutputs()[0].product.producers) {
                                        var factory = island.assetsMap.get(guid);

                                        if (factory.existingBuildings() && json[guid]) {
                                            factories.push(factory);
                                            countBuildings += factory.existingBuildings() * factory.extraGoodFactor() * factory.tpmin;
                                        }
                                    }

                                    var percentBoost = 100 * limit / countBuildings;
                                    if (countBuildings == 0 || percentBoost < 50 || percentBoost >= 1000)
                                        continue;

                                    for (var factory of factories)
                                        factory.percentBoost(percentBoost);
                                }
                                else {
                                    var percentBoost = 100 * limit / asset.existingBuildings() / asset.tpmin / asset.extraGoodFactor();
                                    if (percentBoost >= 50 && percentBoost < 1000)
                                        asset.percentBoost(percentBoost);
                                }
                            }

                        }
                        else if (json[key].percentBoost)
                            asset.percentBoost(parseInt(json[key].percentBoost));
                    }

                } else if (asset instanceof ResidenceBuilding) {
                    if (json[key].existingBuildings)
                        asset.existingBuildings(parseInt(json[key].existingBuildings));
                }

            }
        } catch (e) {
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



function init(isFirstRun, configVersion) {
    view.darkMode = new DarkMode();

    view.dlcs = [];
    view.dlcsMap = new Map();
    for (let dlc of (params.dlcs || [])) {
        var d = new DLC(dlc);
        view.dlcs.push(d);
        view.dlcsMap.set(d.id, d);
        if (localStorage) {
            let id = "settings." + d.id;
            if (localStorage.getItem(id) != null)
                d.checked(parseInt(localStorage.getItem(id)));

            d.checked.subscribe(val => localStorage.setItem(id, val ? 1 : 0));
        }
    }

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

    view.assetsMap = new Map();

    view.regions = [];
    for (let region of (params.regions || [])) {
        let r = new Region(region);
        view.assetsMap.set(r.guid, r);
        view.regions.push(r);
    }

    view.sessions = [];
    for (let session of (params.sessions || [])) {
        let s = new Session(session, view.assetsMap);
        view.assetsMap.set(s.guid, s);
        view.sessions.push(s);
    }

    // set up newspaper
    view.newspaperConsumption = new NewspaperNeedConsumption();
    if (localStorage) {
        let id = "newspaperPropagandaBuff";
        if (localStorage.getItem(id) != null)
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

    // set up NPC traders
    view.productsToTraders = new Map();
    for (var t of (params.traders || [])) {
        var trader = new NPCTrader(t);

        for (var r of t.goodsProduction) {
            var route = $.extend({}, r, { trader: trader });
            if (view.productsToTraders.has(r.Good))
                view.productsToTraders.get(r.Good).push(route);
            else
                view.productsToTraders.set(r.Good, [route]);
        }
    }

    if (params.tradeContracts) {
        view.contractUpgradeManager = new ContractUpgradeManager();
    }

    // set up island management
    view.islandManager = new IslandManager(params, isFirstRun);

    if (localStorage) {
        let id = "language";
        if (localStorage.getItem(id))
            view.settings.language(localStorage.getItem(id));

        view.settings.language.subscribe(val => localStorage.setItem(id, val));
    }

    if (!isFirstRun)
        configUpgrade(configVersion);
    else
        localStorage.setItem("upgrade.bonusResidentsApplied", 1);


    // set up modal dialogs
    view.collapsibleStates = new CollapsibleStates();
    view.selectedFactory = ko.observable(view.island().factories[0]);
    view.selectedPopulationLevel = ko.observable(view.island().populationLevels[0]);
    view.productionChain = new ProductionChainView(view.selectedFactory);
    view.selectedMultiFactoryProducts = ko.observable(view.island().multiFactoryProducts);
    view.selectedExtraGoodItems = ko.observable(view.island().extraGoodItems);
    view.selectedContractManager = ko.observable(view.island().contractManager);
    view.selectedResidenceEffectView = ko.observable(new ResidenceEffectView([view.island().residenceBuildings[0]]));



    view.tradeManager = new TradeManager();

    if (params.tradeContracts) {
        view.contractCreatorFactory = new ContractCreatorFactory();
    }

    var allIslands = view.islandManager.allIslands;
    var selectedIsland = view.island();
    var templates = [];
    var arrayToTemplate = (name) => allIslands[name].map((asset, index) => {
        var t = new Template(asset, selectedIsland, name, index);
        templates.push(t);
        return t;
    });

    view.island.subscribe(i => templates.forEach(t => t.parentInstance(i)));

    view.template = {
        populationLevels: arrayToTemplate("populationLevels"),
        categories: arrayToTemplate("categories"),
        consumers: arrayToTemplate("consumers"),
        powerPlants: arrayToTemplate("powerPlants"),
        publicServices: arrayToTemplate("publicServices"),
        publicRecipeBuildings: arrayToTemplate("publicRecipeBuildings")
    }

    if(isFirstRun)
        view.viewMode = new ViewMode(isFirstRun);

    ko.applyBindings(view, $(document.body)[0]);

    // events must be registered afte apply bindings since this adds dialogs to the html
    $('#factory-choose-dialog').on('show.bs.modal',
        () => {
            view.selectedMultiFactoryProducts(view.island().multiFactoryProducts
                .filter(p => p.availableFactories().length > 1)
                .sort((a, b) => a.name().localeCompare(b.name())));
        });

    $('#item-equipment-dialog').on('show.bs.modal',
        () => {
            view.selectedExtraGoodItems(view.island().extraGoodItems);
        });

    $('#contract-management-dialog').on('show.bs.modal',
        () => {
            view.selectedContractManager(view.island().contractManager);
        });

    $('*').on('hidden.bs.modal', () => {
        for (var dialog of ['contract-management', 'download', 'factory-choose', 'factory-config', 'island-management', 'island-rename', 'item-equipment', 'population-level-config', 'residence-effect', 'settings', 'trade-routes-management', 'view-mode', 'help']) {
            var classes = $('#' + dialog + '-dialog').attr('class');
            if (classes != null && classes.indexOf("show") != -1) {
                $('body').addClass('modal-open');
                break;
            }
        }
    });


    if (view.viewMode)
        $('#view-mode-dialog').modal("show");

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
    });

    $(document).on("keydown", (evt) => {
        if (evt.altKey || evt.ctrlKey || evt.shiftKey)
            return true;

        if (evt.target.tagName === 'TEXTAREA')
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


    if(!isPreview)
        // listen for the server providing the population count
        window.reader = new PopulationReader();
}



$(document).ready(function () {
    var configVersion = localStorage && localStorage.getItem("versionCalculator");
    var isFirstRun = !localStorage || localStorage.getItem("versionCalculator") == null;

    // parse the parameters
    for (let attr in locaTexts) {
        view.texts[attr] = new NamedElement({ name: attr, locaText: locaTexts[attr] });
    }

    if (!isPreview)
        // check version of calculator - display update and new feature notification
        checkAndShowNotifications();
    else {
        $.notify({
            // options
            message: view.texts.newFeature.name()
        }, {
            // settings
            type: 'danger',
            placement: { align: 'center' },
            timer: 60000
        });
        if (localStorage)
            localStorage.setItem("versionCalculator", versionCalculator);
    }

    //update links of download buttons
    $.getJSON("https://api.github.com/repos/NiHoel/Anno1800UXEnhancer/releases/latest").done((release) => {
        $('#download-calculator-server-button').attr("href", release.assets[0].browser_download_url);
    });

    init(isFirstRun, configVersion);

    $('[data-toggle="popover"]').popover();
    installImportConfigListener(); // must occur after template binding
})
