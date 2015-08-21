import i18n from 'i18next';
import React from 'react';
import Sortable from 'Sortable';
import { Widget } from '../widget';
import { GcodeWidget, SerialConsoleWidget, AxesWidget, WebcamWidget } from '../widgets';

require('./workspace.css');

export class Workspace extends React.Component {
    constructor(props) {
        super(props);
        this._sortableGroups = [];
    }
    componentDidMount() {
        this.createSortableGroupForPrimarySidebar(React.findDOMNode(this.refs['primary-sidebar']));
        this.createSortableGroupForSecondarySidebar(React.findDOMNode(this.refs['secondary-sidebar']));
    }
    createSortableGroupForPrimarySidebar(el) {
        var sortable = Sortable.create(el, {
            group: 'workspace',
            handle: '.btn-drag',
            animation: 150,
            store: {
                get: function(sortable) {
                    var order = localStorage.getItem(sortable.options.group);
                    return order ? order.split('|') : [];
                },
                set: function(sortable) {
                    var order = sortable.toArray();
                    localStorage.setItem(sortable.options.group, order.join('|'));
                }
            },
            onAdd: function (evt){ console.log('onAdd.foo:', [evt.item, evt.from]); },
            onUpdate: function (evt){ console.log('onUpdate.foo:', [evt.item, evt.from]); },
            onRemove: function (evt){ console.log('onRemove.foo:', [evt.item, evt.from]); },
            onStart:function(evt){ console.log('onStart.foo:', [evt.item, evt.from]);},
            onSort:function(evt){ console.log('onStart.foo:', [evt.item, evt.from]);},
            onEnd: function(evt){ console.log('onEnd.foo:', [evt.item, evt.from]);}
        });
        this._sortableGroups.push(sortable);

        return sortable;
    }
    createSortableGroupForSecondarySidebar(el) {
        var sortable = Sortable.create(el, {
            group: 'workspace',
            handle: '.btn-drag',
            animation: 150,
            onAdd: function (evt){ console.log('onAdd.foo:', [evt.item, evt.from]); },
            onUpdate: function (evt){ console.log('onUpdate.foo:', [evt.item, evt.from]); },
            onRemove: function (evt){ console.log('onRemove.foo:', [evt.item, evt.from]); },
            onStart:function(evt){ console.log('onStart.foo:', [evt.item, evt.from]);},
            onSort:function(evt){ console.log('onStart.foo:', [evt.item, evt.from]);},
            onEnd: function(evt){ console.log('onEnd.foo:', [evt.item, evt.from]);}
        });
        this._sortableGroups.push(sortable);

        return sortable;
    }
    componentWillUnmount() {
        this._sortableGroups.each(function(sortable) {
            sortable.destroy();
        });
        this._sortableGroups = [];
    }
    render() {
        return (
            <div className="container-fluid workspace" data-component="Workspace">
                <div className="row">
                    <div className="col-sm-3">
                        <div className="container-fluid">
                            <div className="row" ref="primary-sidebar" data-layout="primary-sidebar">
                                <GcodeWidget className="col-sm-12"/>
                                <SerialConsoleWidget className="col-sm-12"/>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="container-fluid">
                            <div className="row" ref="main-content" data-layout="main-content">
                                <p>Main area</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div className="container-fluid">
                            <div className="row" ref="secondary-sidebar" data-layout="secondary-sidebar">
                                <AxesWidget className="col-sm-12"/>
                                <WebcamWidget className="col-sm-12"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
