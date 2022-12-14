/*globals define, _, WebGMEGlobal*/
/**
 * Generated by VisualizerGenerator 1.7.0 from webgme on Wed Apr 14 2021 10:39:10 GMT-0500 (Central Daylight Time).
 */

define([
    'js/PanelBase/PanelBaseWithHeader',
    'js/PanelManager/IActivePanel',
    'widgets/PetriNet/PetriNetWidget',
    './PetriNetControl'
], function (
    PanelBaseWithHeader,
    IActivePanel,
    PetriNetWidget,
    PetriNetControl
) {
    'use strict';

    function PetriNetPanel(layoutManager, params) {
        var options = {};
        //set properties from options
        options[PanelBaseWithHeader.OPTIONS.LOGGER_INSTANCE_NAME] = 'PetriNetPanel';
        options[PanelBaseWithHeader.OPTIONS.FLOATING_TITLE] = true;

        //call parent's constructor
        PanelBaseWithHeader.apply(this, [options, layoutManager]);

        this._client = params.client;

        //initialize UI
        this._initialize();

        this.logger.debug('ctor finished');
    }

    //inherit from PanelBaseWithHeader
    _.extend(PetriNetPanel.prototype, PanelBaseWithHeader.prototype);
    _.extend(PetriNetPanel.prototype, IActivePanel.prototype);

    PetriNetPanel.prototype._initialize = function () {
        var self = this;

        //set Widget title
        this.setTitle('');

        this.widget = new PetriNetWidget(this.logger, this.$el);

        this.widget.setTitle = function (title) {
            self.setTitle(title);
        };

        this.control = new PetriNetControl({
            logger: this.logger,
            client: this._client,
            widget: this.widget
        });

        this.onActivate();
    };

    /* OVERRIDE FROM WIDGET-WITH-HEADER */
    /* METHOD CALLED WHEN THE WIDGET'S READ-ONLY PROPERTY CHANGES */
    PetriNetPanel.prototype.onReadOnlyChanged = function (isReadOnly) {
        //apply parent's onReadOnlyChanged
        PanelBaseWithHeader.prototype.onReadOnlyChanged.call(this, isReadOnly);

    };

    PetriNetPanel.prototype.onResize = function (width, height) {
        this.logger.debug('onResize --> width: ' + width + ', height: ' + height);
        this.widget.onWidgetContainerResize(width, height);
    };

    /* * * * * * * * Visualizer life cycle callbacks * * * * * * * */
    PetriNetPanel.prototype.destroy = function () {
        this.control.destroy();
        this.widget.destroy();

        PanelBaseWithHeader.prototype.destroy.call(this);
        WebGMEGlobal.KeyboardManager.setListener(undefined);
        WebGMEGlobal.Toolbar.refresh();
    };

    PetriNetPanel.prototype.onActivate = function () {
        this.widget.onActivate();
        this.control.onActivate();
        WebGMEGlobal.KeyboardManager.setListener(this.widget);
        WebGMEGlobal.Toolbar.refresh();
    };

    PetriNetPanel.prototype.onDeactivate = function () {
        this.widget.onDeactivate();
        this.control.onDeactivate();
        WebGMEGlobal.KeyboardManager.setListener(undefined);
        WebGMEGlobal.Toolbar.refresh();
    };

    return PetriNetPanel;
});
