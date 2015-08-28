import i18n from 'i18next';
import React from 'react';
import settings from '../../config/settings';
import { Link } from 'react-router';

export default class Header extends React.Component {
    render() {
        return (
            <div data-component="Header">
                <nav className="navbar navbar-inverse navbar-fixed-top">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse">
                                <span className="sr-only"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="#">{settings.name}</a>
                        </div>
                        <div className="navbar-collapse collapse" id="navbar-collapse">
                            <ul className="nav navbar-nav">
                                <li><Link to="workspace">{i18n._('Workspace')}</Link></li>
                                <li className="dropdown">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button">{i18n._('Settings')} <span className="caret"></span></a>
                                    <ul className="dropdown-menu" role="menu">
                                        <li className="dropdown-header">{i18n._('Language')}</li>
                                        <li><a href="?lang=de">Deutsch</a></li>
                                        <li><a href="?lang=en">English (US)</a></li>
                                        <li><a href="?lang=es">Español</a></li>
                                        <li><a href="?lang=fr">Français</a></li>
                                        <li><a href="?lang=it">Italiano</a></li>
                                        <li><a href="?lang=ja">日本語</a></li>
                                        <li><a href="?lang=zh-cn">中文 (简体)</a></li>
                                        <li><a href="?lang=zh-tw">中文 (繁體)</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}
