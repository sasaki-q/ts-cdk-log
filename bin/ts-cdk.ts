#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DefaultStackSynthesizer } from 'aws-cdk-lib';
import { TsCdkStack } from '../lib/ts-cdk-stack';
import { getConfig } from '../lib/utils';

const app = new cdk.App();
const config = getConfig(app)

new TsCdkStack(app, 'TsCdkStack', {
  synthesizer: new DefaultStackSynthesizer({
    fileAssetsBucketName: 'p-cdk-ts-bucket-q',
  }),
  config
});