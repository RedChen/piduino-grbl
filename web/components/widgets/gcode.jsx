import i18n from 'i18next';
import React from 'react';
import ReactList from 'react-list';
import Widget from '../widget';
import './gcode.css';

export default class GcodeWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commands: []
        };
    }
    handleCommands() {
        var fs = require('fs'); // FIXME
        var file = fs.readFileSync(__dirname + '/../../../test/github.gcode', 'utf8');
        var commands = file.split('\n');
        this.setState({
            commands: commands
        });
    }
    renderItem(index, key) {
        return <div className="list-item" key={key}>
            <div className="number">{index + 1}</div>
            <div className="command">{this.state.commands[index]}</div>
        </div>;
    }
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
                    <button type="button" className="btn btn-default" name="btn-play" title="Play" onClick={this.handleCommands.bind(this)}>
                        <i className="icon ion-play"></i>
                    </button>
                    <div style={{overflow: 'auto', maxHeight: 250}}>
                        <ReactList
                            itemRenderer={this.renderItem.bind(this)}
                            length={this.state.commands.length}
                        />
                    </div>
                </div>
            )
        };
        return (
            <Widget options={options}/>
        );
    }
}
