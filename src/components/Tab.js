import React from "react"

const style = {
  padding: "10px 0",
  borderTop: "1.5px solid #363636",
  borderRight: "1.5px solid #363636",
  borderLeft: "1.5px solid #363636",
  marginRight: "5px",
  display: "inline-block",
  cursor: "pointer",
  backgroundColor: "black",
  width: "14%",
  color: "rgba(255, 255, 255, .7)",
  textAlign: "center",
  fontSize: "13px",
  height: "39px"
}

const activeStyle = {
  ...style,
  color: "white",
  borderTop: "2px solid #2493f2",
  backgroundColor: "#222",
}

const Tab = ({ children, isActive }) => (
  <span style={isActive ? activeStyle : style}>{children}</span>
)

export default Tab
