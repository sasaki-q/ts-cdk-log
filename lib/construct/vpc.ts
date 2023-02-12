import { Construct } from "constructs";
import { Vpc, SubnetType } from "aws-cdk-lib/aws-ec2";

export type VpcConstructProps = {
    env: string
}

export class VpcConstruct extends Construct {
    public readonly vpc: Vpc;

    constructor(scope: Construct, id: string, props: VpcConstructProps) {
        super(scope, id)

        this.vpc = new Vpc(this, id, {
            enableDnsHostnames: true,
            enableDnsSupport: true,
            vpcName: id,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: `TsCdkPublicSubnet1--${props.env}`,
                    subnetType: SubnetType.PUBLIC,
                },
            ]
        })
    }
}