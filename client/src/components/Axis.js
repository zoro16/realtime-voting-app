import React, { Component } from 'react';
import * as d3Axis from 'd3-axis';
import { select as d3Select } from 'd3-selection';
import '../static/style/Axis.css';


export default class Axis extends Component {
    constructor(props) {
        super(props);
        this.state = {counter: 0};
    }
    componentDidMount() {
        this.renderAxis();
    }

    componentDidUpdate() {
        this.renderAxis();
    }

    renderAxis() {
        const axisType = `axis${this.props.orient}`;
        const axis = d3Axis[axisType]()
              .scale(this.props.scale)
              .tickSize(-this.props.tickSize)
              .tickPadding([6])
              .ticks([4]);

        d3Select(this.axisElement)
            .call(axis);
    }

    render() {
        let counter = this.state.counter + 1;  
        return (
            <g
              key={"axis"+counter}
              className={`Axis Axis-${this.props.orient}`}
              ref={(el) => { this.axisElement = el; }}
              transform={this.props.translate}
              />
        );
    }
}
