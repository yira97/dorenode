const CommandTypeList = ['ADD', 'CONNECT', 'BREAK', 'DROP']

interface RawCommand {
  type: string
  params: string[]
}

interface INode {
  id: string
  name: string
  describe: string
}

interface INodeGraph {
  AddNode: (name?: string) => string
  Break: (IDFrom: string, IDTo: string) => boolean
  Connect: (IDFrom: string, IDTo: string) => boolean
  Drop: (ID: string) => boolean
}

const parseStatement = (statement: string): [RawCommand, boolean] => {
  const words = statement.split(' ')

  if (words.length === 0) {
    return [{ type: "", params: [] }, false]
  }

  const formCommand = words[0].toUpperCase()

  if (CommandTypeList.indexOf(formCommand) < 0) {
    return [{ type: "", params: [] }, false]
  }

  const cmd = {
    type: formCommand,
    params: words.slice(1),
  }

  return [cmd, true]
}

const updateGraph = (graph: INodeGraph, cmd: RawCommand): [string, boolean] => {
  switch (cmd.type) {
    case 'ADD':
      if (cmd.params.length < 1) {
        return ["missing parameter", false]
      }
      return [graph.AddNode(cmd.params[0]), true]

    case 'CONNECT':
      if (cmd.params.length < 2) {
        return ["missing parameter", false]
      }
      return ["", graph.Connect(cmd.params[0], cmd.params[1])]

    case 'BREAK':
      if (cmd.params.length < 2) {
        return ["missing parameter", false]
      }
      return ["", graph.Break(cmd.params[0], cmd.params[1])]

    case 'DROP':
      if (cmd.params.length < 1) {
        return ["missing parameter", false]
      }
      return ["", graph.Drop(cmd.params[0])]

    default:
      return ["invalid commmand", false]
  }
}

class doreNode implements INode {

  private static Incrementor = 1
  private static readonly charset = 'abcdefghijklmnopqrstuvwxyz'

  public id: string
  public name: string
  public describe: string

  constructor(pName: string = "", pDescribe: string = "") {
    this.name = pName
    this.describe = pDescribe
    this.id = ''
    let rem = doreNode.Incrementor
    while (rem > 0) {
      this.id += doreNode.charset[rem % (doreNode.charset.length)]
      console.log(this.id)
      rem = Math.floor(rem / doreNode.charset.length)
      console.log(rem)
    }

    doreNode.Incrementor += 1
  }
}

interface ChainNode {
  inNode: Set<string>
  outNode: Set<string>
  self: doreNode
}

class NodeGraph implements INodeGraph {
  g: Map<string, ChainNode>

  constructor() {
    this.g = new Map<string, ChainNode>()
  }

  AddNode(name?: string): string {
    const n = new doreNode(name)
    this.g.set(n.id, { inNode: new Set<string>(), outNode: new Set<string>(), self: n })
    return n.id
  }

  Connect(IDFrom: string, IDTo: string): boolean {
    const nodeFrom = this.g.get(IDFrom)
    const nodeTo = this.g.get(IDTo)
    if (nodeFrom === undefined || nodeTo === undefined) {
      return false
    }

    nodeFrom.outNode.add(IDTo)
    nodeTo.inNode.add(IDFrom)
    return true
  }

  Break(IDFrom: string, IDTo: string): boolean {
    const nodeFrom = this.g.get(IDFrom)
    const nodeTo = this.g.get(IDTo)
    if (nodeFrom === undefined || nodeTo === undefined) {
      return false
    }

    nodeFrom.outNode.delete(IDTo)
    nodeTo.inNode.delete(IDFrom)
    return true
  }

  Drop(ID: string): boolean {
    const cNode = this.g.get(ID)
    if (cNode === undefined) {
      return false
    }
    for (const i in cNode.inNode) {
      this.Break(i, ID)
    }
    for (const o in cNode.outNode) {
      this.Break(ID, o)
    }
    this.g.delete(ID)
    return true
  }


}

export class GraphManager {

  private g: NodeGraph

  constructor() {
    this.g = new NodeGraph()
  }

  Exec(statement: string): [string, boolean] {
    const [cmd, parseRes] = parseStatement(statement)
    if (parseRes === false) {
      return ["parse statement error", false]
    }

    const [info, updateRes] = updateGraph(this.g, cmd)
    return [info, updateRes]
  }
}

