export interface VoteProcessorDelegate {

}

export class VoteProcessor {
    constructor(
        private readonly voteProcessorDelegate: VoteProcessorDelegate
    ) {}

    stop() {
        throw 0 // FIXME
    }
}
