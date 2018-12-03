#!/usr/bin/env node
import codebuild = require('@aws-cdk/aws-codebuild');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import actions = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');

export interface GithubSourceProps {
  pipeline: codepipeline.Pipeline;
  owner: string;
  repo: string;
}

export class GithubSource extends cdk.Construct {
  public readonly sourceAction: actions.SourceAction;

  public readonly buildSource: codebuild.BuildSource;

  constructor(parent: cdk.Construct, name: string, props: GithubSourceProps) {
    super(parent, name);

    const { pipeline, owner, repo } = props;

    // Source
    const githubAccessToken = new cdk.SecretParameter(this, 'GitHubToken', { ssmParameter: 'GitHubToken' });
    const sourceAction = new codepipeline.GitHubSourceAction(this, 'GitHubSource', {
        stage: pipeline.addStage('Source'),
        owner,
        repo,
        oauthToken: githubAccessToken.value
    });
    this.sourceAction = sourceAction;

    this.buildSource = new codebuild.GitHubSource({
        cloneUrl: `https://github.com/${owner}/${repo}`,
        oauthToken: githubAccessToken.value
    });
  }
}
