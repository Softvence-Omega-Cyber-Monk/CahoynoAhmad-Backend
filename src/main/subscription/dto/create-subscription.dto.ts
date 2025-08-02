export class CreateSubscriptionDto {
    planType: string
    dailyGenerations: number
    toneStylesAllowed: number
    publicFeedAccess: Boolean
    communitySharing: Boolean
    postInteraction: Boolean
}
