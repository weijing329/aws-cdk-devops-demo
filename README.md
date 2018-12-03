# AWS CDK DevOps Demo

## Prep
### Create AWS Certificate Manager certificates
Create AWS Certificate Manager certificates for 'live' and 'test' subdomains, then put the unique ARN of those certificates in an AWS Systems Manager Parameter Store parameter.  Note that the certificates for the static site (live and test subdomains) must be created in us-east-1, because they are used by CloudFront.

  1. Create and verify certificates via [AWS Certificate Manager Console](https://console.aws.amazon.com/acm/home?region=us-east-1#/)

  2. Store and verify parameters via [AWS Systems Manager - Parameter store](https://console.aws.amazon.com/systems-manager/parameters/?region=us-east-1) 
   
or via command line
```
aws ssm put-parameter --name CertificateArn-live.weijing329.studio --type String --value <arn:aws:acm:...>

aws ssm put-parameter --name CertificateArn-test.weijing329.studio --type String --value <arn:aws:acm:...>
```

### Connection CodeBuild to Github
AWS CodeBuild needs access to your GitHub account to display available repositories.
  1. Create a new CodeBuild project [Create build project](https://console.aws.amazon.com/codesuite/codebuild/project/new?region=us-east-1)
  2. In **Source** panel, change **Source provider** to **GitHub**
  3. Click **Connection to GitHub** button
  4. Click **Authorize aws-codesuite** button
  5. To verify, go to [Github - Authorized OAuth Apps](https://github.com/settings/applications), check if **AWS CodeBuild (N. Virginia)** is on the list. 

### Create Github Access Token
Create a Github Access Token with access to this repo, including "admin:repo_hook" and "repo" permissions.  Then store the token in Parameter Store:
  1. Github Access Token can be created via [Github - Personal access tokens](https://github.com/settings/tokens)
  2. Store and verify secret parameter via [AWS Systems Manager - Parameter store](https://console.aws.amazon.com/systems-manager/parameters/?region=us-east-1) 

or via command line
```
# AWS CloudFormation doesn't currently support the SecureString Systems Manager parameter type.
aws ssm put-parameter --name GitHubToken --type tring --value <GitHubToken>
```

```
yarn workspace pipelines deploy:infrastructure
```

## Deploy
```
yarn install
yarn pipelines:deploy:infrastructure
```

