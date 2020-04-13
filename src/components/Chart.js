import React from 'react';
import PropTypes from 'prop-types';

import { abbreviateNumber } from '../lib/util'

import ChartTooltip from './ChartTooltip';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Chart = ( props ) => {
    const { title, className, width, height, data, xDataKey, barDataKey } = props;

    return (
        <div className="charts-wrapper">
            <span>{title}</span>
            <BarChart
              className={className}
              width={width}
              height={height}
              data={data}
              // margin={{
              //   top: 5, right: 30, left: 20, bottom: 5,
              // }}
            >
              <CartesianGrid  stroke="#234" strokeDasharray="3 3" />
              <XAxis 
                dataKey={xDataKey}
                tick={{ fill: '#BDBDBD', fontSize: 10 }} />
              <YAxis 
                tick={{ fill: '#BDBDBD', fontSize: 10 }}
                tickFormatter={tick => {
                return abbreviateNumber(tick)
              }} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey={barDataKey} fill="#FFAA00" />
            </BarChart>
        </div>
    );
};

Chart.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired
};

export default Chart;