import { Construct } from "constructs";
import { SecurityGroup, Vpc } from "aws-cdk-lib/aws-ec2";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export type SecurityGroupConstructProps = {
    vpc: Vpc
}

export class SecurityGroupConstruct extends Construct {
    public readonly securityGroup: SecurityGroup
    constructor(parent: Construct, id: string, props: SecurityGroupConstructProps) {
        super(parent, id)

        this.securityGroup = new SecurityGroup(this, id, {
            vpc: props.vpc,
            allowAllOutbound: true,
            securityGroupName: id,
        })

        this.securityGroup.addIngressRule(
            ec2.Peer.anyIpv4(),
            ec2.Port.allTcp(),
        )
    }
}