import React, { Component } from "react";
import "./PathFindingDemo.css";
export default class PathFindingDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            mouseIsPressed: false,
            isStartNode: [], // [row,col] of start Node
            isFinishNode: [], // [row,col] of finish Node
        };
    }

    componentDidMount() {
        const nodes = [];
        for (let row = 0; row < 50; row++) {
            const currentRow = [];
            for (let col = 0; col < 50; col++) {
                currentRow.push({ x: row, y: col, isFinish: false, isStart: false, isWall: false });
            }
            nodes.push(currentRow);
        }
        this.setState({ nodes });
    }

    render() {
        const { nodes } = this.state;
        const numColumns = 10; // Custom parameter: number of columns
        const numRows = 10; // Custom parameter: number of rows
    
        return (
            <div className="grid">
                Herro
                {/* {nodes.map((row, rowIndex) => (
                    return(
                    <div key={rowIndex} className="row">
                        {row.map((node, colIndex) => (
                            return(
                          <Node />
                            )
                        ))}
                    </div>
                    )
                ))} */}
            </div>
        );
    }
    
}