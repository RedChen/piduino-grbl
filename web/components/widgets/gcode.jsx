import i18n from 'i18next';
import React from 'react';
import Widget from '../widget';
import './gcode.css';

export default class GcodeWidget extends React.Component {
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
                </div>
            )
        };
        return (
            <Widget options={options}/>
        );
    }
}
