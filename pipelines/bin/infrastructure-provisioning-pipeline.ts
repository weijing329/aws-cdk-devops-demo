#!/usr/bin/env node
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import iam = require('@aws-cdk/aws-iam');

import { GithubSource } from './Construct/GithubSource';
import { CloudFormationCodeBuildProject } from './Construct/CloudFormationCodeBuildProject';
import { CloudFormationTemplateApply } from './Construct/CloudFormationTemplateApply';

const mainProjectName = 'aws-cdk-devops-demo';
const deployResourceName = 'infrastructure';
const sourceCodeDirectory = 'infrastructure';

class InfrastructureProvistioningPipelineStack extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);

        // Pipeline
        const pipeline = new codepipeline.Pipeline(this, 'Pipeline', { 
            pipelineName: `${mainProjectName}-${deployResourceName}`
        });

        pipeline.addToRolePolicy(new iam.PolicyStatement()
            .addAllResources()
            .addActions("ecr:DescribeImages"));

        // Source
        const github = new GithubSource(this, 'GithubSource', {
            pipeline,
            owner: 'weijing329',
            repo: 'aws-cdk-devops-demo'
        });

        // Build Project
        const buildProject = new CloudFormationCodeBuildProject(this, 'BuildProject', {
            pipeline,
            github,
            directory: sourceCodeDirectory
        });

        // Template Apply
        new CloudFormationTemplateApply(this, 'TemplateApply', {
            mainProjectName,
            pipeline,
            buildProject,
            deployResourceName
        });
    }
}

const app = new cdk.App();
new InfrastructureProvistioningPipelineStack(app, `${mainProjectName}-infrastructure-provisioning-pipeline`);
app.run();
