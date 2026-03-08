# aws-infrastructure

Shared AWS infrastructure for `mattgilbride.com`, built with [AWS CDK](https://aws.amazon.com/cdk/) (v1) and TypeScript.

This stack provisions a wildcard SSL/TLS certificate and stores shared parameters in SSM Parameter Store so that other stacks can reference them.

## What it creates

- **Wildcard certificate** (`*.mattgilbride.com`) via AWS Certificate Manager, validated through DNS against an existing Route 53 Hosted Zone
- **SSM Parameter Store entries**:
  - `certificateArn` — ARN of the wildcard certificate (used by CloudFront, ALBs, etc.)
  - `domainName` — the root domain name (`mattgilbride.com`)

## Prerequisites

- Node.js 14+
- Yarn
- AWS CLI configured with credentials
- An existing Route 53 Hosted Zone for `mattgilbride.com`

## Setup

1. Clone the repository and install dependencies:

   ```sh
   yarn install
   ```

2. Configure AWS credentials. Either set up the AWS CLI (`aws configure`) or copy the sample env file:

   ```sh
   cp .env-sample .env
   # fill in your values, then:
   source .env
   ```

## Usage

Synthesize the CloudFormation template (to inspect without deploying):

```sh
make synth
# or
yarn synth
```

Deploy the stack:

```sh
make deploy
# or
yarn deploy
```

Tear down the stack:

```sh
yarn destroy
```

## Project structure

| File | Description |
|---|---|
| `index.ts` | CDK app entry point — defines constructs and the stack |
| `cdk.json` | CDK toolkit configuration |
| `Makefile` | Convenience targets that set region/account and invoke yarn |
| `.env-sample` | Template for required environment variables |
