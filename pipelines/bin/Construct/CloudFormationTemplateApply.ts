#!/usr/bin/env node
import codepipeline = require('@aws-cdk/aws-codepipeline');
import cfn = require('@aws-cdk/aws-cloudformation');
import cdk = require('@aws-cdk/cdk');

import { CloudFormationCodeBuildProject } from './CloudFormationCodeBuildProject';

export interface CloudFormationTemplateApplyProps {
    mainProjectName: string;
    pipeline: codepipeline.Pipeline;
    buildProject: CloudFormationCodeBuildProject;
    deployResourceName: string;
}

export class CloudFormationTemplateApply extends cdk.Construct {
  constructor(parent: cdk.Construct, name: string, props: CloudFormationTemplateApplyProps) {
    super(parent, name);

    const { mainProjectName, pipeline, buildProject, deployResourceName } = props;

    // Test
    const testStage = pipeline.addStage('Test');
    const testStackName = `${mainProjectName}-${deployResourceName}-TestingStack`;
    const changeSetName = 'StagedChangeSet';

    new cfn.PipelineCreateReplaceChangeSetAction(this, 'PrepareChangesTest', {
        stage: testStage,
        stackName: testStackName,
        changeSetName,
        runOrder: 1,
        fullPermissions: true,
        templatePath: buildProject.buildAction.outputArtifact.atPath(`${mainProjectName}-${deployResourceName}-testing.template.yaml`),
    });

    new cfn.PipelineExecuteChangeSetAction(this, 'ExecuteChangesTest', {
        stage: testStage,
        stackName: testStackName,
        changeSetName,
        runOrder: 2
    });

    // Prod
    const prodStage = pipeline.addStage('Prod');
    const prodStackName = `${mainProjectName}-${deployResourceName}-ProductionStack`;

    new cfn.PipelineCreateReplaceChangeSetAction(this, 'PrepareChanges', {
        stage: prodStage,
        stackName: prodStackName,
        changeSetName,
        runOrder: 1,
        fullPermissions: true,
        templatePath: buildProject.buildAction.outputArtifact.atPath(`${mainProjectName}-${deployResourceName}-production.template.yaml`),
    });

    new cfn.PipelineExecuteChangeSetAction(this, 'ExecuteChangesProd', {
        stage: prodStage,
        stackName: prodStackName,
        changeSetName,
        runOrder: 2
    });
  }
}