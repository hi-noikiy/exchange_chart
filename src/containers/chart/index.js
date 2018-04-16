import React, { Component } from 'react';
import { connect } from 'react-redux';

import ChartComponent from '../../components/chart';

import { bitfinexDataRequest, bitfinexTickersRequest } from '../../AC/bitfinex';
import { krakenDataRequest } from '../../AC/kraken';
import { changeCurrency } from '../../AC/currency';

class ChartContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bitFinexError: '',
            krakenError: '',
            dates: [],
            data: [],
            dataset: []
        };

        this.backgroundColor = 'rgba(0, 162, 185, 0.1)';
        this.borderColor = 'rgba(0, 162, 185, 0.7)';
        this.borderWidth = '2';
        this.pointBackgroundColor = 'rgba(0, 162, 185, 0.3)';
    }

    componentDidMount() {
        const { bitfinexDataRequest, bitfinexTickersRequest } = this.props;
        bitfinexDataRequest('BTC', '15m', 96);
        bitfinexTickersRequest();
        this.onLabelsGet();
    }

    /*componentDidUpdate() {
        const chart = document.querySelector('canvas');
        console.log('chart', chart);

        if (!chart) return;

        const crosshair = chart.nextSibling;

        console.log('crosshair', crosshair);

        const parent = chart.parentElement.firstElementChild;
        console.log('parent', parent);

        const context = crosshair.getContext("2d");

        crosshair.addEventListener("mousemove", event => {
            let x = event.pageX - crosshair.offsetLeft - 2;
            let y = event.pageY - crosshair.offsetTop - 26;

            console.log('---x---', x);
            console.log('---y---', y);

            context.clearRect(0, 0, crosshair.width, crosshair.height);

            context.beginPath();

            if (x < 53) x = 53;
            if (y > 319) y = 319;
            if (y < 6) y = 7;

            context.moveTo(53, y);
            context.lineTo(crosshair.width - 3, y);
            context.moveTo(x, 6);
            context.lineTo(x, crosshair.height - 33);
            context.strokeStyle = "#282b2e";
            context.stroke();
            context.closePath();

            parent.eventHandler(event);
        });
    }*/

    componentWillReceiveProps(nextProps) {
        if (nextProps.bitFinexData.error && nextProps.bitFinexData.error.length !== 0) {
            this.setState({ bitFinexError: 'BitFinexRateLimit error. Please try again later. You can use Kraken' });
        }

        if (nextProps.krakenData.error && nextProps.krakenData.error.length !== 0) {
            this.setState({ krakenError: 'KrakenError. Please try again later. You can use BitFinex' });
        }

        if (nextProps.exchange === 'kraken') {
            this.setState({
                bitFinexError: '',
                data: nextProps.krakenData.values,
                dates: nextProps.krakenData.dates,
            });
        } else {
            this.setState({
                krakenError: '',
                data: nextProps.bitFinexData.values,
                dates: nextProps.bitFinexData.dates
            });
        }

        this.setState({
            filter: nextProps.filter,
            exchange: nextProps.exchange,
            tickers: nextProps.tickers
        });

        if (this.props.filter === nextProps.filter) {
            if (!this.onDataCompare(this.props.bitFinexData.values, nextProps.bitFinexData.values)) {
                this.onPageLoadedDefaultCurrency(nextProps.bitFinexData.values);
            }

            if (!this.onDataCompare(this.props.krakenData.values, nextProps.krakenData.values)) {
                this.onPageLoadedDefaultCurrency(nextProps.krakenData.values);
            }
        }
    }

    areDataCorrect = () =>
        this.state.dataset.length !== 0 && !this.props.bitFinexData.fetching && !this.props.krakenData.fetching;

    onBitFinexErrorShow = () => {
        const { bitFinexError } = this.state;
        return bitFinexError.length !== 0 && <h6>{`${bitFinexError}`}</h6>
    };

    onKrakenErrorShow = () => {
        const { krakenError } = this.state;
        return krakenError.length !== 0 && <h6>{`${krakenError}`}</h6>
    };

    onDataCompare = (firstArr, secondArr) => JSON.stringify(firstArr) === JSON.stringify(secondArr);

    onDataGet = data => {
        if (data === undefined || data.length === 0) return;
        return data;
    };

    onLabelsGet = () => {
        const { dates } = this.state;
        if (!dates) return;
        return dates;
    };

    onLabelsLimitSet = () => {
        switch (this.props.filter) {
            case 'day': return 6.9;
            case 'week': return 7.3;
            case 'month': return 7.1;
            case 'year': return 8.2;
        }
    };

    onLabelsFormat = () => {
        switch (this.props.filter) {
            case 'day': return { minute: '2-digit', hour: '2-digit' };
            case 'week': return { weekday: 'short', minute: '2-digit', hour: '2-digit' };
            case 'month': return { minute: '2-digit', hour: '2-digit', day: '2-digit', month: 'short' };
            case 'year': return { day : '2-digit', month : 'short', year : 'numeric' };
        }
    };

    onLabelsCallback = (value, index, values) => {
        const format = this.props.filter === 'day'
            ? new Date(value).toLocaleTimeString('en-GB', this.onLabelsFormat())
            : new Date(value).toLocaleDateString('en-GB', this.onLabelsFormat());

        return index === 0 ? '' : format;
    };

    onTooltipsCallback = (t, d) => {
        const yLabel = d.datasets[t.datasetIndex].data[t.index];
        return `$ ${yLabel}`;
    };

    onPageLoadedDefaultCurrency = nextProps => {
        const defaultDataset = [{
            label: '1 BTC',
            backgroundColor: this.backgroundColor,
            borderColor: this.borderColor,
            borderWidth: this.borderWidth,
            data: this.onDataGet(nextProps),
            pointBackgroundColor: this.pointBackgroundColor
        }];

        this.setState({ dataset: defaultDataset });
    };

    onLabelsOffset = () => {
        switch (this.props.filter) {
            case 'day': return -14;
            case 'week': return -25;
            case 'month': return -32;
            case 'year': return -29;
        }
    };

    onCurrencySelect = event => {
        const id = +event.currentTarget.value;
        const { bitfinexDataRequest, changeCurrency, krakenDataRequest } = this.props;
        const { data, exchange, filter,  } = this.state;
        const tempDataset = [];

        switch (id) {
            case 0:
                changeCurrency('BTC');

                switch (filter) {
                    case 'day': exchange === 'kraken' ? krakenDataRequest('BTC', '15m', 'day') : bitfinexDataRequest('BTC', '15m', 96); break;
                    case 'week': exchange === 'kraken' ? krakenDataRequest('BTC', '1h', 'week') : bitfinexDataRequest('BTC', '1h', 168); break;
                    case 'month': exchange === 'kraken' ? krakenDataRequest('BTC', '4h', 'month') : bitfinexDataRequest('BTC', '6h', 116); break;
                    case 'year': exchange === 'kraken' ? krakenDataRequest('BTC', '1D', 'year') : bitfinexDataRequest('BTC', '1D', 365); break;
                }

                tempDataset.push({
                    label: '1 BTC',
                    backgroundColor: this.backgroundColor,
                    borderColor: this.borderColor,
                    borderWidth: this.borderWidth,
                    data: this.onDataGet(data),
                    pointBackgroundColor: this.pointBackgroundColor
                });

                break;

            case 1:
                changeCurrency('ETH');

                switch (filter) {
                    case 'day': exchange === 'kraken' ? krakenDataRequest('ETH', '15m', 'day') : bitfinexDataRequest('ETH', '15m', 96); break;
                    case 'week': exchange === 'kraken' ? krakenDataRequest('ETH', '1h', 'week') : bitfinexDataRequest('ETH', '1h', 168); break;
                    case 'month': exchange === 'kraken' ? krakenDataRequest('ETH', '4h', 'month') : bitfinexDataRequest('ETH', '6h', 116); break;
                    case 'year': exchange === 'kraken' ? krakenDataRequest('ETH', '1D', 'year') : bitfinexDataRequest('ETH', '1D', 365); break;
                }

                tempDataset.push({
                    label: '1 ETH',
                    backgroundColor: this.backgroundColor,
                    borderColor: this.borderColor,
                    borderWidth: this.borderWidth,
                    data: this.onDataGet(data),
                    pointBackgroundColor: this.pointBackgroundColor
                });

                break;

            case 2:
                changeCurrency('LTC');

                switch (filter) {
                    case 'day': exchange === 'kraken' ? krakenDataRequest('LTC', '15m', 'day') : bitfinexDataRequest('LTC', '15m', 96); break;
                    case 'week': exchange === 'kraken' ? krakenDataRequest('LTC', '1h', 'week') : bitfinexDataRequest('LTC', '1h', 168); break;
                    case 'month': exchange === 'kraken' ? krakenDataRequest('LTC', '4h', 'month') : bitfinexDataRequest('LTC', '6h', 116); break;
                    case 'year': exchange === 'kraken' ? krakenDataRequest('LTC', '1D', 'year') : bitfinexDataRequest('LTC', '1D', 365); break;
                }

                tempDataset.push({
                    label: '1 LTC',
                    backgroundColor: this.backgroundColor,
                    borderColor: this.borderColor,
                    borderWidth: this.borderWidth,
                    data: this.onDataGet(data),
                    pointBackgroundColor: this.pointBackgroundColor
                });

                break;

            case 3:
                changeCurrency('DSH');

                switch (filter) {
                    case 'day': exchange === 'kraken' ? krakenDataRequest('DSH', '15m', 'day') : bitfinexDataRequest('DSH', '15m', 96); break;
                    case 'week': exchange === 'kraken' ? krakenDataRequest('DSH', '1h', 'week') : bitfinexDataRequest('DSH', '1h', 168); break;
                    case 'month': exchange === 'kraken' ? krakenDataRequest('DSH', '4h', 'month') : bitfinexDataRequest('DSH', '6h', 116); break;
                    case 'year': exchange === 'kraken' ? krakenDataRequest('DSH', '1D', 'year') : bitfinexDataRequest('DSH', '1D', 365); break;}

                tempDataset.push({
                    label: '1 DSH',
                    backgroundColor: this.backgroundColor,
                    borderColor: this.borderColor,
                    borderWidth: this.borderWidth,
                    data: this.onDataGet(data),
                    pointBackgroundColor: this.pointBackgroundColor
                });

                break;

            default: return tempDataset;
        }

        this.setState({ dataset: tempDataset });
    };

    onLastCurrencyValueGet = currency => {
        const { bitFinexData, krakenData } = this.props;
        const { exchange } = this.state;

        if (exchange === 'kraken') {
            switch (currency) {
                case 'BTC': return krakenData.tickers.BTC !== '' ? <strong> 1 BTC = ${krakenData.tickers.BTC}</strong> : <strong> 1 BTC</strong>;
                case 'ETH': return krakenData.tickers.ETH !== '' ? <strong> 1 ETH = ${krakenData.tickers.ETH}</strong> : <strong> 1 ETH</strong>;
                case 'LTC': return krakenData.tickers.LTC !== '' ? <strong> 1 LTC = ${krakenData.tickers.LTC}</strong> : <strong> 1 LTC</strong>;
                case 'DSH': return krakenData.tickers.DSH !== '' ? <strong> 1 DSH = ${krakenData.tickers.DSH}</strong> : <strong> 1 DSH</strong>;
            }
        } else {
            switch (currency) {
                case 'BTC': return bitFinexData.tickers.BTC !== '' ? <strong> 1 BTC = ${bitFinexData.tickers.BTC}</strong> : <strong> 1 BTC</strong>;
                case 'ETH': return bitFinexData.tickers.ETH !== '' ? <strong> 1 ETH = ${bitFinexData.tickers.ETH}</strong> : <strong> 1 ETH</strong>;
                case 'LTC': return bitFinexData.tickers.LTC !== '' ? <strong> 1 LTC = ${bitFinexData.tickers.LTC}</strong> : <strong> 1 LTC</strong>;
                case 'DSH': return bitFinexData.tickers.DSH !== '' ? <strong> 1 DSH = ${bitFinexData.tickers.DSH}</strong> : <strong> 1 DSH</strong>;
            }
        }
    };

    onPointRadiusSet = () => {
        switch (this.props.filter) {
            case 'day': return 4;
            case 'week':
            case 'month': return 3;
            case 'year': return 1;
        }
    };

    componentWillUnmount() {
        const { bitfinexDataClear, chartChangeCurrency, chartFilterSwitch, chartExchangeSwitch,
            krakenDataClear } = this.props;

        bitfinexDataClear();
        krakenDataClear();
        chartChangeCurrency('BTC');
        chartFilterSwitch('day');
        chartExchangeSwitch('bitfinex');
    }

    render() {
        return <ChartComponent {...this.props}
                               {...this.state}
                               areDataCorrect={this.areDataCorrect}
                               onBitFinexErrorShow={this.onBitFinexErrorShow}
                               onKrakenErrorShow={this.onKrakenErrorShow}
                               onDataGet={this.onDataGet}
                               onLabelsGet={this.onLabelsGet}
                               onLabelsCallback={this.onLabelsCallback}
                               onLabelsLimitSet={this.onLabelsLimitSet}
                               onLabelsOffset={this.onLabelsOffset}
                               onCurrencySelect={this.onCurrencySelect}
                               onLastCurrencyValueGet={this.onLastCurrencyValueGet}
                               onPointRadiusSet={this.onPointRadiusSet}
                               onTooltipsCallback={this.onTooltipsCallback}/>
    }
}

const mapStateToProps = state => ({
    bitFinexData: state.bitfinexData,
    krakenData: state.krakenData,
    currency: state.currency.name,
    filter: state.filter.name,
    exchange: state.exchange.name
});

export default connect(mapStateToProps, {
    bitfinexDataRequest,
    bitfinexTickersRequest,
    krakenDataRequest,
    changeCurrency
})(ChartContainer);