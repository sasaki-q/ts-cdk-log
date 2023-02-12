import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib"
import * as sns from "aws-cdk-lib/aws-sns";
import * as logs from "aws-cdk-lib/aws-logs";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";

export type CloudWatchConstructProps = {
    env: string
    topicArn: string
}

export class CloudWatchLogsConstruct extends Construct {
    public readonly loggroup: logs.LogGroup

    constructor(parent: Construct, id: string, props: CloudWatchConstructProps) {
        super(parent, id)
        const { env, topicArn } = props;

        const targetStrings = ["demo: cloud watch log"]

        this.loggroup = new logs.LogGroup(this, `CdkTsLogGroup--${env}`)
        this.loggroup.addMetricFilter(`CdkTsSpecifiedStringMetrics--${env}`, {
            metricName: `CdkTsMetric--${env}`,
            metricNamespace: `CdkTsMetricContaier--${env}`,
            filterPattern: logs.FilterPattern.allTerms(...targetStrings)
        })

        const alarm = new cloudwatch.Alarm(this, `CdkTsCloudWatchAlarm--${env}`, {
            metric: new cloudwatch.Metric({
                metricName: `CdkTsMetric--${env}`,
                namespace: `CdkTsMetricContaier--${env}`,
                period: cdk.Duration.minutes(5),
            }),
            threshold: 0,
            evaluationPeriods: 1,
        })

        alarm.addAlarmAction({
            bind() {
                return { alarmActionArn: topicArn };
            }
        })
    }
}