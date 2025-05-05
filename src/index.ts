import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  console.warn('✅ Hide-Semis extension activated')

  const semicolonDeco = vscode.window.createTextEditorDecorationType({
    color: 'transparent',
    letterSpacing: '-0.5ch',
  })

  function update(editor: vscode.TextEditor) {
    const text = editor.document.getText()
    const ranges: vscode.DecorationOptions[] = []
    const regex = /;/g

    // 1) pull the first match
    let match: RegExpExecArray | null = regex.exec(text)
    // 2) loop while there _is_ a match
    while (match !== null) {
      const start = editor.document.positionAt(match.index)
      const end = editor.document.positionAt(match.index + 1)
      ranges.push({ range: new vscode.Range(start, end) })

      // 3) get the next one
      match = regex.exec(text)
    }

    console.warn(`🔍 Hiding ${ranges.length} semicolons`)
    editor.setDecorations(semicolonDeco, ranges)
  }

  if (vscode.window.activeTextEditor) {
    update(vscode.window.activeTextEditor)
  }
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(e => e && update(e)),
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (vscode.window.activeTextEditor?.document === e.document) {
        update(vscode.window.activeTextEditor)
      }
    }),
  )
}

export function deactivate() {}
