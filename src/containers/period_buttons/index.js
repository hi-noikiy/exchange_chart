import React, { Component } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import { connect } from 'react-redux';

import { bitfinexDataRequest } from '../../AC/bitfinex';
import { krakenDataRequest } from '../../AC/kraken';
import { filterSwitch } from '../../AC/filter';

import './PeriodButtons.css';

class PeriodButtons extends Component {
    constructor(props) {
        super(props);

        this.state = { selected: 'day' };
    }

    onRadioBtnClick = selected => this.setState({ selected });

    onFilterSwitch = event => {
        const filter = event.target.value;
        const { bitfinexDataRequest, krakenDataRequest, filterSwitch, exchange, currency } = this.props;

        this.onRadioBtnClick(filter);

        filterSwitch(filter);

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
            <ButtonGroup data-toggle='buttons' aria-label='First group' onClick={this.onFilterSwitch}>
                <Button active={selected === 'day'} color='success' outline value='day'>Day</Button>
                <Button active={selected === 'week'} color='success' outline value='week'>Week</Button>
                <Button active={selected === 'month'} color='success' outline value='month'>Month</Button>
                <Button active={selected === 'year'} color='success' outline value='year'>Year</Button>
            </ButtonGroup>
        );
    }
}

const mapStateToProps = state => ({
    currency: state.currency.name,
    exchange: state.exchange.name
});

export default connect(mapStateToProps, { bitfinexDataRequest, filterSwitch, krakenDataRequest })(PeriodButtons);