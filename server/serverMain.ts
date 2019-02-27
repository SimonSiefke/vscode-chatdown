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
console.log('listen')
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
    console.log(position)
    return [
      {
        label: 'user',
        kind: CompletionItemKind.Property,
        data: 1,
        insertText: 'user: '
      },
      {
        label: 'bot',
        kind: CompletionItemKind.Property,
        data: 2,
        insertText: 'bot: '
      }
    ]
  }
)

connection.onCompletionResolve(
  (item: CompletionItem): CompletionItem => {
    switch (item.data) {
      case 1:
        item.documentation = 'the user says'
        break
      case 2:
        item.documentation = 'the bot says'
        break
      default:
        break
    }
    return item
  }
)

connection.onDidChangeTextDocument(params => {
  console.log(`${params.textDocument.uri} changed`)
  console.log(`${JSON.stringify(params.contentChanges, null, 2)}`)
})

connection.listen()
