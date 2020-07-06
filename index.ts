import { App, Construct, Stack, StackProps } from "@aws-cdk/core";
import { HostedZone } from "@aws-cdk/aws-route53";
import { DnsValidatedCertificate } from "@aws-cdk/aws-certificatemanager";


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

class WildcardCertStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    new WildcardCertConstruct(this, id, { domainName: 'mattgilbride.com' })
  }
}

const app = new App()

new WildcardCertStack(app, 'wildcard-certificate', {
  env: {
    region: process.env.AWS_DEFAULT_REGION,
    account: process.env.AWS_ACCOUNT_NUMBER,
  }
})

