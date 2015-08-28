import _ from 'lodash';
import i18n from 'i18next';
import React from 'react';
import classNames from 'classnames';
import './widget.css';

class WidgetHeaderToolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: false
        };
    }
    handleClick(btn) {
        if (btn === 'btn-toggle') {
            this.props.handleClick(btn, ! this.state.isCollapsed);
            this.setState({isCollapsed: ! this.state.isCollapsed});
            return;
        }

        this.props.handleClick(btn);
    }
    renderDragButton() {
        var style = {
            cursor: 'move'
        };
        return (
            <a href="javascript: void(0)"
               key='btn-drag'
               title=""
               className="btn btn-link btn-drag"
               style={style}
               onClick={this.handleClick.bind(this, 'btn-drag')}>
            <i className="icon ion-ios-drag"></i>
            </a>
        );
    }
    renderRefreshButton() {
        return (
            <a href="javascript: void(0)"
               key='btn-refresh'
               title=""
               className="btn btn-link btn-refresh"
               onClick={this.handleClick.bind(this, 'btn-refresh')}>
            <i className="icon ion-ios-refresh-empty"></i>
            </a>
        );
    }
    renderRemoveButton() {
        return (
            <a href="javascript: void(0)"
               key='btn-remove'
               title={i18n._('Remove')}
               className="btn btn-link btn-remove"
               onClick={this.handleClick.bind(this, 'btn-remove')}>
                <i className="icon ion-ios-close-empty"></i>
            </a>
        );
    }
    renderToggleButton() {
        let iconClasses = classNames(
            'icon',
            { 'ion-ios-arrow-up': ! this.state.isCollapsed },
            { 'ion-ios-arrow-down': this.state.isCollapsed }
        );
        return (
            <a href="javascript: void(0)"
               key='btn-toggle'
               title={i18n._('Expand/Collapse')}
               className="btn btn-link btn-toggle"
               onClick={this.handleClick.bind(this, 'btn-toggle')}>
                <i className={iconClasses}></i>
            </a>
        );
    }
    render() {
        let { options } = this.props;
        options = options || {};

        let toolbarButtons = _.get(options, 'header.toolbar.buttons');
        toolbarButtons = _.map(toolbarButtons, function(button) {
            if (_.isObject(button)) {
                return button;
            }
            if (button === 'refresh') {
                return this.renderRefreshButton();
            }
            if (button === 'remove') {
                return this.renderRemoveButton();
            }
            if (button === 'toggle') {
                return this.renderToggleButton();
            }
        }.bind(this))
        .concat(this.renderDragButton());

        return <div className="widget-header-toolbar btn-group">{toolbarButtons}</div>;
    }
}

class WidgetHeader extends React.Component {
    render() {
        let { options } = this.props;
        options = options || {};
        _.defaultsDeep(options, {
            header: {
                style: 'default',
                title: '',
                toolbar: {
                    buttons: []
                }
            }
        });
        let divClasses = classNames(
            'widget-header',
            'clearfix',
            { 'widget-header-default': options.header.style === 'default' },
            { 'widget-header-inverse': options.header.style === 'inverse' }
        );
        return (
            <div className={divClasses}>
                <h3 className="widget-header-title">{options.header.title}</h3>
                <WidgetHeaderToolbar options={options} handleClick={this.props.handleClick}/>
            </div>
        );
    }
}

class WidgetContent extends React.Component {
    render() {
        let { options } = this.props;
        options = options || {};
        return (
            <div className="widget-content">{options.content}</div>
        );
    }
}

class WidgetFooter extends React.Component {
    render() {
        let { options } = this.props;
        options = options || {};
        _.defaultsDeep(options, {
            footer: {
                style: 'default'
            }
        });
        let divClasses = classNames(
            'widget-footer',
            { 'widget-footer-default': options.footer.style === 'default' },
            { 'widget-footer-inverse': options.footer.style === 'inverse' }
        );
        return (
            <div className={divClasses}></div>
        );
    }
}

export default class Widget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: false
        };
    }
    handleClick(target, val) {
        if (target === 'btn-toggle') {
            this.setState({
                isCollapsed: !!val
            });
        } else if (target === 'btn-remove') {
            this.unmount();
        }
    }
    unmount() {
        let container = React.findDOMNode(this.refs.widgetContainer);
        React.unmountComponentAtNode(container);
        container.remove();
    }
    render() {
        let { options } = this.props;
        let widgetStyle = {
            width: options.width ? options.width : null
        };
        return (
            <div className={options.containerClass} ref="widgetContainer" data-component="Widget" style={widgetStyle}>
                <div className="widget">
                    { options.header && 
                        <WidgetHeader options={options} handleClick={this.handleClick.bind(this)}/>
                    }
                    { options.content && ! this.state.isCollapsed &&
                        <WidgetContent options={options}/>
                    }
                    { options.footer && 
                        <WidgetFooter options={options}/>
                    }
                </div>
            </div>
        );
    }
}

Widget.defaultProps = {
    options: {}
};
Widget.propTypes = {
    options: React.PropTypes.object
};
