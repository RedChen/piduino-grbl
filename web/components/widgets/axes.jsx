import i18n from 'i18next';
import React from 'react';
import { Widget } from '../widget';

export class AxesWidget extends React.Component {
    render() {
        var options = {
            header: {
                title: (
                    <div>
                        <i className="icon ion-levels"></i>
                        &nbsp;
                        <span>{i18n._('Axes')}</span>
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
