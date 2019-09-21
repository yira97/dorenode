import React, { useState, useRef, useEffect } from 'react'
import useKeydown from '../hooks/useKeydown'

export interface ConsoleTabHotkey {
  focus: string
  blur: string
  exec: string
}

const defaultConsoleTabHotKey: ConsoleTabHotkey = {
  focus: ':',
  blur: 'Escape',
  exec: 'Enter',
}

interface HistoryCommand {
  status: boolean
  detail: string
  command: string
  sequence: number
}

const ConsoleTab: React.FC<{
  hotkey?: ConsoleTabHotkey
  doExec: (cmd: string) => [number, boolean, string] // [sequence, status, detail]
  history?: boolean
}> = ({
  hotkey = defaultConsoleTabHotKey,
  doExec,
  history = true
}) => {
    const [colonPressdown, setcolonPressdown] = useState<boolean>(false)
    const [inputStatement, setinputStatement] = useState<string>("")
    const [historyCommand, sethistoryCommand] = useState<HistoryCommand[]>([])

    useKeydown(hotkey.focus, () => {
      setcolonPressdown(true)
    })

    useKeydown(hotkey.blur, () => {
      setcolonPressdown(false)
      setinputStatement("")
    })

    useKeydown(hotkey.exec, () => {
      setinputStatement("")
      const [seq, stat, info] = doExec(inputStatement)
      sethistoryCommand([...historyCommand, { status: stat, command: inputStatement, detail: info, sequence: seq }])
    })

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      if (inputRef.current != null) {
        colonPressdown ? inputRef.current.focus() : inputRef.current.blur()
      }
    }, [colonPressdown])

    return (
      <>
        <div className="row">
          <div className="col">
            <li>
              {
                historyCommand.map(cmd => (
                  <ol key={cmd.sequence}>
                    <span
                      style={cmd.status === true ? { color: "green" } : { color: "red" }}
                    >{cmd.command}====>{cmd.detail}</span>
                  </ol>
                ))
              }
            </li>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              ref={inputRef}
              value={inputStatement}
              onChange={(e) => { setinputStatement(e.target.value) }}
            />
          </div>
        </div>
      </>
    )
  }

export default ConsoleTab
