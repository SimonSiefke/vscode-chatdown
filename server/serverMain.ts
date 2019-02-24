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
    return []
    return [
      {
        label: 'user',
        kind: CompletionItemKind.Keyword,
        data: 1,
        insertText: 'user: '
      },
      {
        label: 'bot',
        kind: CompletionItemKind.Keyword,
        data: 2,
        insertText: 'bot: '
      }
    ]
  }
)

connection.onCompletionResolve(
  (item: CompletionItem): CompletionItem => {
    if (item.data === 1) {
      item.detail = 'the user says'
      // item.documentation = ''
    } else if (item.data === 2) {
      item.detail = 'the bot says'
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
