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
                    <div className="container-fluid axes-display-panel">
                        <div className="row">
                            <table className="table-bordered" style={{width:'100%'}}>
                                <tbody>
                                    <tr>
                                        <td className="axis-label">X</td>
                                        <td className="axis-position">
                                            <span className="integer-part">-20</span>
                                            <span className="decimal-point">.</span>
                                            <span className="fractional-part">000</span>
                                            <span className="dimension-unit">mm</span>
                                        </td>
                                        <td className="axis-control">
                                            <div className="btn-group-vertical btn-group-sm" role="group">
                                                <button type="button" className="btn btn-default">{i18n._('Go To Zero')}</button>
                                                <button type="button" className="btn btn-default">{i18n._('Zero Out')}</button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="axis-label">Y</td>
                                        <td className="axis-position">
                                            <span className="integer-part">-20</span>
                                            <span className="decimal-point">.</span>
                                            <span className="fractional-part">000</span>
                                            <span className="dimension-unit">mm</span>
                                        </td>
                                        <td className="axis-control">
                                            <div className="btn-group-vertical btn-group-sm" role="group">
                                                <button type="button" className="btn btn-default">{i18n._('Go To Zero')}</button>
                                                <button type="button" className="btn btn-default">{i18n._('Zero Out')}</button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="axis-label">Z</td>
                                        <td className="axis-position">
                                            <span className="integer-part">-20</span>
                                            <span className="decimal-point">.</span>
                                            <span className="fractional-part">000</span>
                                            <span className="dimension-unit">mm</span>
                                        </td>
                                        <td className="axis-control">
                                            <div className="btn-group-vertical btn-group-sm" role="group">
                                                <button type="button" className="btn btn-default">{i18n._('Go To Zero')}</button>
                                                <button type="button" className="btn btn-default">{i18n._('Zero Out')}</button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="container-fluid axes-control-panel">
                    </div>
                </div>
            )
        };
        return (
            <Widget options={options}/>
        );
    }
}
