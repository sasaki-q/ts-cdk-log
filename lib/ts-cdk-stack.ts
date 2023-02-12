import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { 
  VpcConstruct,
  CloudWatchLogsConstruct,
  SecurityGroupConstruct,
  SnsTopicConstruct,
  EcsConstruct,
} from './construct';
import { ConfigType } from './utils';

export class TsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps & { config: ConfigType }) {
    super(scope, id, props);

    const { config } = props
    const { env } = config

    const { vpc } = new VpcConstruct(this, `TsCdkVpc--${env}`, { env });
    const { securityGroup } = new SecurityGroupConstruct(this, `CdkTsSecurityGroup--${env}`, { vpc })
    const { topic } = new SnsTopicConstruct(this, `CdkTsTopic--${env}`, { config })
    const { loggroup } = new CloudWatchLogsConstruct(this, `CdkTsCloudWatchLogs--${env}`, { env, topicArn: topic.topicArn })
    new EcsConstruct(this, `CdkTsEcs--${env}`, { config, vpc, loggroup, securityGroup } )
  }
}
