import i18n from 'i18next';
import React from 'react';
import Widget from '../widget';
import socket from '../../socket';
import './console.css';

export default class ConsoleWidget extends React.Component {
    componentDidMount() {
    }
    render() {
        var options = {
            width: 300,
            header: {
                title: (
                    <div>
                        <i className="icon ion-monitor"></i>
                        &nbsp;
                        <span>{i18n._('Console')}</span>
                    </div>
                ),
                toolbar: {
                    buttons: [
                        'toggle'
                    ]
                }
            },
            content: (
                <div data-component="Widgets/ConsoleWidget">
                </div>
            )
        };
        return (
            <Widget options={options} />
        );
    }
}
