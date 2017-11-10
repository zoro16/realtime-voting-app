import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';
import { interpolateLab } from 'd3-interpolate';

export default class Bars extends Component {
    constructor(props){
        super(props);
        this.colorScale = null;
    }
    checkForMaxValue(value, title) {
        if((this.props.maxValue === value) ||
           (this.props.secondMaxValue === value &&
            title.slice(0,1) === "A"
           )
          )
            return "#DF0A16";
        else
            return this.colorScale(value);
    }
    render() {
        const { scales, margins, data, svgDimensions } = this.props;
        const { xScale, yScale } = scales;
        const { height } = svgDimensions;

        this.colorScale = scaleLinear()
            .domain([0, this.props.maxValue])
            .range(['#1d7eed', '#082547'])
            .interpolate(interpolateLab);

        const bars = (
            data.map(datum =>
                     <rect
                     key={datum.title}
                     x={xScale(datum.title)}
                     y={yScale(datum.value)}
                     height={height - margins.bottom - scales.yScale(datum.value)}
                     width={xScale.bandwidth()}
                     fill={this.checkForMaxValue(datum.value, datum.title)}
                     />
                    )
        );

        return (
            <g>{bars}</g>
        );
    }
}
