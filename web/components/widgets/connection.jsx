import _ from 'lodash';
import i18n from 'i18next';
import React from 'react';
import Select from 'react-select';
import Widget from '../widget';
import socket from '../../socket';
import log from '../../lib/log';
import './connection.css';

class Connection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ports: [],
            port: '',
            baudrate: 115200,
            baudrates: [
                9600,
                19200,
                38400,
                57600,
                115200
            ],
            refreshing: false
        };
    }
    componentDidMount() {
        var that = this;

        socket.on('serialport:list', (ports) => {
            log.debug(ports);
            that.setState({ports: ports});
        });

        socket.on('serialport:open', (data) => {
            log.debug('Connected to ' + data.port + ' at ' + data.baudrate + '.');
        });
    }
    openConnection() {
        let port = this.state.port;
        let baudrate = this.state.baudrate;

        socket.emit('serialport:connect', {
            port: port,
            baudrate: baudrate
        });
    }
    render() {
        let canOpenConnection = (this.state.port && this.state.baudrate);

        return (
            <div>
                <div className="form-group">
                    <label className="control-label">{i18n._('Port:')}</label>
                    <table style={{width: '100%'}}>
                        <tbody>
                            <tr>
                                <td>
                                    <Select
                                        name="form-port"
                                        value={this.state.port}
                                        options={_.map(this.state.ports, function(port) {
                                            let value = port.comName;
                                            let label = port.comName
                                                      + (port.manufacturer ? ' ' + port.manufacturer: '');
                                            return { value: value, label: label };
                                        })}
                                        backspaceRemoves={false}
                                        clearable={false}
                                        searchable={false}
                                        placeholder={i18n._('Choose a port')}
                                        noResultsText={i18n._('No ports available')}
                                        onChange={(value) => this.setState({port: value})}
                                    />
                                </td>
                                <td style={{paddingLeft: 10, width: '1%'}}>
                                    <button type="button" className="btn btn-default" name="btn-refresh" title={i18n._('Refresh')}>
                                        <i className="icon ion-android-sync"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="form-group">
                    <label className="control-label">{i18n._('Baud rate:')}</label>
                    <Select
                        name="form-baudrate"
                        value={this.state.baudrate}
                        options={_.map(this.state.baudrates, function(baudrate) {
                            return {
                                value: baudrate,
                                label: Number(baudrate).toString()
                            };
                        })}
                        backspaceRemoves={false}
                        clearable={false}
                        searchable={false}
                        placeholder={i18n._('Choose a baud rate')}
                        onChange={(value) => this.setState({baudrate: value})}
                    />
                </div>
                <div className="btn-toolbar" role="toolbar">
                    <button
                        type="button"
                        className="btn btn-primary"
                        disabled={ ! canOpenConnection}
                        onClick={this.openConnection.bind(this)}>
                        <i className="icon ion-power"></i>&nbsp;{i18n._('Open')}
                    </button>
                </div>
            </div>
        );
    }
}

export default class ConnectionWidget extends React.Component {
    render() {
        var options = {
            width: 300,
            header: {
                title: (
                    <div>
                        <i className="icon ion-monitor"></i>
                        &nbsp;
                        <span>{i18n._('Connection')}</span>
                    </div>
                ),
                toolbar: {
                    buttons: [
                        'toggle'
                    ]
                }
            },
            content: (
                <div data-component="Widgets/ConnectionWidget">
                    <Connection />
                </div>
            )
        };
        return (
            <Widget options={options}/>
        );
    }
}
