import i18n from 'i18next';
import React from 'react';
import Select from 'react-select';
import Widget from '../widget';
import './serial-console.css';

export default class SerialConsoleWidget extends React.Component {
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
                        <span>{i18n._('Serial Console')}</span>
                    </div>
                ),
                toolbar: {
                    buttons: [
                        'toggle'
                    ]
                }
            },
            content: (
                <div data-component="Widgets/SerialConsoleWidget">
                    <div className="control-panel">
                        <div className="form-group">
                            <label className="control-label">{i18n._('Serial port:')}</label>
                            <Select
                                name="form-serial-port"
                                asyncOptions={this.getSerialPorts}
                                backspaceRemoves={false}
                                clearable={false}
                                searchable={false}
                                placeholder="Select a serial port"
                            />
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
