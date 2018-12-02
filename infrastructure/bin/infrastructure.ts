#!/usr/bin/env node
import cdk = require('@aws-cdk/cdk');
import { Frontend } from './Construct/frontend';

interface InfrastructureStackProps extends cdk.StackProps {
  domainName: string;
  frontendSubDomain: string;
}

class InfrastructureStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props: InfrastructureStackProps) {
    super(parent, name, props);

    new Frontend(this, 'Frontend', {
      domainName: props.domainName,
      siteSubDomain: props.frontendSubDomain
    });
  }
}

const app = new cdk.App();
new InfrastructureStack(app, 'aws-cdk-devops-demo-infrastructure-testing', {
  domainName: 'weijing329.studio',
  frontendSubDomain: 'test'
});
new InfrastructureStack(app, 'aws-cdk-devops-demo-infrastructure-production', {
  domainName: 'weijing329.studio',
  frontendSubDomain: 'live'
});
app.run();
