import * as path from 'path'
import * as vscode from 'vscode'

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient'

export function activate(context: vscode.ExtensionContext) {
  console.log('server')
  const serverModule = context.asAbsolutePath(path.join('server', 'dist', 'serverMain.js'))
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6006'] }

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions
    }
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'chatdown' }],
    synchronize: {
      configurationSection: []
    }
  }

  const client = new LanguageClient('mls', 'Markdown Language Server', serverOptions, clientOptions)

  const disposable = client.start()
  context.subscriptions.push(disposable)

  context.subscriptions.push(registerCompletion())
}

function registerCompletion() {
  console.log('hi')
  return vscode.languages.registerCompletionItemProvider(
    { pattern: '*.bott' },
    {
      provideCompletionItems(document, position, token, context) {
        return [
          {
            label: 'bot configuration'
          }
        ]
      }
    }
  )
}
