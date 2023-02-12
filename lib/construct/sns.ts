import { Construct } from "constructs"
import * as sns from "aws-cdk-lib/aws-sns"
import * as iam from "aws-cdk-lib/aws-iam"
import { ConfigType } from "../utils"

type SnsConstrcutProps = {
    config: ConfigType
}

export class SnsTopicConstruct extends Construct {
    public readonly topic: sns.Topic
    constructor(parent: Construct, id: string, props: SnsConstrcutProps) {
        super(parent, id)
        const { config: { env, email } } = props

        this.topic = new sns.Topic(this, id)

        new sns.Subscription(this, `CdkTsSubscription--${env}`, {
            topic: this.topic,
            protocol: sns.SubscriptionProtocol.EMAIL,
            endpoint: email,
        })

        const statement = new iam.PolicyStatement({
            sid: "Allow_Publish_Alarms",
            effect: iam.Effect.ALLOW,
            resources: ["*"],
            principals: [new iam.ServicePrincipal("cloudwatch.amazonaws.com")],
            actions: [
                "sns:Publish"
            ]
        })
        
        this.topic.addToResourcePolicy(statement)
    }
}