/*globals define, WebGMEGlobal*/

/**
 * Generated by VisualizerGenerator 1.7.0 from webgme on Wed Apr 14 2021 10:39:10 GMT-0500 (Central Daylight Time).
 */

define(['jointjs', 'css!./styles/SimSMWidget.css'], function (joint) {
    'use strict';

    var WIDGET_CLASS = 'sim-s-m';

    function SimSMWidget(logger, container) {
        this._logger = logger.fork('Widget');

        this._el = container;

        this.nodes = {};
        this._initialize();

        this._logger.debug('ctor finished');
    }

    SimSMWidget.prototype._initialize = function () {
        console.log(joint);
        var width = this._el.width(),
            height = this._el.height(),
            self = this;

        // set widget class
        this._el.addClass(WIDGET_CLASS);

        this._jointSM = new joint.dia.Graph;
        this._jointPaper = new joint.dia.Paper({
            el: this._el,
            width : width,
            height: height,
            model: this._jointSM,
            interactive: false
        });

        this._webgmeSM = null;

        // Registering to events can be done with jQuery (as normal)
        /*this._el.on('dblclick', function (event) {
            event.stopPropagation();
            event.preventDefault();
            self.onBackgroundDblClick();
        });*/
    };

    SimSMWidget.prototype.onWidgetContainerResize = function (width, height) {
        this._logger.debug('Widget is resizing...');
    };

    // State Machine manipulating functions called from the controller
    SimSMWidget.prototype.initMachine = function (machineDescriptor) {
        const self = this;
        console.log(machineDescriptor);

        self._webgmeSM = machineDescriptor;
        self._webgmeSM.current = self._webgmeSM.init;
        const sm = self._webgmeSM;
        // first add the states
        Object.keys(sm.states).forEach(stateId => {
            let vertex = null;
            if (sm.init === stateId) {
                vertex = new joint.shapes.standard.Circle({
                    position: sm.states[stateId].position,
                    size: { width: 20, height: 20 },
                    attrs: {
                        body: {
                            fill: '#333333'
                        }
                    }
                });
            } else if (sm.states[stateId].isEnd) {
                vertex = new joint.shapes.standard.Circle({
                    position: sm.states[stateId].position,
                    size: { width: 30, height: 30 },
                    attrs: {
                        body: {
                            fill: '#999999'
                        }
                    }
                });
            } else {
                vertex = new joint.shapes.standard.Circle({
                    position: sm.states[stateId].position,
                    size: { width: 60, height: 60 },
                    attrs: {
                        label : {
                            text: sm.states[stateId].name,
                            //event: 'element:label:pointerdown',
                            fontWeight: 'bold',
                            //cursor: 'text',
                            //style: {
                            //    userSelect: 'text'
                            //}
                        },
                        body: {
                            strokeWidth: 3
                        }
                    }
                });
            }
            vertex.addTo(self._jointSM);
            sm.states[stateId].joint = vertex;
        });

        // then create the links
        Object.keys(sm.states).forEach(stateId => {
            const state = sm.states[stateId];
            Object.keys(state.next).forEach(event => {
                state.jointNext = state.jointNext || {};
                const link = new joint.shapes.standard.Link({
                    source: {id: state.joint.id},
                    target: {id: sm.states[state.next[event]].joint.id},
                    attrs: {
                        line: {
                            strokeWidth: 2
                        }
                    },
                    labels: [{
                        position: {
                            distance: 0.5,
                            offset: 0,
                            args: {
                                keepGradient: true,
                                ensureLegibility: true
                            }
                        },
                        attrs: {
                            text: {
                                text: event,
                                fontWeight: 'bold'
                            }
                        }
                    }]
                });
                link.addTo(self._jointSM);
                state.jointNext[event] = link;
            })
        });

        //now refresh the visualization
        self._jointPaper.updateViews();
    };

    SimSMWidget.prototype.destroyMachine = function () {

    };
    

    /* * * * * * * * Visualizer event handlers * * * * * * * */

    /* * * * * * * * Visualizer life cycle callbacks * * * * * * * */
    SimSMWidget.prototype.destroy = function () {
    };

    SimSMWidget.prototype.onActivate = function () {
        this._logger.debug('SimSMWidget has been activated');
    };

    SimSMWidget.prototype.onDeactivate = function () {
        this._logger.debug('SimSMWidget has been deactivated');
    };

    return SimSMWidget;
});
