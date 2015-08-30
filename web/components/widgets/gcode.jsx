import _ from 'lodash';
import i18n from 'i18next';
import React from 'react';
import { createStore } from 'redux';
import { Table, Column } from 'fixed-data-table';
import Widget from '../widget';
import './gcode.css';

function commandData(state = [], action) {
    switch (action.type) {
        case 'UPDATE':
            state = action.commands;
            return state;
        default:
            return state;
    }
}

// Create a Redux store holding the state.
// Its API is { subscribe, dispatch, getState }.
let commandDataStore = createStore(commandData);

let isColumnResizing = false;

class CommandList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnWidths: {
                id: 40,
                cmd: 260
            },
            commands: commandDataStore.getState()
        };
    }
    componentDidMount() {
        var that = this;
        commandDataStore.subscribe(function() {
            that._onChange();
        });
    }
    componentWillUnmount() {
        // TODO
    }
    _onChange() {
        this.setState({
            commands: commandDataStore.getState()
        });
    }
    rowGetter(rowIndex) {
        return this.state.commands[rowIndex];
    }
    renderEmptyMessage() {
        return (
            <p className="">No commands to show</p>
        );
    }
    onColumnResizeEndCallback(newColumnWidth, dataKey) {
        isColumnResizing = false;

        let columnWidths = this.state.columnWidths;
        columnWidths[dataKey] = newColumnWidth;
        this.setState({
            columnWidths: columnWidths
        });
    }
    render() {
        if (this.state.commands.length === 0) {
            return this.renderEmptyMessage();
        }

        return (
            <Table
                headerHeight={25}
                rowHeight={40}
                rowGetter={this.rowGetter.bind(this)}
                rowsCount={this.state.commands.length}
                width={300}
                maxHeight={200}
                overflowX="auto"
                overflowY="auto"
                isColumnResizing={isColumnResizing}
                onColumnResizeEndCallback={this.onColumnResizeEndCallback.bind(this)}>
                <Column
                    label="No."
                    width={this.state.columnWidths.id}
                    dataKey="id"
                    isResizable={true}
                    minWidth={5}
                />
                <Column
                    label="Command"
                    width={this.state.columnWidths.cmd}
                    dataKey="cmd"
                    isResizable={true}
                    minWidth={5}
                />
            </Table>
        );
    }
}

export default class GcodeWidget extends React.Component {
    handleCommands() {
        var fs = require('fs'); // FIXME
        var file = fs.readFileSync(__dirname + '/../../../test/github.gcode', 'utf8');
        var commands = _.map(file.split('\n'), function(command, index) {
            return { id: index, cmd: command };
        });

        commandDataStore.dispatch({
            type: 'UPDATE',
            commands: commands
        });
    }
    render() {
        var options = {
            width: 300,
            header: {
                style: 'invese',
                title: (
                    <div>
                        <i className="icon ion-ios-barcode"></i>
                        &nbsp;
                        <span>{i18n._('Gcode')}</span>
                    </div>
                ),
                toolbar: {
                    buttons: [
                        'toggle'
                    ]
                }
            },
            content: (
                <div data-component="Widgets/GcodeWidget">
                    <button type="button" className="btn btn-default" name="btn-play" title="Play" onClick={this.handleCommands.bind(this)}>
                        <i className="icon ion-play"></i>
                    </button>
                    <CommandList/>
                </div>
            )
        };
        return (
            <Widget options={options}/>
        );
    }
}
