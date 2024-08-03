import { Fn, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';

interface PhotosHandlerStackProps extends StackProps {
  targetBucketArn: string;
}

export class PhotoshandlerStack extends Stack {
  constructor(scope: Construct, id: string, props: PhotosHandlerStackProps) {
    super(scope, id, props);

    const targetBucket = Fn.importValue('photos-bucket');

    new LambdaFunction(this, 'Photoshandler', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: Code.fromInline(`
        exports.handler = async (event) => {
        console.log("Hello: " + process.env.TARGET_BUCKET)
        }
        `),
      environment: {
        TARGET_BUCKET: props.targetBucketArn,
      },
    });
  }
}
