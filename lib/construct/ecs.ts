import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as logs from "aws-cdk-lib/aws-logs";
import * as iam from "aws-cdk-lib/aws-iam";
import { ConfigType } from "../utils/getConfig";

type EcsConstructProps = {
    config: ConfigType
    vpc: ec2.Vpc
    loggroup: logs.LogGroup
    securityGroup: ec2.SecurityGroup,
}

export class EcsConstruct extends Construct {
    constructor(parent: Construct, id: string, props: EcsConstructProps) {
        super(parent, id);
        const { config: { env, ecrUri }, vpc, loggroup, securityGroup } = props
        
        const cluster = new ecs.Cluster(this, `CdkTsCluster--${env}`, {
            clusterName: `CdkTsCluster--${env}`,
            vpc: vpc,
            executeCommandConfiguration: {
                logConfiguration: {
                    cloudWatchLogGroup: loggroup,
                    s3KeyPrefix: "cdk-ts-log",
                },
                logging: ecs.ExecuteCommandLogging.OVERRIDE,
            }
        })

        const taskdef = new ecs.TaskDefinition(this, `CdkTsTaskDef--${env}`, {
            cpu: "256",
            memoryMiB: "512",
            compatibility: ecs.Compatibility.FARGATE,
            networkMode: ecs.NetworkMode.AWS_VPC,
            taskRole: iam.Role.fromRoleName(this, "TaskRole", "ecsTaskExecutionRole"),
            executionRole: iam.Role.fromRoleName(this, "ExecutionRole", "ecsTaskExecutionRole"),
        })

        taskdef.addContainer(`CdkTsAddContainer--${env}`, {
            cpu: 256,
            memoryLimitMiB: 512,
            containerName: `CdkTsContainer--${env}`,
            image: ecs.ContainerImage.fromRegistry(ecrUri),
            portMappings: [{
                hostPort: 8080,
                containerPort: 8080,
                protocol: ecs.Protocol.TCP,
            }],
            logging: new ecs.AwsLogDriver({
                streamPrefix: "CdkTsContainerLog",
                logGroup: loggroup,
            }),
        })

        new ecs.FargateService(this, `CdkTsFargateService--${env}`, {
            assignPublicIp: true,
            cluster: cluster,
            desiredCount: 1,
            taskDefinition: taskdef,
            serviceName: `CdkTsFargateService--${env}`,
            vpcSubnets: {
                subnets: vpc.publicSubnets,
            },
            securityGroups: [securityGroup]
        })
    }
}