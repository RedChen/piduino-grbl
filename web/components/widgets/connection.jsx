import i18n from 'i18next';
import React from 'react';
import Select from 'react-select';
import Widget from '../widget';
import './connection.css';

export default class ConnectionWidget extends React.Component {
    getSerialPorts(input, done) {
        setTimeout(function() {
            done(null, {
                options: [
                    { value: 'foo', label: 'foo'},
                    { value: 'bar', label: 'bar'}
                ]
            });
        }, 500);
    }
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
                    <div className="control-panel">
                        <div className="form-group">
                            <label className="control-label">{i18n._('Port:')}</label>
                            <table style={{width: '100%'}}>
                                <tbody>
                                    <tr>
                                        <td>
                                            <Select
                                                name="form-serial-port"
                                                asyncOptions={this.getSerialPorts}
                                                backspaceRemoves={false}
                                                clearable={false}
                                                searchable={false}
                                                placeholder="Choose a serial port"
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
                                name="form-serial-port"
                                value={115200}
                                options={[
                                    { value: 9600, label: '9600' },
                                    { value: 19200, label: '19200' },
                                    { value: 38400, label: '38400' },
                                    { value: 57600, label: '57600' },
                                    { value: 115200, label: '115200' }
                                ]}
                                backspaceRemoves={false}
                                clearable={false}
                                searchable={false}
                                placeholder="Choose a baud rate"
                            />
                        </div>
                        <div className="btn-toolbar" role="toolbar">
                            <button type="button" className="btn btn-primary"><i className="icon ion-power"></i>&nbsp;Open</button>
                        </div>
                    </div>
                </div>
            )
        };
        return (
            <Widget options={options}/>
        );
    }
}
