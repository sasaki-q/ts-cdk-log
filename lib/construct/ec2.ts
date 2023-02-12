import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";

type Ec2InstanceConstructProps = {
    vpc: ec2.Vpc
    securityGroup: ec2.SecurityGroup
    role: iam.Role
}

export class Ec2InstanceConstruct extends Construct {
    public readonly instance: ec2.Instance
    constructor(parent: Construct, id: string, props: Ec2InstanceConstructProps) {
        super(parent, id)
        const { vpc } = props

        const userData = ec2.UserData.forLinux({
            shebang: `
                sudo yum update -y
                sudo yum install -y docker
                sudo service docker start
                sudo usermod -a -G docker ec2-user
            `
        })

        this.instance = new ec2.Instance(this, id, {
            ...props,
            instanceType: ec2.InstanceType.of(
                ec2.InstanceClass.T2,
                ec2.InstanceSize.MICRO,
            ),
            machineImage: new ec2.AmazonLinuxImage({
                generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
                cpuType: ec2.AmazonLinuxCpuType.X86_64,
            }),
            vpcSubnets: {
                subnets: vpc.publicSubnets,
            },
            userData: userData
        })
    }
}