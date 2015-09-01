import i18n from 'i18next';
import React from 'react';
import Sortable from 'Sortable';
import Widget from '../widget';
import { ConnectionWidget, AxesWidget, ConsoleWidget, GcodeWidget, WebcamWidget } from '../widgets';
import './workspace.css';

export default class Workspace extends React.Component {
    constructor(props) {
        super(props);
        this._sortableGroups = [];
    }
    componentDidMount() {
        this.createSortableGroupForPrimaryContainer(React.findDOMNode(this.refs['primary-container']));
        this.createSortableGroupForSecondaryContainer(React.findDOMNode(this.refs['secondary-container']));
    }
    createSortableGroupForPrimaryContainer(el) {
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
    createSortableGroupForSecondaryContainer(el) {
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
            <div className="container-fluid" data-component="Workspace">
                <div className="workspace-container">
                    <div className="workspace-table">
                        <div className="workspace-table-row">
                            <div className="primary-container" ref="primary-container">
                                <ConnectionWidget />
                                <AxesWidget />
                            </div>
                            <div className="main-container" ref="main-content">
                                <p>Toolpath</p>
                            </div>
                            <div className="secondary-container" ref="secondary-container">
                                <ConsoleWidget />
                                <GcodeWidget />
                                <WebcamWidget />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
