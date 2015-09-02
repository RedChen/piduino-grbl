import _ from 'lodash';
import i18n from 'i18next';
import React from 'react';
import { Table, Column } from 'fixed-data-table';
import Widget from '../widget';
import { GCODE_UPDATE } from '../../actions';
import store from '../../store';
import socket from '../../socket';
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
                width: this.props.width,
                height: this.props.height,
                columns: [
                    {
                        dataKey: 'status',
                        isResizable: false,
                        width: 28,
                        align: 'center',
                        cellRenderer: (cellData, cellDataKey, rowData, rowIndex, columnData, width) => {
                            var style = {
                                color: '#ddd'
                            };
                            return (
                                <i className="icon ion-checkmark" style={style}></i>
                            );
                        }
                    },
                    {
                        dataKey: 'gcode',
                        isResizable: true,
                        flexGrow: 1,
                        width: 100,
                        cellRenderer: (cellData, cellDataKey, rowData, rowIndex, columnData, width) => {
                            return (
                                <span className="text-overflow-ellipsis" style={{width: width}}>
                                    <span className="label label-default">{rowIndex + 1}</span> {cellData} 
                                </span>
                            );
                        }
                    }
                ],
                data: this.getDataFromStore()
            }
        };
    }
    getDataFromStore() {
        return _.get(store.getState(), 'gcode.data');
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
    _rowGetter(index) {
        return this.state.table.data[index];
    }
    _onContentHeightChange(contentHeight) {
        if ( ! this.props.onContentDimensionsChange) {
            return;
        }
        this.props.onContentDimensionsChange(
            contentHeight,
            Math.max(600, this.props.tableWidth)
        );
    }
    _onColumnResizeEndCallback(newColumnWidth, dataKey) {
        isColumnResizing = false;
        this._setTableColumnWidth(dataKey, newColumnWidth);
    }
    _setTableColumnWidth(dataKey, newColumnWidth) {
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
        let controlledScrolling =
            this.props.left !== undefined || this.props.top !== undefined;

        return (
            <Table
                className="noHeader"
                headerHeight={0}
                rowHeight={30}
                rowGetter={::this._rowGetter}
                rowsCount={_.size(this.state.table.data)}
                width={this.state.table.width}
                height={this.state.table.height}
                onContentHeightChange={::this._onContentHeightChange}
                scrollTop={this.props.top}
                scrollLeft={this.props.left}
                overflowX={controlledScrolling ? "hidden" : "auto"}
                overflowY={controlledScrolling ? "hidden" : "auto"}
                isColumnResizing={isColumnResizing}
                onColumnResizeEndCallback={::this._onColumnResizeEndCallback}>
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
                    dataKey={column.dataKey}
                    width={column.width}
                    flexGrow={column.flexGrow}
                    isResizable={!!column.isResizable}
                    key={key}
                    align={column.align}
                    headerClassName={column.headerClassName}
                    headerRenderer={column.headerRenderer}
                    cellClassName={column.cellClassName}
                    cellRenderer={column.cellRenderer}
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
    handleLoad() {
        let fs = require('fs'); // FIXME
        let file = fs.readFileSync(__dirname + '/../../../test/github.gcode', 'utf8');
        let lines = file.split('\n');

        store.dispatch({
            type: GCODE_UPDATE,
            data: _(lines)
                .map((line, index) => {
                    line = stripComments(line).trim();
                    if (line.length === 0) {
                        return;
                    }
                    return {
                        status: 0,
                        gcode: line
                    };
                })
                .compact()
                .value()
        });
    }
    handlePlay() {
        socket.emit('grbl:start');
    }
    render() {
        let widgetWidth = 300;
        let tableWidth = widgetWidth - 2 /* border */ - 20 /* padding */;
        let tableHeight = 300;
        let options = {
            width: widgetWidth,
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
                    <button type="button" className="btn btn-default" name="btn-play" title="Load" onClick={::this.handleLoad}>
                        <i className="icon ion-load"></i>
                    </button>
                    <button type="button" className="btn btn-default" name="btn-play" title="Play" onClick={::this.handlePlay}>
                        <i className="icon ion-play"></i>
                    </button>
                    <div className="gcode-wrapper">
                        <CommandsTable width={tableWidth} height={tableHeight}/>
                    </div>
                </div>
            )
        };
        return (
            <Widget options={options}/>
        );
    }
}
