# BAR雫 店舗管理システム

スナック・バー「BAR雫」の店舗運営を一元管理するWebアプリです。

## 機能

- **スタッフ管理** — 名前・時給・役職の登録と管理
- **シフト管理** — 月間シフト表の作成・編集
- **出勤管理** — 日次の出退勤時刻と手当の記録
- **給与計算** — 勤務時間×時給の自動計算、ドリンクバック・指名料・手当の加算
- **売上管理** — 日次売上（現金・カード・売掛）の入力と月次集計
- **在庫管理** — ボトル・ドリンクの在庫数管理と発注アラート
- **ダッシュボード** — 出勤状況・売上サマリー・在庫アラートの一覧

## セットアップ

### 1. リポジトリのクローンと依存パッケージのインストール

```bash
git clone <repository-url>
cd bar-shizuku
npm install
```

### 2. Clerk（認証）のセットアップ

1. [Clerk](https://clerk.com) でアカウントを作成
2. 新しいアプリケーションを作成
3. ダッシュボードから **Publishable Key** と **Secret Key** をコピー

### 3. データベース（Neon Postgres）のセットアップ

1. [Neon](https://neon.tech) でアカウントを作成
2. 新しいプロジェクトを作成
3. ダッシュボードから **Connection string** をコピー（`postgresql://...` 形式）

> Vercel にデプロイする場合は Vercel Marketplace から Neon を追加すると環境変数が自動で設定されます。

### 4. 環境変数の設定

`.env.local` を作成し、以下を設定します：

```bash
cp .env.example .env.local
```

`.env.local` を編集：

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/bar_shizuku"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxx
CLERK_SECRET_KEY=sk_test_xxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
```

### 5. データベースのセットアップ

```bash
# Prisma クライアントの生成
npm run db:generate

# スキーマをデータベースに反映
npm run db:push
```

### 6. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開きます。

## スクリプト

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番ビルド |
| `npm run db:generate` | Prisma クライアントを生成 |
| `npm run db:push` | スキーマをDBに反映（開発用） |
| `npm run db:migrate` | マイグレーションを作成・適用（本番用） |
| `npm run db:studio` | Prisma Studio でDBを確認 |

## Vercel へのデプロイ

1. [Vercel](https://vercel.com) にリポジトリをインポート
2. Vercel Marketplace から **Neon** を追加（`DATABASE_URL` が自動設定）
3. 環境変数に Clerk のキーを追加
4. デプロイ

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **スタイル**: Tailwind CSS v4 + shadcn/ui (Base UI)
- **データベース**: PostgreSQL (Neon)
- **ORM**: Prisma 6
- **認証**: Clerk v7
- **デプロイ**: Vercel
