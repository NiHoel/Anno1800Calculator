// @ts-check
import { PopulationNeed } from './consumption.js';
import { Consumer } from './factories.js';
import { NumberInputHandler, EPSILON } from './util.js'

var ko = require("knockout");

ko.bindingHandlers.withProperties = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // Make a modified binding context, with a extra properties, and apply it to descendant elements
        var innerBindingContext = bindingContext.extend(valueAccessor);
        ko.applyBindingsToDescendants(innerBindingContext, element);

        // Also tell KO *not* to bind the descendants itself, otherwise they will be bound twice
        return { controlsDescendantBindings: true };
    }
};

ko.components.register('number-input-increment', {
    viewModel: {
        // - 'params' is an object whose key/value pairs are the parameters
        //   passed from the component binding or custom element
        // - 'componentInfo.element' is the element the component is being
        //   injected into. When createViewModel is called, the template has
        //   already been injected into this element, but isn't yet bound.
        // - 'componentInfo.templateNodes' is an array containing any DOM
        //   nodes that have been supplied to the component. See below.
        createViewModel: (params, componentInfo) => new NumberInputHandler(params)
    },
    template:
        `<div class="input-group-btn-vertical" >
                                                        <button class="btn btn-default" type="button" data-bind="click: (_, evt) => {var factor = getInputFactor(evt); var val = parseFloat(obs()) + factor * step + ACCURACY; obs(Math.floor(val/step)*step)}, enable: obs() < max"><i class="fa fa-caret-up"></i></button>
                                                        <button class="btn btn-default" type="button" data-bind="click: (_, evt) => {var factor = getInputFactor(evt); var val = parseFloat(obs()) - factor * step - ACCURACY; obs(Math.ceil(val/step)*step)}, enable: obs() > min"><i class="fa fa-caret-down"></i></button>
                                                    </div>`
});

ko.components.register('notes-section', {
    template:
        `<div class="form-group notes-section" data-bind="if: $data != null && $data.notes != null">
              <textarea class="form-control" data-bind="textInput: $data.notes, attr: {placeholder: $root.texts.notes.name()}"></textarea>
        </div>`
});

ko.components.register('lock-toggle', {
    template:
        `<div style="cursor: pointer" data-bind="click: () => {checked(!checked());}">
             <img class="icon-sm icon-light" src="icons/icon_unlock.png" data-bind="style: {display : checked()? 'none' : 'inherit'}">
             <img class="icon-sm icon-light" src="icons/icon_lock.png" style="display: none;"  data-bind="style: {display : checked()? 'inherit' : 'none'}">
        </div>`
});

ko.components.register('asset-icon', {
    viewModel: function (asset) {
        this.asset = asset;
    },
    template: `<img class="icon-sm" src="" data-bind="attr: { src: asset.icon ? asset.icon : null, alt: asset.name, title: asset.name}">`
});

ko.components.register('factory-header', {
    viewModel: function (params) {
        this.$data = params.data;
        this.hasButton = params.button;
        this.$root = window.view;
    },
    template:
        `<div class="ui-fchain-item-tr-button" data-bind="if: hasButton">
            <div>
                <button class="btn btn-light btn-sm" data-bind="click: () => {$root.selectedFactory($data.instance())}" data-toggle="modal" data-target="#factory-config-dialog">
                    <span class="fa fa-sliders"></span>
                </button>
            </div>
        </div>

        <div class="ui-fchain-item-name" data-bind="text: $data.name, visible: !$root.settings.hideNames.checked()"></div>

        <div class="ui-fchain-item-icon mb-2">
            <img class="icon-tile" data-bind="attr: { src: $data.icon ? $data.icon : null, alt: $data.name }">
            <img class="superscript-icon icon-light" data-bind="visible: $data.region, attr: {src: $data.region ? $data.region.icon : null, title: $data.region ? $data.region.name : null}">
        </div>`
})

ko.components.register('residence-label', {
    viewModel: function (residence) {
        this.residence = residence;
    },
    template:
        `<div class="inline-list mr-3" data-bind="attr: {title: residence.name}">
            <div data-bind="component: {name: 'asset-icon', params: residence.populationLevel}"></div>
            <div data-bind="component: {name: 'asset-icon', params: residence}"></div>
            <div data-bind="text: residence.floorCount"></div>
        </div>`
})

ko.components.register('residence-effect-entry', {
    viewModel: function (params) {
        this.entries = params.entries;
        this.filter = params.filter;
        this.texts = window.view.texts;
    },
    template:
        `<div class="inline-list-centered" data-bind="foreach: entries">
             <div class="inline-list mr-3" data-bind="if: product.available() && ($parent.filter == null || $parent.filter.has(product))">
                <div data-bind="component: { name: 'asset-icon', params: product}" ></div>
                <div data-bind="if: consumptionModifier !== 0">
                    <img class="icon-sm icon-light ml-1" src="icons/icon_marketplace_2d_light.png" data-bind="attr: {title: $parent.texts.reduceConsumption.name}">
                    <span data-bind="text: formatPercentage(consumptionModifier)"></span>
                </div>
                <div data-bind="if: residents !== 0">
                    <img class="icon-sm icon-light ml-1" src="icons/icon_resource_population.png" data-bind="attr: {title: $parent.texts.bonusResidents.name}">
                    <span data-bind="text: '+' + residents"></span>
                </div>
                <div class="inline-list" data-bind="if: suppliedBy.length !== 0">
                    <img class="icon-sm icon-light ml-1" src="icons/icon_transfer_goods_light.png" data-bind="attr: {title: $parent.texts.bonusSupply.name}">
                    <div class="inline-list" data-bind="foreach: {data: suppliedBy, as: 'product'}">
                        <span data-bind="component: {name: 'asset-icon', params: product}"></span>
                    </div>
                </div>
            </div>
        </div>
        `
});

ko.components.register('replacement', {
    viewModel: function (params) {
        this.old = params.old;
        this.replacing = params.new;
    }, template:
        ` <div class="ui-fchain-item-icon-replacement">
            <span class="strike-through">
                <img class="icon-sm" src="" data-bind="attr: { src: old.icon ? old.icon : null, alt: old.name }">
            </span>
            <!-- ko if: replacing -->
            <div class="ui-replacement-spacer">
                    &rarr;
            </div>
            <div>
                <img class="icon-sm" src="" data-bind="attr: { src: replacing.icon ? replacing.icon : null, alt: replacing.name }">
            </div>
            <!-- /ko -->
        </div>`
});

ko.components.register('existing-buildings-input', {
    viewModel: function (asset) {
        this.asset = asset;
        this.texts = window.view.texts;
    }, template:
        `<div class="input-group input-group-short spinner float-left" style="max-width: 10rem;">
            <div class="input-group-prepend" data-bind="src: {title: texts.residences.name()}">
                <div class="input-group-text">
                    <img class="icon-sm icon-light" src="icons/icon_house_white.png" />
                </div>
            </div>
            <input class="form-control" type="number" value="0" step="1" min="0" data-bind="value: asset.existingBuildings, enable: asset.canEdit == null || asset.canEdit(), attr: {id: asset.guid + '-existing-buildings-input'}" />
            <div class="input-group-append">
                <div data-bind="component: { name: 'number-input-increment', params: { obs: asset.existingBuildings, id: asset.guid + '-existing-buildings-input' }}"></div>
            </div>
        </div>`
});

ko.components.register('icon-checkbox', {
    viewModel: function (params) {
        this.asset = params.asset;
        this.checked = params.checked || this.asset.checked;
        this.id = params.id || this.asset.guid;
        this.title = params.title || this.asset.name
    }, template:
        `<div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" data-bind="checked: checked, attr: { 'id': id, 'title': title() }">
            <label class="custom-control-label" data-bind="attr: { for: id }" src-only style="vertical-align: top;">
                <span class="mr-2" style="flex-basis: fit-content;">
                    <img class="icon-sm" src="" data-bind="attr: { src: asset.icon ? asset.icon  : null, alt: title(), for: id }" />
                </span>
            </label>
        </div>`
});

ko.components.register('additional-output', {
    viewModel: function (params) {
        this.amount = params.amount;
        this.texts = window.view.texts;
    }, template:
        `<div data-bind="src: { title: texts.extraGoods.name}">
            <img class="icon-sm icon-light mr-2" src="icons/icon_add_goods_socket_white.png"/>
            <span data-bind="text: formatNumber(amount()) + ' t/min'"></span>
        </div>`
});

ko.components.register('collapsible', {
    viewModel: function (params) {
        this.target = '#' + params.id;
        this.heading = params.heading;
        this.collapser = window.view.collapsibleStates.get(params.id, params.collapsed);
        this.cssClass = ko.pureComputed(() => this.collapser.collapsed() ? "hide" : "show");
        this.fieldsetClass = params.fieldsetClass ? params.fieldsetClass : "collapsible-section";
        this.data = params.data;
        this.hasCheckbox = false;

        if (params.checkbox) {
            this.hasCheckbox = true;
            if (ko.isWriteableObservable(params.checkbox))
                this.checked = params.checkbox;
            else {
                this.items = params.checkbox;
                this.checked = ko.pureComputed({
                    read: () => {
                        for (var n of this.items)
                            if (!n.checked())
                                return false;

                        return true;
                    },
                    write: (checked) => {
                        for (var n of this.items)
                            n.checked(checked);
                    }
                })
            }
        }

        this.hasSummary = false;
        if (params.summary) {
            this.hasSummary = true;
            this.summary = params.summary;
            if (params.colorSummary) {
                this.summaryWithSign = true;
                this.summaryClass = ko.pureComputed(() => {
                    if (Math.abs(this.summary()) < EPSILON)
                        return "";

                    return this.summary() < 0 ? "amount-negative" : "amount-positive"
                })
            } else {
                this.summaryWithSign = false;
                this.summaryClass = ko.observable("");
            }
        }

        setTimeout(() => {
            $(this.target).on("hidden.bs.collapse shown.bs.collapse", (event) => {
                this.collapser.collapsed(!$(this.target).hasClass("show"));
            });
        });

    }, template:
        `<fieldset class="mt-4" data-bind="class: fieldsetClass">
            <legend class="collapser collapsed" data-toggle="collapse" data-bind="attr: {'data-target' : target}, css: {'collapsed' : collapser.collapsed()}">
                <div class="summary" data-bind="if: hasSummary">
                    <span class="float-right" data-bind="class: summaryClass">
                        <span data-bind="text: formatNumber(summary(), summaryWithSign)"></span>
                        <span> t/min</span>
                    </span>
                </div>
                <span class="fa fa-chevron-right"></span>
                <span class="fa fa-chevron-down"></span>
                <!-- ko if: !hasCheckbox -->
                <span data-bind="text:heading"></span>
                <!-- /ko -->
                <!-- ko if: hasCheckbox -->
                <span class="custom-control custom-checkbox ml-1" style="display: initial">
                    <input type="checkbox" class="custom-control-input" data-bind="checked: checked, attr: { id: target + '-check-all' }">
                    <label class="custom-control-label" data-bind="attr: {for: target + '-check-all'}">
                        <span data-bind="text:heading"></span>
                    </label>
                </span>
                <!-- /ko -->   
            </legend>
            <div class="collapse" data-bind="attr: {'id' : collapser.id}, class: cssClass">
                <!-- ko template: { nodes: $componentTemplateNodes, data: data } --><!-- /ko -->
                <div class="clear"></div>
            </div>
          </fieldset>
            `
});

ko.components.register('consumer-unknown', {
    template: `<span>?</span>`
});

ko.components.register('consumer-population', {
    template:
        `<div class="inline-list" style="cursor: pointer" data-dismiss="modal" data-bind="click: () => {setTimeout(() => { $root.selectedPopulationLevel($data.level); $('#population-level-config-dialog').modal('show')}, 500);}" >
            <div data-bind="component: {name: 'asset-icon', params: $data.level}"></div>
            <span class="ml-2" data-bind="text: $data.level.name"></span>
        </div>`
});

ko.components.register('consumer-factory', {
    template:
        `<div class="inline-list" style="cursor: pointer" data-bind="click: () => {$root.selectedFactory($data.consumer);}" >
            <div data-bind="component: {name: 'asset-icon', params: $data.consumer}"></div>
            <span class="ml-2" data-bind="text: $data.consumer.getRegionExtendedName()"></span>
        </div>`
});

ko.components.register('consumer-module', {
    template:
        `<div class="inline-list" style="cursor: pointer" data-bind="click: () => {$root.selectedFactory($data.consumer);}" >
            <div data-bind="component: {name: 'asset-icon', params: $data.consumer}"></div>
            <div class="ml-2" data-bind="component: {name: 'asset-icon', params: $data.module}"></div>
            <span class="ml-2" data-bind="text: $data.module.name() + ': ' + $data.consumer.getRegionExtendedName()"></span>
        </div>`
});

ko.components.register('consumer-entry', {
    viewModel: function (demand) {
        this.demand = demand;


        this.component = "consumer-unknown";

        if (this.demand instanceof PopulationNeed)
            this.component = "consumer-population";
        else if (this.demand.module)
            this.component = "consumer-module";
        else if (this.demand.consumer instanceof Consumer)
            this.component = "consumer-factory";

    }, template:
        `<div data-bind="component: { name: component, params: demand}"></div>`
});

ko.components.register('consumer-view', {
    viewModel: function (params) {
        this.factory = params.factory;
        this.populationLevelIndices = new Map();
        this.factory.island.populationLevels.forEach((l, i) => this.populationLevelIndices.set(l.guid, i));

        this.demands = ko.pureComputed(() => {
            var demands = this.factory.demands().filter(d => d.amount() > ACCURACY);
            return demands.sort((a, b) => {
                if (a instanceof PopulationNeed && b instanceof PopulationNeed)
                    return this.populationLevelIndices.get(a.level.guid) - this.populationLevelIndices.get(b.level.guid);

                if (a instanceof PopulationNeed)
                    return -1000;

                if (b instanceof PopulationNeed)
                    return 1000;

                if (a.consumer && b.consumer)
                    return a.consumer.name().localeCompare(b.consumer.name());

                if (a.consumer)
                    return -1000;

                if (b.consumer)
                    return 1000;

                return b.amount() - a.amount();
            });
        });

    }, template:
        //        `<div data-bind="component: { name: component, params: demand}"></div>`
        `<table class="table table-striped">
            <tbody data-bind="foreach: demands">
                <tr>
                    <td>
                        <div data-bind="component: { name: 'consumer-entry', params: $data}"></div>
                    </td>
                    <td>
                        <div class="float-right">
                            <span data-bind="text: formatNumber($data.amount())"></span>
                            <span> t/min</span>
                        </div>
                    </td>

                </tr>
            </tbody>
         </table>`
});