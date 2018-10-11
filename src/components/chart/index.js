import React, { Component }  from 'react';
import { Line } from 'react-chartjs-2';
import { Col, Card, ListGroup, ListGroupItem, Row, Progress, CardBody, CardHeader, CardFooter,
    ButtonToolbar } from "reactstrap";
import Loader from 'react-loader-spinner'
import * as crosshairs from 'chart.crosshairs.js';
import * as zoom from 'chartjs-plugin-zoom';

import ExchangeButtons from '../../containers/exchange_buttons';
import PeriodButtons from '../../containers/period_buttons';

import './Chart.css';

class ChartComponent extends Component {
    render() {
        const {
            areDataCorrect,
            bitFinexError,
            krakenError,
            currency,
            dataset,
            onBitFinexErrorShow,
            onKrakenErrorShow,
            onLabelsGet,
            onLabelsCallback,
            onLabelsLimitSet,
            onLabelsOffset,
            onPointRadiusSet,
            onTooltipsCallback,
            onCurrencySelect,
            onLastCurrencyValueGet
        } = this.props;


        const options = {
            layout: {
                padding: {
                    left: 10,
                    bottom: 5
                }
            },
            responsive: true,
            hover: {
                mode: 'nearest',
                intersect: false,
                axis: 'x'
            },
            legend: {
                display: false
            },
            crosshairs: {
                mode: 'both',
                color: '#c2cfd6',
                lineWidth: 1.5
            },
            scales: {
                xAxes: [{
                    ticks: {
                        labelOffset: onLabelsOffset(),
                        maxRotation: 0,
                        maxTicksLimit: onLabelsLimitSet(),
                        padding: 10,
                        callback(value, index, values) {
                            return onLabelsCallback(value, index, values);
                        }
                    },
                    gridLines: {
                        drawOnChartArea: false,
                        tickMarkLength: 0
                    }
                }]
            },
            tooltips: {
                mode: 'x',
                intersect: false,
                callbacks: {
                    label(t, d) {
                        return onTooltipsCallback(t, d)
                    }
                }
            },
            maintainAspectRatio: false,
            elements: {
                point: {
                    pointStyle: 'crossRot',
                    radius: 0,
                    hitRadius: onPointRadiusSet(),
                    hoverRadius: onPointRadiusSet()
                }
            },
            zoom: {
                enabled: true,
                mode: 'xy'
            }
        };

        return (
            <div className="mt-4">
                <Row className="mb-4">
                    <Col lg="9">
                        <Card>
                            <CardHeader>Price Charts</CardHeader>
                                <CardBody className="card-body">
                                    <Row className="mb-3">
                                        <Col sm="6" className="d-none d-sm-inline-block">
                                            <ButtonToolbar className="float-left" aria-label="Toolbar with button groups">
                                                <ExchangeButtons/>
                                            </ButtonToolbar>
                                        </Col>
                                        <Col sm="6" className="d-none d-sm-inline-block">
                                            <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                                                <PeriodButtons/>
                                            </ButtonToolbar>
                                        </Col>
                                    </Row>
                                    <div className="chart">
                                        { areDataCorrect() && bitFinexError.length === 0 && krakenError.length === 0
                                            ? <Line data={{ labels: onLabelsGet(), datasets: dataset }} options={options}/>
                                            : <div className="row chart-loading">
                                                <div className="m-auto">
                                                    <div className="m-auto"
                                                         style={{ display: 'grid', justifyContent: 'center' }}>
                                                        <Loader type="Oval" color="#00BFFF" height="70" width="70"/>
                                                    </div>
                                                    <br/>
                                                    {onBitFinexErrorShow()}
                                                    {onKrakenErrorShow()}
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </CardBody>
                            <CardFooter>
                                <ListGroup className='pointer d-flex flex-row'>
                                    <ListGroupItem className="d-none d-md-table-cell bg-light border-0"
                                                   onClick={onCurrencySelect}
                                                   value={0}>
                                        <div className="text-muted">Bitcoin</div>
                                        <strong>{onLastCurrencyValueGet('BTC')}</strong>
                                        <Progress className="progress-xs mt-2"
                                                  color="info"
                                                  value='100'
                                                  hidden={currency !== 'BTC'}/>
                                    </ListGroupItem>

                                    <ListGroupItem className="d-none d-md-table-cell bg-light border-0"
                                                   onClick={onCurrencySelect}
                                                   value={1}>
                                            <div className="text-muted">Ethereum</div>
                                            <strong>{onLastCurrencyValueGet('ETH')}</strong>
                                            <Progress className="progress-xs mt-2"
                                                      color="info"
                                                      value='100'
                                                      hidden={currency !== 'ETH'}/>
                                    </ListGroupItem>

                                    <ListGroupItem className="d-none d-md-table-cell bg-light border-0"
                                                   onClick={onCurrencySelect}
                                                   value={2}>
                                        <div className="text-muted">Litecoin</div>
                                        <strong>{onLastCurrencyValueGet('LTC')}</strong>
                                        <Progress className="progress-xs mt-2"
                                                  color="info"
                                                  value='100'
                                                  hidden={currency !== 'LTC'}/>
                                    </ListGroupItem>

                                    <ListGroupItem className="d-none d-md-table-cell bg-light border-0"
                                                   onClick={onCurrencySelect}
                                                   value={3}>
                                        <div className="text-muted">Dash</div>
                                        <strong>{onLastCurrencyValueGet('DSH')}</strong>
                                        <Progress className="progress-xs mt-2"
                                                  color="info"
                                                  value='100'
                                                  hidden={currency !== 'DSH'}/>
                                    </ListGroupItem>
                                </ListGroup>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ChartComponent;
