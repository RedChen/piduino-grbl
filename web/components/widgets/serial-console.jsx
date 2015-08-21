import i18n from 'i18next';
import React from 'react';
import { Widget } from '../widget';

export class SerialConsoleWidget extends React.Component {
    render() {
        var options = {
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
