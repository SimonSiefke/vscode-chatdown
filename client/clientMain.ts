import * as path from 'path'

import { ExtensionContext } from 'vscode'
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient'

export function activate(context: ExtensionContext) {
  const serverModule = context.asAbsolutePath(path.join('server', 'dist', 'serverMain.js'))
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6006'] }

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'plaintext' }],
    synchronize: {
      configurationSection: []
    }
  }

  const client = new LanguageClient('pls', 'Plaintext Language Server', serverOptions, clientOptions)
  const disposable = client.start()
  context.subscriptions.push(disposable)
}
