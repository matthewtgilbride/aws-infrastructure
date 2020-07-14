import { App, Construct, Stack, StackProps } from "@aws-cdk/core";
import { HostedZone } from "@aws-cdk/aws-route53";
import { DnsValidatedCertificate } from "@aws-cdk/aws-certificatemanager";
import { ParameterTier, StringParameter } from "@aws-cdk/aws-ssm";


export class WildcardCertConstruct extends Construct {
  constructor(scope: Construct, id: string, props: { domainName: string, region?: string }) {
    super(scope, id)

    const zone = HostedZone.fromLookup(this, `${id}-HostedZone`, {
      domainName: props.domainName,
    });

    // wildcard certificate
    new DnsValidatedCertificate(
      this,
      `${id}-DnsValidatedCertificate`,
      {
        domainName: `*.${props.domainName}`,
        hostedZone: zone,
        region: props.region || 'us-east-1', // Cloudfront only checks this region for certificates.
      },
    );
  }
}

export class SSMParameterConstruct extends Construct {
  constructor(scope: Construct, id: string, props: { domainName: string, region?: string }) {
    super(scope, id)

    new StringParameter(this, `${id}-Parameter`, {
      description: 'Value of my main domain name and corresponding Route 53 Hosted Zone',
      parameterName: 'domainName',
      stringValue: props.domainName,
      tier: ParameterTier.STANDARD
    })
  }
}

class WildcardCertStack extends Stack {
  constructor(scope: Construct, id: string, stackProps: StackProps) {
    super(scope, id, stackProps);

    const props = { domainName: 'mattgilbride.com' }

    new WildcardCertConstruct(this, id, props)
    new SSMParameterConstruct(this, `${id}-SSM`, props)
  }
}

const app = new App()

new WildcardCertStack(app, 'wildcard-certificate', {
  env: {
    region: process.env.AWS_DEFAULT_REGION,
    account: process.env.AWS_ACCOUNT_NUMBER,
  }
})

