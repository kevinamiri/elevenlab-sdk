import axios, { ResponseType, AxiosResponse } from "axios";

// ---------- File Types ----------
interface IFile {
    fileId: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    uploadDateUnix: number;
}

// ---------- Voice Types ----------
interface IVoiceSettings {
    similarityBoost: number;
    stability: number;
    style: number;
    useSpeakerBoost?: boolean;
}

interface ITextToSpeechVoiceSettings extends Omit<IVoiceSettings, 'style'> {
    style?: number;
}

interface IEditVoiceSettings {
    similarityBoost: number;       // Corresponds to "Clarity + Similarity Enhancement" in the web app
    stability: number;            // Corresponds to "Stability" slider in the web app
    style?: number;               // Default: 0
    useSpeakerBoost?: boolean;    // Default: true
}


interface IGetVoiceSettingsResponse {
    similarityBoost: number;       // Corresponds to "Clarity + Similarity Enhancement" in the web app
    stability: number;            // Corresponds to "Stability" slider in the web app
    style?: number;               // Default: 0
    useSpeakerBoost?: boolean;    // Default: true
}

interface ITextToSpeechOptions {
    voiceId: string;
    text: string;
    modelId?: string;
    voiceSettings: ITextToSpeechVoiceSettings;
    optimizeStreamingLatency?: 0 | 1 | 2 | 3 | 4;
    outputFormat?: 'mp3_44100' | 'pcm_16000' | 'pcm_22050' | 'pcm_24000' | 'pcm_44100';
}

// ---------- History Types ----------
interface IFeedback {
    audioQuality: boolean;
    emotions: boolean;
    feedback: string;
    glitches: boolean;
    inaccurateClone: boolean;
    other: boolean;
    reviewStatus: "not_reviewed";
    thumbsUp: boolean;
}

interface IHistoryItem {
    characterCountChangeFrom: number;
    characterCountChangeTo: number;
    contentType: string;
    dateUnix: number;
    feedback: IFeedback;
    historyItemId: string;
    modelId: string;
    requestId: string;
    settings: IVoiceSettings;
    state: "created";
    text: string;
    voiceCategory: "premade";
    voiceId: string;
    voiceName: string;
}

// ---------- User Types ----------
interface ISubscription {
    allowedToExtendCharacterLimit: boolean;
    canExtendCharacterLimit: boolean;
    canExtendVoiceLimit: boolean;
    canUseInstantVoiceCloning: boolean;
    canUseProfessionalVoiceCloning: boolean;
    characterCount: number;
    characterLimit: number;
    currency: "usd";
    maxVoiceAddEdits: number;
    nextCharacterCountResetUnix: number;
    professionalVoiceLimit: number;
    status: "trialing";
    tier: string;
    voiceAddEditCounter: number;
    voiceLimit: number;
}

interface IUser {
    canUseDelayedPaymentMethods: boolean;
    isNewUser: boolean;
    subscription: ISubscription;
    xiApiKey: string;
}

// ---------- Voice Data Types ----------
interface IFineTuning {
    fineTuningRequested: boolean;
    finetuningState: "not_started";
    isAllowedToFineTune: boolean;
    language: string;
    manualVerification: IManualVerification;
    manualVerificationRequested: boolean;
    sliceIds: string[];
    verificationAttempts: IVerificationAttempt[];
    verificationAttemptsCount: number;
    verificationFailures: string[];
}

interface IManualVerification {
    extraText: string;
    files: IFile[];
    requestTimeUnix: number;
}

interface IVerificationAttempt {
    accepted: boolean;
    dateUnix: number;
    levenshteinDistance: number;
    recording: IRecording;
    similarity: number;
    text: string;
}

interface IRecording {
    mimeType: string;
    recordingId: string;
    sizeBytes: number;
    transcription: string;
    uploadDateUnix: number;
}

interface ISample {
    fileName: string;
    hash: string;
    mimeType: string;
    sampleId: string;
    sizeBytes: number;
}

interface ISharing {
    clonedByCount: number;
    description: string;
    enabledInLibrary: boolean;
    historyItemSampleId: string;
    labels: Record<string, unknown>;
    likedByCount: number;
    name: string;
    originalVoiceId: string;
    publicOwnerId: string;
    reviewMessage: string;
    reviewStatus: "not_requested";
    status: "enabled";
    whitelistedEmails: string[];
}

interface IVoiceData {
    availableForTiers: string[];
    category: string;
    description: string;
    fineTuning: IFineTuning;
    highQualityBaseModelIds: string[];
    labels: Record<string, unknown>;
    name: string;
    previewUrl: string;
    samples: ISample[];
    settings: IVoiceSettings;
    sharing: ISharing;
    voiceId: string;
}


const BASE_URL = "https://api.elevenlabs.io/v1";

export default class ElevenLabsClient {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    // ---------- Voices ----------
    async getVoices(): Promise<IVoiceData[]> {
        return this.request<IVoiceData[]>("get", `${BASE_URL}/voices`);
    }

    async getVoice(voiceId: string): Promise<IVoiceData> {
        return this.request<IVoiceData>("get", `${BASE_URL}/voices/${voiceId}`);
    }

    async createVoice(name: string, files: IFile[]): Promise<IVoiceData> {
        return this.request<IVoiceData>("post", `${BASE_URL}/voices/add`, { name, files });
    }

    async updateVoice(voiceId: string, name: string, files: IFile[]): Promise<IVoiceData> {
        return this.request<IVoiceData>("post", `${BASE_URL}/voices/${voiceId}/edit`, { name, files });
    }

    async deleteVoice(voiceId: string): Promise<void> {
        await this.request<void>("delete", `${BASE_URL}/voices/${voiceId}`);
    }

    // ---------- Voice Settings ----------
    async getVoiceSettings(voiceId: string): Promise<IGetVoiceSettingsResponse> {
        const url = `${BASE_URL}/voices/${voiceId}/settings`;
        return this.request<IGetVoiceSettingsResponse>("get", url);
    }

    async updateVoiceSettings(voiceId: string, settings: IVoiceSettings): Promise<IVoiceSettings> {
        return this.request<IVoiceSettings>("post", `${BASE_URL}/voices/${voiceId}/settings/edit`, settings);
    }

    async editVoiceSettings(voiceId: string, settings: IEditVoiceSettings): Promise<IVoiceSettings> {
        const url = `${BASE_URL}/voices/${voiceId}/settings/edit`;
        return this.request<IVoiceSettings>("post", url, settings);
    }

    // ---------- Text to Speech Sampling----------
    async textToSpeech(options: ITextToSpeechOptions): Promise<Uint8Array> {
        const url = `${BASE_URL}/voices/${options.voiceId}/text-to-speech`;
        const data = {
            text: options.text,
            modelId: options.modelId || 'eleven_multilingual_v2',
            voiceSettings: options.voiceSettings
        };
        const config = {
            headers: {
                accept: '*/*',
                "xi-api-key": this.apiKey,
                'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer' as ResponseType
        };
        const response = await axios.post<Buffer>(url, data, config);
        return new Uint8Array(response.data as ArrayBuffer);
    }

    async textToSpeechStream(voiceId: string, options: ITextToSpeechOptions): Promise<NodeJS.ReadableStream> {
        const response: AxiosResponse = await this.request("post", `${BASE_URL}/voices/${voiceId}/text-to-speech-stream`, options);
        return response.data;
    }

    // ---------- History ----------
    async getHistory(): Promise<IHistoryItem[]> {
        return this.request<IHistoryItem[]>("get", `${BASE_URL}/history`);
    }

    // ---------- User ----------
    async getUser(): Promise<IUser> {
        return this.request<IUser>("get", `${BASE_URL}/user`);
    }

    async getSubscription(): Promise<ISubscription> {
        return this.request<ISubscription>("get", `${BASE_URL}/user/subscription`);
    }

    // ---------- Helper Methods ----------
    private async request<T>(method: string, url: string, data?: any): Promise<T> {
        const headers = {
            accept: "application/json",
            "xi-api-key": this.apiKey,
        };
        try {
            const response: AxiosResponse<T> = await axios({ method, url, headers, data });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch: ${error}`);
        }
    }
}
