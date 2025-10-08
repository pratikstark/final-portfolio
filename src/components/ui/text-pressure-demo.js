import React from "react"
import { useTheme } from "./theme-provider.js"
import { TextPressure } from "./interactive-text-pressure.js"

function getTextColor(theme) {
  return "#000000"
}

function getStrokeColor(theme) {
  return theme === "dark" ? "#ff0000" : "#0066ff"
}

export function Default() {
  const { theme } = useTheme()
  return (
    <TextPressure
      text="I'm Pratik"
      flex={false}
      alpha={false}
      stroke={false}
      width={true}
      weight={true}
      italic={false}
      textColor={getTextColor(theme)}
      strokeColor={getStrokeColor(theme)}
      className=""
    />
  )
}