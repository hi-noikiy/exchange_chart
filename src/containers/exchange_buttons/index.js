import React, { Component } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import { connect } from 'react-redux';

import { exchangeSwitch } from '../../AC/exchange';
import { bitfinexDataRequest, bitfinexDataClear, bitfinexTickersRequest } from '../../AC/bitfinex';
import { krakenDataRequest, krakenDataClear, krakenTickersRequest } from '../../AC/kraken';

import './ExchangeButtons.css';

class ExchangeButtons extends Component {
    constructor(props) {
        super(props);

        this.state = { selected: 'bitfinex' };
    }

    onRadioBtnClick = selected => this.setState({ selected });

    onExchangeSwitch = event => {
        const exchange = event.target.value;
        const { bitfinexDataRequest, bitfinexDataClear, bitfinexTickersRequest, currency, filter, exchangeSwitch,
            krakenDataRequest, krakenDataClear, krakenTickersRequest } = this.props;

        this.onRadioBtnClick(exchange);

        exchangeSwitch(exchange);

        if (exchange === 'kraken') {
            bitfinexDataClear();
            krakenTickersRequest();
        } else {
            krakenDataClear();
            bitfinexTickersRequest();
        }

        switch (filter) {
            case 'day':
                switch(currency) {
                    case 'BTC': exchange === 'kraken' ? krakenDataRequest('BTC', '15m', 'day') : bitfinexDataRequest('BTC', '15m', 96); break;
                    case 'ETH': exchange === 'kraken' ? krakenDataRequest('ETH', '15m', 'day') : bitfinexDataRequest('ETH', '15m', 96); break;
                    case 'LTC': exchange === 'kraken' ? krakenDataRequest('LTC', '15m', 'day') : bitfinexDataRequest('LTC', '15m', 96); break;
                    case 'DSH': exchange === 'kraken' ? krakenDataRequest('DSH', '15m', 'day') : bitfinexDataRequest('DSH', '15m', 96); break;
                }
                break;

            case 'week':
                switch(currency) {
                    case 'BTC': exchange === 'kraken' ? krakenDataRequest('BTC', '1h', 'week') : bitfinexDataRequest('BTC', '1h', 168); break;
                    case 'ETH': exchange === 'kraken' ? krakenDataRequest('ETH', '1h', 'week') : bitfinexDataRequest('ETH', '1h', 168); break;
                    case 'LTC': exchange === 'kraken' ? krakenDataRequest('LTC', '1h', 'week') : bitfinexDataRequest('LTC', '1h', 168); break;
                    case 'DSH': exchange === 'kraken' ? krakenDataRequest('DSH', '1h', 'week') : bitfinexDataRequest('DSH', '1h', 168); break;
                }
                break;

            case 'month':
                switch(currency) {
                    case 'BTC': exchange === 'kraken' ? krakenDataRequest('BTC', '4h', 'month') : bitfinexDataRequest('BTC', '6h', 116); break;
                    case 'ETH': exchange === 'kraken' ? krakenDataRequest('ETH', '4h', 'month') : bitfinexDataRequest('ETH', '6h', 116); break;
                    case 'LTC': exchange === 'kraken' ? krakenDataRequest('LTC', '4h', 'month') : bitfinexDataRequest('LTC', '6h', 116); break;
                    case 'DSH': exchange === 'kraken' ? krakenDataRequest('DSH', '4h', 'month') : bitfinexDataRequest('DSH', '6h', 116); break;
                }
                break;

            case 'year':
                switch(currency) {
                    case 'BTC': exchange === 'kraken' ? krakenDataRequest('BTC', '1D', 'year') : bitfinexDataRequest('BTC', '1D', 365); break;
                    case 'ETH': exchange === 'kraken' ? krakenDataRequest('ETH', '1D', 'year') : bitfinexDataRequest('ETH', '1D', 365); break;
                    case 'LTC': exchange === 'kraken' ? krakenDataRequest('LTC', '1D', 'year') : bitfinexDataRequest('LTC', '1D', 365); break;
                    case 'DSH': exchange === 'kraken' ? krakenDataRequest('DSH', '1D', 'year') : bitfinexDataRequest('DSH', '1D', 365); break;
                }
                break;
        }
    };

    render() {
        const { selected } = this.state;
        return (
            <ButtonGroup data-toggle='buttons' aria-label='First group' onClick={this.onExchangeSwitch}>
                <Button active={selected === 'bitfinex'} color='success' outline value='bitfinex'>BitFinex</Button>
                <Button active={selected === 'kraken'} color='success' outline value='kraken'>Kraken</Button>
            </ButtonGroup>
        );
    }
}

const mapStateToProps = state => ({
    currency: state.currency.name,
    filter: state.filter.name
});

export default connect(mapStateToProps, {
    bitfinexDataRequest,
    bitfinexDataClear,
    bitfinexTickersRequest,
    exchangeSwitch,
    krakenDataRequest,
    krakenDataClear,
    krakenTickersRequest
})(ExchangeButtons);