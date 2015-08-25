import i18n from 'i18next';
import React from 'react';
import Widget from '../widget';
import './axes.css';

export default class AxesWidget extends React.Component {
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
                <div data-component="Widgets/AxesWidget">
                    <div className="container-fluid">
                        <div className="row">
                            <table className="table-bordered axes-display-panel">
                                <tbody>
                                    <tr>
                                        <td className="axis-label">X</td>
                                        <td className="axis-position">
                                            <span className="integer-part">-000</span>
                                            <span className="decimal-point">.</span>
                                            <span className="fractional-part">000</span>
                                            <span className="dimension-unit">mm</span>
                                        </td>
                                        <td className="axis-control">
                                            <button type="button" className="btn btn-sm btn-default"><i className="glyphicon glyphicon-list"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="axis-label">Y</td>
                                        <td className="axis-position">
                                            <span className="integer-part">-000</span>
                                            <span className="decimal-point">.</span>
                                            <span className="fractional-part">000</span>
                                            <span className="dimension-unit">mm</span>
                                        </td>
                                        <td className="axis-control">
                                            <button type="button" className="btn btn-sm btn-default"><i className="glyphicon glyphicon-list"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="axis-label">Z</td>
                                        <td className="axis-position">
                                            <span className="integer-part">-000</span>
                                            <span className="decimal-point">.</span>
                                            <span className="fractional-part">000</span>
                                            <span className="dimension-unit">mm</span>
                                        </td>
                                        <td className="axis-control">
                                            <button type="button" className="btn btn-sm btn-default"><i className="glyphicon glyphicon-list"></i></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="row">
                            <div className="axes-control-panel">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="jog-x">
                                                <button type="button" className="btn btn-default jog-x-minus">X-</button>
                                            </td>
                                            <td className="jog-y">
                                                <div className="btn-group-vertical">
                                                    <button type="button" className="btn btn-primary jog-y-plus">Y+<i className="icon ion-arrow-up"></i></button>
                                                    <button type="button" className="btn btn-primary jog-y-minus">Y-<i className="icon ion-arrow-down"></i></button>
                                                </div>
                                            </td>
                                            <td className="jog-x">
                                                <button type="button" className="btn btn-default jog-x-plus">X+</button>
                                            </td>
                                            <td className="jog-z">
                                                <div className="btn-group-vertical">
                                                    <button type="button" className="btn btn-danger jog-z-plus">Z+</button>
                                                    <button type="button" className="btn btn-danger jog-z-minus">Z-</button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="form-group">
                                    <label className="control-label">Feed rate:</label>
                                    <select className="form-control">
                                        <option>500</option>
                                        <option>1000</option>
                                        <option>1500</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="control-label">Distance:</label>
                                    <select className="form-control">
                                        <option>500</option>
                                        <option>1000</option>
                                        <option>1500</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <div className="btn-group" role="group">
                                        <button type="button" className="btn btn-sm btn-default">{i18n._('Go To Zero')}</button>
                                        <button type="button" className="btn btn-sm btn-default">{i18n._('Zero Out')}</button>

                                        <div className="btn-group" role="group">
                                            <button type="button" className="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{i18n._('More')}&nbsp;<span className="caret"></span></button>
                                            <ul className="dropdown-menu">
                                                <li><a href="#">{i18n._('Toggle inch/mm')}</a></li>
                                                <li><a href="#">{i18n._('Homing Sequence')}</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        };
        return (
            <Widget options={options}/>
        );
    }
}
