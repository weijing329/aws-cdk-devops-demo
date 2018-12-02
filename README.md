# AWS CDK DevOps Demo

## Prep

Create AWS Certificate Manager certificates for 'live' and 'test' subdomains, then put the unique ARN of those certificates in an AWS Systems Manager Parameter Store parameter.  Note that the certificates for the static site (live and test subdomains) must be created in us-east-1, because they are used by CloudFront.

  1. Create and verify certificates via [AWS Certificate Manager Console](https://console.aws.amazon.com/acm/home?region=us-east-1#/)

  2. Store and verify parameters via [AWS Systems Manager - Parameter store](https://console.aws.amazon.com/systems-manager/parameters/?region=us-east-1) 
   
or via command line
```
aws ssm put-parameter --name CertificateArn-live.weijing329.studio --type String --value <arn:aws:acm:...>

aws ssm put-parameter --name CertificateArn-test.weijing329.studio --type String --value <arn:aws:acm:...>
```

