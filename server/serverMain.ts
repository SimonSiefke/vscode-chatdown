import {
  IPCMessageReader,
  IPCMessageWriter,
  createConnection,
  IConnection,
  TextDocuments,
  InitializeResult,
  TextDocumentPositionParams,
  CompletionItem,
  CompletionItemKind,
  TextDocumentSyncKind
} from 'vscode-languageserver'

const connection: IConnection = createConnection(
  new IPCMessageReader(process),
  new IPCMessageWriter(process)
)
const documents: TextDocuments = new TextDocuments()
documents.listen(connection)

connection.onInitialize(
  (params): InitializeResult => {
    return {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Full,
        completionProvider: {
          resolveProvider: true
        }
      }
    }
  }
)

// This one cannot co-exist with connection.onDidChangeTextDocument
// documents.onDidChangeContent(change => {
//   console.log('didChangeContent')
// })

connection.onDidChangeWatchedFiles(change => {
  console.log('didChangeWatchedFiles')
})

connection.onCompletion(
  (position: TextDocumentPositionParams): CompletionItem[] => {
    return [
      {
        label: 'user',
        kind: CompletionItemKind.Text,
        data: 1,
        insertText: 'user: '
      },
      {
        label: 'bot',
        kind: CompletionItemKind.Text,
        data: 2,
        insertText: 'bot: '
      }
    ]
  }
)

connection.onCompletionResolve(
  (item: CompletionItem): CompletionItem => {
    if (item.data === 1) {
      item.detail = 'User says'
      // item.documentation = ''
    } else if (item.data === 2) {
      item.detail = 'Bot says'
      // item.documentation = 'JavaScript documentation'
    }
    return item
  }
)

connection.onDidChangeTextDocument(params => {
  console.log(`${params.textDocument.uri} changed`)
  console.log(`${JSON.stringify(params.contentChanges, null, 2)}`)
})

connection.listen()
