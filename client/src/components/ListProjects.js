import React, { Component } from 'react';
import ItemProject from './ItemProject';


class ListProjects extends Component {
    createTable() {
        return this.props.projects.map(
            (obj, i) => <ItemProject key={"list"+i} rowDetails={obj} />
        );
    }
    render() {
        return (
            <table className="table">
              <tbody>
                { this.createTable() }
              </tbody>
            </table>
        );
    }
    
}


export default ListProjects;
