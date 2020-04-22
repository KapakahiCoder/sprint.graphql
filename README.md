<img src="https://cdn-images-1.medium.com/max/1000/1*IvCDlfi3vQfgyKO1eFv4jA.png" alt="graphql" width="400">
### This was created during my time as a [Code Chrysalis](https://codechrysalis.io) Student

# GraphQL

## 1. サーバーのクイックスタート

`yarn start` を実行して、サーバーを起動しましょう。

代わりに `yarn dev` を実行して、ファイルに変更があった場合にサーバーを自動的に再起動するようにしましょう（`nodemon` を使うことで実現しています）。

`http://localhost:4000/graphql` にアクセスして、サーバーが起動していることを確認しましょう。

テストできるクエリは次のとおりです：

```
{
  pokemons {
    id
    name
  }
}
```

```
{
  pokemon(name: "Pikachu") {
    id
    name
  }
}
```

## 2. スキーマ

- 現在、サーバーはポケモンの ID と名前を提供するように設定されています。体重、アタック、進化系についても取得したい場合にはどうしたらよいでしょうか？

- そのためには、スキーマを更新する必要があります。（`server/index.js` 内の）スキーマでは、利用可能なすべてのデータオブジェクトをモデル化する必要があります。`server/data/pokemon.js` を見て、スキーマに追加できる他のフィールドを確認してください。

- スキーマを更新して、ポケモンのデータオブジェクトをスキーマとして完全に表現してください！

- 設計したスキーマをテストしてください！GraphiQL に戻って、いくつかのクエリをテストしてください。GraphQL のすばらしい点は、利用可能な場合でも、完全なデータオブジェクトを取得する必要がないことです。エクスプローラーの右側にある `Docs` をクリックして、完全なスキーマを表示してください。

## 3. リゾルバ

- `server/index.js` のリゾルバは、クエリで要求されたデータを返す関数です。これらの関数の名前が、スキーマの type `Query` にリストアップされているクエリの名前と一致していることに気づくでしょう。

- ここで、別のタイプのリゾルバを追加できます。あなたが興味のある別種類のクエリを考えて、ここに追加してください！

## 4. Mutations

- Mutations を追加したい場合、構成は少し異なります。`type` キーワードを使用する代わりに、`input` キーワードを使用してください。さらに、スキーマ内に `Mutation` と呼ばれるタイプを作成する必要があります。具体例については、以下を参照してください！

```
input MessageInput {
  content: String
  author: String
}

type Message {
  id: ID!
  content: String
  author: String
}

type Query {
  getMessage(id: ID!): Message
}

type Mutation {
  createMessage(input: MessageInput): Message
  updateMessage(id: ID!, input: MessageInput): Message
}
```

## 5. フロントエンド

- `localhost:4000/graphql` を使用して、すべての内容を引き続きテストできます。

## 基礎レベル

- スキーマ
  - ポケモンのデータオブジェクトを完全に表現したスキーマに更新してください！
  - タイプとアタックにアクセスできるように、スキーマを新たに追加してください！
- リゾルバ
  - 名前（すでに実装されている）または Id でポケモンを検索できるようにしてください。
  - 例えば、`Attacks(type: "fast")` のように、アタックを簡単に検索・フィルタリングできるように、リゾルバを新たに追加してください。
  - 特定のタイプのポケモンをすべて取得するためのリゾルバ（+ フィールドリゾルバ）を追加してください。クエリの例：
    ```
    query {
      type(name: "Dragon") {
        Pokemon {
          name
          id
        }
      }
    }
    ```
  - 特定のアタックを持つポケモンをすべて取得するためのリゾルバ（+ フィールドリゾルバ）を追加してください。クエリの例：
    ```
    query {
      attack(name: "Solar Beam") {
        name
        type
        damage
        Pokemon {
          name
          id
        }
      }
    }
    ```
- Mutations
  - ポケモン、タイプ、タイプを変更（追加、修正、削除を含む）するための Mutations を作成してください。

## 中級レベル

- すべての GraphQL クエリの単体テストを作成してください！効率的にテストを行う方法を見つけて、試してみてください！

## 応用レベル

- `express-graphql` の代わりに、`apollo` と呼ばれる別の有名なフレームワークを使用して、すべての内容をセットアップしてみましょう。

## ナイトメアモード

- データベースに接続してデータを保存してみましょう。
