import React from 'react'
import type { Visit } from "../actions/visits";

export type Props = {
    label: React.Node,
    date: Date,
    drilldownView: string,
    onDrillDown: Function,
    isOffRange: boolean,
    // visitCount: number,
    visits: { [key: Date]: Array<Visit> },
}
  
const DateHeader = ({ label, drilldownView, onDrillDown, visits, date }: Props) => {
  if (!drilldownView) {
    console.dir(visits);
    return <span>{label} { visits[date] && visits[date].length } events</span>
  }

  return (
    <a href="/" onClick={onDrillDown}>
      {label}
    </a>
  )
}

export default DateHeader
