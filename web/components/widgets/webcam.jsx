import i18n from 'i18next';
import React from 'react';
import { Widget } from '../widget';

export class WebcamWidget extends React.Component {
    render() {
        var options = {
            header: {
                title: (
                    <div>
                        <i className="icon ion-videocamera"></i>
                        &nbsp;
                        <span>{i18n._('Webcam')}</span>
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
