#!/usr/bin/env node
import cloudfront = require('@aws-cdk/aws-cloudfront');
import route53 = require('@aws-cdk/aws-route53');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');

export interface IFrontendProps{
    domainName: string;
    siteSubDomain: string;
}

export class Frontend extends cdk.Construct {
    constructor(parent: cdk.Construct, name: string, props: IFrontendProps) {
        super(parent, name);

        const siteDomain = props.siteSubDomain + '.' + props.domainName;

        // Content bucket
        const siteBucket = new s3.Bucket(this, 'SiteBucket', {
            bucketName: siteDomain,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'error.html',
            publicReadAccess: true
        });

        const certificateArn = new cdk.SSMParameterProvider(this, {
            parameterName: 'CertificateArn-' + siteDomain
        }).parameterValue();

        const distribution = new cloudfront.CloudFrontWebDistribution(this, 'SiteDistribution', {
            aliasConfiguration: {
                acmCertRef: certificateArn,
                names: [ siteDomain ],
                sslMethod: cloudfront.SSLMethod.SNI,
                securityPolicy: cloudfront.SecurityPolicyProtocol.TLSv1_1_2016
            },
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: siteBucket
                    },
                    behaviors : [ {isDefaultBehavior: true}],
                }
            ]
        });

        const zone = new route53.HostedZoneProvider(this, { domainName: props.domainName }).findAndImport(this, 'Zone');
        new route53.AliasRecord(zone, 'SiteAliasRecord', {
            recordName: siteDomain,
            target: distribution
        });
    }
}
