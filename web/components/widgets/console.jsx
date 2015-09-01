import i18n from 'i18next';
import React from 'react';
import ReactList from 'react-list';
import Widget from '../widget';
import socket from '../../socket';
import './console.css';

class ConsoleInput extends React.Component {
    handleSend() {
    }
    handleClearAll() {
    }
    render() {
        return (
            <div className="console-input">
                <div className="form-inline">
                    <div className="form-group">
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder={i18n._('Command')}/>
                            <div className="input-group-btn">
                                <button className="btn btn-default" type="button" onClick={this.handleSend.bind(this)}>{i18n._('Send')}</button>
                                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="caret"></span>
                                    <span className="sr-only">Toggle Dropdown</span>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-right">
                                    <li><a href="javascript:void(0)" onClick={this.handleClearAll.bind(this)}>{i18n._('Clear all')}</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class ConsoleWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
    }
    componentDidMount() {
    }
    handleMessages(messages) {
        this.setState({messages});
    }
    renderItem(index, key) {
        return (
            <div key={key}>{this.state.messages[index]}</div>
        );
    }
    render() {
        return (
            <div className="console-window">
                <ReactList
                    itemRenderer={this.renderItem.bind(this)}
                    length={this.state.messages.length}
                    type="uniform"
                />
            </div>
        );
    }
}

export default class ConsoleWidget extends React.Component {
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
                    <ConsoleInput />
                    <ConsoleWindow />
                </div>
            )
        };
        return (
            <Widget options={options} />
        );
    }
}
