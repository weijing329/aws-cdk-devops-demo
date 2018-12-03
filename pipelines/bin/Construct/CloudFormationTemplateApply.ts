#!/usr/bin/env node
import codepipeline = require('@aws-cdk/aws-codepipeline');
import cfn = require('@aws-cdk/aws-cloudformation');
import cdk = require('@aws-cdk/cdk');

import { CloudFormationCodeBuildProject } from './CloudFormationCodeBuildProject';

export interface CloudFormationTemplateApplyProps {
  pipeline: codepipeline.Pipeline;
  buildProject: CloudFormationCodeBuildProject;
  stackName: string;
}

export class CloudFormationTemplateApply extends cdk.Construct {
  constructor(parent: cdk.Construct, name: string, props: CloudFormationTemplateApplyProps) {
    super(parent, name);

    const { pipeline, buildProject, stackName } = props;

    // Test
    const testStage = pipeline.addStage('Test');
    const testStackName = `aws-cdk-devops-demo-${stackName}TestingStack`;
    const changeSetName = 'StagedChangeSet';

    new cfn.PipelineCreateReplaceChangeSetAction(this, 'PrepareChangesTest', {
        stage: testStage,
        stackName: testStackName,
        changeSetName,
        runOrder: 1,
        fullPermissions: true,
        templatePath: buildProject.buildAction.outputArtifact.atPath('TestingStack.template.yaml'),
    });

    new cfn.PipelineExecuteChangeSetAction(this, 'ExecuteChangesTest', {
        stage: testStage,
        stackName: testStackName,
        changeSetName,
        runOrder: 2
    });

    // Prod
    const prodStage = pipeline.addStage('Prod');
    const prodStackName = `aws-cdk-devops-demo-${stackName}ProductionStack`;

    new cfn.PipelineCreateReplaceChangeSetAction(this, 'PrepareChanges', {
        stage: prodStage,
        stackName: prodStackName,
        changeSetName,
        runOrder: 1,
        fullPermissions: true,
        templatePath: buildProject.buildAction.outputArtifact.atPath('ProductionStack.template.yaml'),
    });

    new cfn.PipelineExecuteChangeSetAction(this, 'ExecuteChangesProd', {
        stage: prodStage,
        stackName: prodStackName,
        changeSetName,
        runOrder: 2
    });
  }
}