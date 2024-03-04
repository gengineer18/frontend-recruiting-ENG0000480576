お会計処理を行うcharge関数です。

請求書(Invoice)と支払い(Paymentes)を受け取り、レシート(Receipt)を返却します。

- 支払い方法には `現金` `商品券`での支払いがあります
- 商品券で支払った場合、お釣りは返されません
- 複数の支払い方法が混ざった支払いが可能です
- 複数人で支払いすることが可能です

## 環境構築
事前にnode.jsをインストールしてください
https://nodejs.org/ja/download/
```
npm run install
```

## テストの実行方法
```
npm run test
```