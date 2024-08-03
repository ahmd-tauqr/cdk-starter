import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import {
  CfnOutput,
  CfnParameter,
  Duration,
  Stack,
  StackProps,
} from 'aws-cdk-lib';

export class CdkStarterStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new CfnBucket(this, 'MyL1Bucket', {
      lifecycleConfiguration: {
        rules: [
          {
            expirationInDays: 1,
            status: 'Enabled',
          },
        ],
      },
    });

    const duration = new CfnParameter(this, 'duration', {
      default: 6,
      minValue: 1,
      maxValue: 10,
      type: 'Number',
    });

    const myL2Bucket = new Bucket(this, 'MyL2Bucket', {
      lifecycleRules: [
        {
          expiration: Duration.days(duration.valueAsNumber),
        },
      ],
    });

    new CfnOutput(this, 'MyL2BucketName', {
      value: myL2Bucket.bucketName,
    });

    new MyL3Bucket(this, 'MyL3Bucket', 3);
  }
}

export class MyL3Bucket extends Construct {
  constructor(scope: Construct, id: string, expiration: number) {
    super(scope, id);

    new Bucket(this, 'L3Bucket', {
      lifecycleRules: [{ expiration: Duration.days(expiration) }],
    });
  }
}
