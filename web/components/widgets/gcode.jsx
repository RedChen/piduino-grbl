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

class CommandsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            table: {
                columns: [
                    {
                        dataKey: 'status',
                        name: '',
                        isResizable: false,
                        width: 20,
                        minWidth: 20
                    },
                    {
                        dataKey: 'id',
                        name: 'No.',
                        isResizable: true,
                        width: 40,
                        minWidth: 40
                    },
                    {
                        dataKey: 'cmd',
                        name: 'Command',
                        isResizable: true,
                        width: 250,
                        minWidth: 100
                    }
                ],
                data: this.getDataFromStore()
            }
        };
    }
    getDataFromStore() {
        return _.get(store.getState(), 'commands');
    }
    componentDidMount() {
        let that = this;
        this.unsubscribe = store.subscribe(() => {
            that._onChange();
        });
    }
    componentWillUnmount() {
        this.unsubscribe();
        this.unsubscribe = null;
    }
    _onChange() {
        // http://facebook.github.io/react/docs/update.html
        var newState = React.addons.update(this.state, {
            table: {
                data: { $set: this.getDataFromStore() }
            }
        });
        this.setState(newState);
    }
    rowGetter(index) {
        return this.state.table.data[index];
    }
    rowHeightGetter(index) {
        var row = this.state.table.data[index];
        if (row.cmd.length > 10) {
            return 80;
        }
        return 40;
    }
    cellRenderer(cellData, cellDataKey, rowData, rowIndex, columnData, width) {
        return (
            <span className="text-overflow-ellipsis" style={{width: width}}>
                {cellData}
            </span>
        );
    }
    onColumnResizeEndCallback(newColumnWidth, dataKey) {
        isColumnResizing = false;
        this.setTableColumnWidth(dataKey, newColumnWidth);
    }
    setTableColumnWidth(dataKey, newColumnWidth) {
        let columns = this.state.table.columns;
        let newState = React.addons.update(this.state, {
            table: {
                columns: {
                    $apply: function() {
                        let key = _.findKey(columns, { dataKey: dataKey });
                        columns[key].width = newColumnWidth;
                        return columns;
                    }
                }
            }
        });
        this.setState(newState);
    }
    render() {
        if (this.state.table && _.size(this.state.table.data) > 0) {
            return this.renderTable();
        } else {
            return this.renderEmptyMessage();
        }
    }
    renderTable() {
        return (
            <Table
                headerHeight={25}
                rowHeight={40}
                rowHeightGetter={this.rowHeightGetter.bind(this)}
                rowGetter={this.rowGetter.bind(this)}
                rowsCount={this.state.table.data.length}
                width={300}
                maxHeight={200}
                overflowX="auto"
                overflowY="auto"
                isColumnResizing={isColumnResizing}
                onColumnResizeEndCallback={this.onColumnResizeEndCallback.bind(this)}>
                {this.renderTableColumns()}
            </Table>
        );
    }
    renderTableColumns() {
        let columns = this.state.table.columns;
        return columns.map(function(column, key) {
            return (
                <Column
                    label={column.name}
                    width={column.width}
                    dataKey={column.dataKey}
                    key={key}
                    isResizable={!!column.isResizable}
                    cellRenderer={this.cellRenderer}
                    minWidth={column.minWidth}
                />
            );
        }.bind(this));
    }
    renderEmptyMessage() {
        return (
            <p className="">No data to display</p>
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
                    return {
                        done: false,
                        id: index,
                        cmd: command
                    };
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
                    <CommandsTable/>
                </div>
            )
        };
        return (
            <Widget options={options}/>
        );
    }
}
