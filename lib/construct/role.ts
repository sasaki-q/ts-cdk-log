import { Construct } from "constructs"
import * as iam from "aws-cdk-lib/aws-iam";

type RoleConstructProps = {}

export class RoleConstruct extends Construct {
    public readonly instanceRole: iam.Role;

    constructor(parent: Construct, id: string, props: RoleConstructProps = {}) {
        super(parent, id)

        const statements = new iam.PolicyStatement({
            actions: [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            effect: iam.Effect.ALLOW,
            resources: ["*"],
        })

        const policy = new iam.Policy(this, id, {
            policyName: id,
            statements: [statements],
        })

        this.instanceRole = new iam.Role(this, id, {
            assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
        })

        this.instanceRole.attachInlinePolicy(policy)
    }
}