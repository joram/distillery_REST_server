import React from 'react';
import {Label, Segment} from 'semantic-ui-react'
import {Line} from 'react-chartjs-2';
import socket from "./socketio";

class TemperatureGraph extends React.Component {

    constructor(props) {
        super(props);
        socket.on('value_update', this.update.bind(this));
        this.state = {
            temperatureData: {},
            labels: [],
        }
    }

    update(data) {
        if(data.module === "temperature_probes") {
            let name = data.variable;
            let val = data.value;
            let state = this.state;
            let now = Date.now();
            let probeData = state.temperatureData[name];


            // add new probe
            if(probeData === undefined){
                state.temperatureData[name] = {
                    data: [],
                    label: name,
                    borderColor: "#3cba9f",
                    fill: false
                };
            }

            // add new data
            state.labels.push(now);
            state.temperatureData[name].data.push({x:now, y:val});
            
            // trim data

            this.setState(state);
            this.forceUpdate()
        }
    }

    chartData() {
        return {
            update: Date.now(),
            labels: this.state.labels,
            datasets: Object.values(this.state.temperatureData),
        }
    }

    chartOptions() {

        return {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        displayFormats: {
                            quarter: 'MMM YYYY'
                        }
                    }
                }]
            },

            scaleShowGridLines: true,
            scaleGridLineColor: 'rgba(0,0,0,.05)',
            scaleGridLineWidth: 1,
            scaleShowHorizontalLines: true,
            scaleShowVerticalLines: true,
            bezierCurve: true,
            bezierCurveTension: 0.4,
            pointDot: true,
            pointDotRadius: 4,
            pointDotStrokeWidth: 1,
            pointHitDetectionRadius: 20,
            datasetStroke: true,
            datasetStrokeWidth: 2,
            datasetFill: true,
            // legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
        }
    }

    render() {
        return (
            <Segment>
                <Label className={"top attached"}>{this.props.name}</Label>
                <div>
                    <Line
                        data={this.chartData()}
                        options={this.chartOptions()}
                    />
                </div>
            </Segment>
        );
    }
}

export default TemperatureGraph;