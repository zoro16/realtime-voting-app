import React, { Component } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';

import Axes from './Axes';
import Bars from './Bars';
import ResponsiveWrapper from './ResponsiveWrapper';

class Chart extends Component {
    constructor() {
        super();
        this.xScale = scaleBand();
        this.yScale = scaleLinear();
        this.state = {counter: 0};
    }

    getSecondMax(arr){
        let max = Math.max.apply(null, arr); // get the max of the array
        let maxi = arr.indexOf(max);
        arr[maxi] = -Infinity; // replace max in the array with -infinity
        let secondMax = Math.max.apply(null, arr); // get the new max
        arr[maxi] = max;
        return secondMax;
    }

    render() {
        const margins = { top: 50, right: 30, bottom: 100, left: 40 };
        const svgDimensions = {
            width: Math.max(this.props.parentWidth, 300),
            height: 380
        };

        const maxValue = Math.max(...this.props.data.map(d => d.value));
        let arr = [...this.props.data.map(d => d.value)];
        const secondMaxValue = this.getSecondMax(arr);

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
                secondMaxValue={secondMaxValue}
                svgDimensions={svgDimensions}
                />
            </svg>
        );
    }
}

export default ResponsiveWrapper(Chart);
