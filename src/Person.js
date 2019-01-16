import PropTypes from 'prop-types';
import React, { Component } from 'react'
import { DragSource } from 'react-dnd';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'

/* drag sources */
let eventSource = {
  beginDrag(props) {
    return Object.assign({},
      {event: props.event},

      {anchor: 'drop'}
    )
  }
}

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  event: PropTypes.object.isRequired
}

class Person extends Component {


  render() {
    let {connectDragSource, isDragging, event} = this.props;
    let EventWrapper = BigCalendar.components.eventWrapper;

    return (
      <EventWrapper event={event}>
        {connectDragSource(<div style={{opacity: isDragging ? 0.5 : 1}}>
          {event.title + ' ' + event.emp_name + ' ' + event.emp_lastname}
        </div>)}
      </EventWrapper>

    );
  }
}

Person.propTypes = propTypes;


export default DragSource('event', eventSource, collectSource)(Person);