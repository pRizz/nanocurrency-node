export class TXNTrackingConfig {
    readonly isEnabled: boolean = false
}

export class DiagnosticsConfig {
    readonly txnTrackingConfig: TXNTrackingConfig = new TXNTrackingConfig()
}
