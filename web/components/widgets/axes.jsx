import i18n from 'i18next';
import React from 'react';
import Select from 'react-select';
import Widget from '../widget';
import './axes.css';

export default class AxesWidget extends React.Component {
    changeFeedRate() {
    }
    changeDistance() {
    }
    render() {
        var options = {
            width: 300,
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
                        <div className="row display-panel">
                            <table className="table-bordered">
                                <thead>
                                    <tr>
                                        <th className="table-header">{i18n._('Axis')}</th>
                                        <th className="table-header">{i18n._('Machine Position')}</th>
                                        <th className="table-header">{i18n._('Working Position')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="axis-label">X</td>
                                        <td className="axis-position">
                                            <span className="integer-part">-000</span>
                                            <span className="decimal-point">.</span>
                                            <span className="fractional-part">000</span>
                                            <span className="dimension-unit">mm</span>
                                        </td>
                                        <td className="axis-position">
                                            <span className="integer-part">-000</span>
                                            <span className="decimal-point">.</span>
                                            <span className="fractional-part">000</span>
                                            <span className="dimension-unit">mm</span>
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
                                        <td className="axis-position">
                                            <span className="integer-part">-000</span>
                                            <span className="decimal-point">.</span>
                                            <span className="fractional-part">000</span>
                                            <span className="dimension-unit">mm</span>
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
                                        <td className="axis-position">
                                            <span className="integer-part">-000</span>
                                            <span className="decimal-point">.</span>
                                            <span className="fractional-part">000</span>
                                            <span className="dimension-unit">mm</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="row control-panel">
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
                                <Select
                                    name="form-feedrate"
                                    value={1000}
                                    options={[
                                        { value: 1500, label: 1500 },
                                        { value: 1000, label: 1000 },
                                        { value: 500, label: 500 },
                                        { value: 100, label: 100 }
                                    ]}
                                    backspaceRemoves={false}
                                    clearable={false}
                                    searchable={false}
                                    onChange={this.changeFeedRate}
                                />
                            </div>
                            <div className="form-group">
                                <label className="control-label">Distance:</label>
                                <Select
                                    name="form-distance"
                                    value={1}
                                    options={[
                                        { value: 0.01, label: 0.01 },
                                        { value: 0.1, label: 0.1 },
                                        { value: 1, label: 1 },
                                        { value: 10, label: 10 },
                                        { value: 100, label: 100 }
                                    ]}
                                    backspaceRemoves={false}
                                    clearable={false}
                                    searchable={false}
                                    onChange={this.changeDistance}
                                />
                            </div>
                            <div className="form-group">
                                <div className="btn-group" role="group">
                                    <button type="button" className="btn btn-sm btn-default">{i18n._('Go To Zero (G0)')}</button>
                                    <button type="button" className="btn btn-sm btn-default">{i18n._('Zero Out (G92)')}</button>

                                    <div className="btn-group dropup" role="group">
                                        <button type="button" className="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="glyphicon glyphicon-list"></i></button>
                                        <ul className="dropdown-menu dropdown-menu-right">
                                            <li><a href="#">{i18n._('Toggle inch/mm')}</a></li>
                                            <li><a href="#">{i18n._('Homing Sequence')}</a></li>
                                            <li className="divider"></li>
                                            <li className="dropdown-header">{i18n._('X Axis')}</li>
                                            <li><a href="#">{i18n._('Go To Zero On X Axis (G0 X0)')}</a></li>
                                            <li><a href="#">{i18n._('Zero Out X Axis (G92 X0)')}</a></li>
                                            <li className="divider"></li>
                                            <li className="dropdown-header">{i18n._('Y Axis')}</li>
                                            <li><a href="#">{i18n._('Go To Zero On Y Axis (G0 Y0)')}</a></li>
                                            <li><a href="#">{i18n._('Zero Out Y Axis (G92 Y0)')}</a></li>
                                            <li className="divider"></li>
                                            <li className="dropdown-header">{i18n._('Z Axis')}</li>
                                            <li><a href="#">{i18n._('Go To Zero On Z Axis (G0 Z0)')}</a></li>
                                            <li><a href="#">{i18n._('Zero Out Z Axis (G92 Z0)')}</a></li>
                                        </ul>
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
