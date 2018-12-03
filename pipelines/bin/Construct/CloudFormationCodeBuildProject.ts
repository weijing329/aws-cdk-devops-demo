#!/usr/bin/env node
import codebuild = require('@aws-cdk/aws-codebuild');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');

import { GithubSource } from './GithubSource';

export interface CloudFormationCodeBuildProjectProps {
    pipeline: codepipeline.Pipeline;
    github: GithubSource;
    stackName: string;
    directory: string;
}

export class CloudFormationCodeBuildProject extends cdk.Construct {
    public readonly buildAction: codebuild.PipelineBuildAction;
    constructor(parent: cdk.Construct, name: string, props: CloudFormationCodeBuildProjectProps) {
        super(parent, name);

        const { pipeline, github, directory } = props;

        // Build
        const buildProject = new codebuild.Project(this, 'BuildProject', {
            source: github.buildSource,
            buildSpec: directory + '/buildspec.yml',
            environment: {
              buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_1_0,
              environmentVariables: {
                'ARTIFACTS_BUCKET': {
                    value: pipeline.artifactBucket.bucketName
                }
              },
              privileged: true
            },
            artifacts: new codebuild.S3BucketBuildArtifacts({
                bucket: pipeline.artifactBucket,
                name: 'output.zip'
            })
        });

        buildProject.addToRolePolicy(new iam.PolicyStatement()
            .addAllResources()
            .addAction('ec2:DescribeAvailabilityZones')
            .addAction('route53:ListHostedZonesByName'));
        buildProject.addToRolePolicy(new iam.PolicyStatement()
            .addAction('ssm:GetParameter')
            .addResource(cdk.ArnUtils.fromComponents({
                service: 'ssm',
                resource: 'parameter',
                resourceName: 'CertificateArn-*'
            })));
        buildProject.addToRolePolicy(new iam.PolicyStatement()
            .addAllResources()
            .addActions("ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:GetRepositoryPolicy",
                "ecr:DescribeRepositories",
                "ecr:ListImages",
                "ecr:DescribeImages",
                "ecr:BatchGetImage",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload",
                "ecr:PutImage"));
        buildProject.addToRolePolicy(new iam.PolicyStatement()
            .addAction('cloudformation:DescribeStackResources')
            .addResource(cdk.ArnUtils.fromComponents({
                service: 'cloudformation',
                resource: 'stack',
                resourceName: 'aws-cdk-devops-demo-*'
            })));

        const buildStage = pipeline.addStage('Build');
        const buildAction = buildProject.addBuildToPipeline(buildStage, 'CodeBuild');
        this.buildAction = buildAction;
    }
}
