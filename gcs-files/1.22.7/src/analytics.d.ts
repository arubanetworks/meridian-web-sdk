/**
 * @internal
 * @packageDocumentation
 */
interface SendAnalyticsCodeEventOptions {
    action: string;
    locationID: string;
    onTagsUpdate?: boolean;
    tagsFilter?: boolean;
    placemarksFilter?: boolean;
    internalUpdate?: boolean;
}
export declare function sendAnalyticsCodeEvent(options: SendAnalyticsCodeEventOptions): Promise<void>;
export {};
