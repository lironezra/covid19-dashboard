import React from 'react';
import PropTypes from 'prop-types';

import { abbreviateNumber } from '../lib/util'

import ChartTooltip from './ChartTooltip';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Chart = ( props ) => {
    const { title, className, margin, data, xDataKey, barDataKey } = props;
    
    if (data) { 
      return (
        // <div className="charts-wrapper">
        <>
          <span>{title}</span>
          <ResponsiveContainer>
            <BarChart
              className={className}
              // width={width}
              // height={height}
              data={data}
              margin={margin}
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
          </ResponsiveContainer>
        </>
      // </div>
      );
    }

    return null;
};

Chart.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    margin: PropTypes.object.isRequired
};

export default Chart;