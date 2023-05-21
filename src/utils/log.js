import config from "./config.js"
import chalk from "chalk"

const surroundWithSpaces = (str) => ` ${str} `

const debugLog = (message, args) => {
  if (!config.debug) {
    return
  }

  let output = message

  for (const arg of args) {
    output = output.replace("$s", chalk.cyan(arg))
  }

  console.log(
    chalk.bgYellow.black(surroundWithSpaces("DEBUG")),
    chalk.bgMagenta.black(surroundWithSpaces(new Date().toISOString())),
    output
  )
}

const log = {
  debug: debugLog,
}

export default log
