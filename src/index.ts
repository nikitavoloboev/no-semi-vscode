import * as vscode from 'vscode'

let semicolonDeco: vscode.TextEditorDecorationType
let disposables: vscode.Disposable[] = []

export function activate(context: vscode.ExtensionContext) {
  // Helper: do the semicolon-hiding work
  function update(editor: vscode.TextEditor) {
    const lang = editor.document.languageId
    if (lang !== 'typescript' && lang !== 'typescriptreact')
      return

    const text = editor.document.getText()
    const ranges: vscode.DecorationOptions[] = []
    const regex = /;/g
    for (
      let match: RegExpExecArray | null = regex.exec(text);
      match !== null;
      match = regex.exec(text)
    ) {
      const start = editor.document.positionAt(match.index)
      const end = editor.document.positionAt(match.index + 1)
      ranges.push({ range: new vscode.Range(start, end) })
    }
    editor.setDecorations(semicolonDeco, ranges)
  }

  // Register or unregister based on the setting
  function refreshRegistration() {
    // Clean up any old registrations
    disposables.forEach(d => d.dispose())
    disposables = []

    const cfg = vscode.workspace.getConfiguration('noSemi')
    if (!cfg.get<boolean>('enabled', false)) {
      // Not enabled: nothing else to do
      return
    }

    // First-time: create the decoration type
    semicolonDeco = vscode.window.createTextEditorDecorationType({
      color: 'transparent',
      letterSpacing: '-0.5ch',
    })

    // Wire up listeners—and immediately do one update if there's an active editor
    if (vscode.window.activeTextEditor) {
      update(vscode.window.activeTextEditor)
    }
    disposables.push(
      vscode.window.onDidChangeActiveTextEditor(e => e && update(e)),
      vscode.workspace.onDidChangeTextDocument((e) => {
        if (vscode.window.activeTextEditor?.document === e.document)
          update(vscode.window.activeTextEditor)
      }),
    )

    // Keep the decorations type alive until disabled
    disposables.push(semicolonDeco)
  }

  // Listen for when the user toggles noSemi.enabled in settings
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('noSemi.enabled')) {
        refreshRegistration()
      }
    }),
  )

  // Initial registration pass
  refreshRegistration()
}

export function deactivate() {}
