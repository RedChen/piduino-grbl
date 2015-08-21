import i18n from 'i18next';
import React from 'react';
import { Widget } from '../widget';

export class GcodeWidget extends React.Component {
    render() {
        var options = {
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
                        'toggle',
                        'remove'
                    ]
                }
            },
            content: (
                <div>
                    <p></p>
                </div>
            )
        };
        return (
            <Widget options={options}/>
        );
    }
}
