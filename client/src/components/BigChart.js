import React, { Component } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';

import Axes from './Axes';
import Bars from './Bars';
import ResponsiveWrapper from './ResponsiveWrapper';

class BigChart extends Component {
    constructor() {
        super();
        this.xScale = scaleBand();
        this.yScale = scaleLinear();
        this.state = {counter: 0};
    }

    render() {
        const margins = { top: 50, right: 30, bottom: 100, left: 40 };
        const svgDimensions = {
            width: Math.max(this.props.parentWidth, 300),
            height: 700
        };

        const maxValue = Math.max(...this.props.data.map(d => d.value));
        
        const xScale = this.xScale
              .padding(0.5)
              .domain(this.props.data.map(d => d.title))
              .rangeRound([margins.left, svgDimensions.width - margins.right]);

        const yScale = this.yScale
              .domain([0, maxValue])
              .range([svgDimensions.height - margins.bottom, margins.top]);
        let counter = this.state.counter + 1;

        return (
            <svg width={svgDimensions.width} height={svgDimensions.height}>
              <Axes
                key={"axes"+counter}
                scales={{ xScale, yScale }}
                margins={margins}
                svgDimensions={svgDimensions}
                />
              <Bars
                key={"bars"+this.counter}
                scales={{ xScale, yScale }}
                margins={margins}
                data={this.props.data}
                maxValue={maxValue}
                svgDimensions={svgDimensions}
                />
            </svg>
        );
    }
}

export default ResponsiveWrapper(BigChart);
