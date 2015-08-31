import _ from 'lodash';
import i18n from 'i18next';
import React from 'react';
import { Table, Column } from 'fixed-data-table';
import Widget from '../widget';
import { UPDATE_COMMANDS } from '../../actions';
import store from '../../store';
import './gcode.css';

let isColumnResizing = false;
let stripComments = (() => {
    let re1 = /^\s+|\s+$/g; // Strip leading and trailing spaces
    let re2 = /\s*[#;].*$/g; // Strip everything after # or ; to the end of the line, including preceding spaces
    return (s) => {
        return s.replace(re1, '').replace(re2, '');
    };
})();

class CommandList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnWidths: {
                id: 40,
                cmd: 260
            },
            commands: this.getCommandsFromStore()
        };
    }
    getCommandsFromStore() {
        return _.get(store.getState(), 'commands');
    }
    componentDidMount() {
        let that = this;
        this.unsubscribe = store.subscribe(() => {
            that._onChange();
        });
    }
    componentWillUnmount() {
        // TODO
    }
    _onChange() {
        this.setState({
            commands: this.getCommandsFromStore()
        });
    }
    rowGetter(rowIndex) {
        return this.state.commands[rowIndex];
    }
    renderEmptyMessage() {
        return (
            <p className="">No data to display</p>
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
        let fs = require('fs'); // FIXME
        let file = fs.readFileSync(__dirname + '/../../../test/github.gcode', 'utf8');
        let lines = file.split('\n');

        store.dispatch({
            type: UPDATE_COMMANDS,
            commands: _(lines)
                .map((command, index) => {
                    command = stripComments(command).trim();
                    if (command.length === 0) {
                        return;
                    }
                    return { id: index, cmd: command };
                })
                .compact()
                .value()
        });
    }
    render() {
        let options = {
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
