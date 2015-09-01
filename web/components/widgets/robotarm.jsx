import i18n from 'i18next';
import React from 'react';
import Widget from '../widget';
import socket from '../../socket';
import './console.css';

class Slider extends React.Component {
    render() {
        return (
            <div>
                <input
                    ref="range"
                    type="range"
                    min={this.props.min}
                    max={this.props.max}
                    onChange={this.props.onChange}
                />
            </div>
        );
    }
}

export default class ConsoleWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            base: 0,
            axis1: 0,
            axis2: 0,
            axis3: 0,
            turn: 0,
            claw: 0
        };
    }
    componentDidMount() {
        this.handleChange();
    }
    handleChange() {
        var newState = {
            base: React.findDOMNode(this.refs.base.refs.range).value,
            axis1: React.findDOMNode(this.refs.axis1.refs.range).value,
            axis2: React.findDOMNode(this.refs.axis2.refs.range).value,
            axis3: React.findDOMNode(this.refs.axis3.refs.range).value,
            turn: React.findDOMNode(this.refs.turn.refs.range).value,
            claw: React.findDOMNode(this.refs.claw.refs.range).value
        };
        this.setState(newState);

        socket.emit('robot-arm', newState);
    }
    render() {
        var options = {
            width: 300,
            header: {
                title: (
                    <div>
                        <i className="icon ion-monitor"></i>
                        &nbsp;
                        <span>{i18n._('Robot Arm Controller')}</span>
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
                    <Slider ref="base" min={0} max={180} onChange={() => this.handleChange()} />
                    <label>Base: {this.state.base}</label>
                    <Slider ref="axis1" min={0} max={180} onChange={() => this.handleChange()} />
                    <label>Axis #1: {this.state.axis1}</label>
                    <Slider ref="axis2" min={0} max={180} onChange={() => this.handleChange()} />
                    <label>Axis #2: {this.state.axis2}</label>
                    <Slider ref="axis3" min={0} max={180} onChange={() => this.handleChange()} />
                    <label>Axis #3: {this.state.axis3}</label>
                    <Slider ref="turn" min={0} max={180} onChange={() => this.handleChange()} />
                    <label>Turn: {this.state.turn}</label>
                    <Slider ref="claw" min={125} max={175} onChange={() => this.handleChange()} />
                    <label>Claw: {this.state.claw}</label>
                </div>
            )
        };
        return (
            <Widget options={options} />
        );
    }
}
